import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req: Request) => {
  // Accepter seulement les POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const body = await req.json()
    console.log("Chariow Pulse reçu:", JSON.stringify(body))

    // Chariow envoie l'event et les données de la vente
    const event = body.event
    const data = body.data

    // On ne traite que les ventes complétées
    if (event !== "sale.completed" && event !== "sale.paid") {
      return new Response(JSON.stringify({ received: true, action: "ignored", event }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Récupérer l'email du client depuis le payload Chariow
    const customerEmail =
      data?.customer?.email ||
      data?.sale?.customer?.email ||
      data?.email ||
      null

    if (!customerEmail) {
      console.error("Email client introuvable dans le payload:", JSON.stringify(data))
      return new Response(JSON.stringify({ error: "Email client introuvable" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    console.log("Activation premium pour:", customerEmail)

    // Créer le client Supabase avec la service_role key (accès complet)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    )

    // 1. Trouver l'utilisateur par email dans auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error("Erreur listUsers:", authError)
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }

    const matchedUser = authUsers.users.find(
      (u) => u.email?.toLowerCase() === customerEmail.toLowerCase()
    )

    if (!matchedUser) {
      // L'utilisateur n'a pas encore de compte — on stocke l'email en attente
      // pour qu'il soit activé dès qu'il s'inscrit
      const { error: pendingError } = await supabase
        .from("pending_premium")
        .upsert({ email: customerEmail.toLowerCase(), created_at: new Date().toISOString() })

      if (pendingError) {
        console.error("Erreur pending_premium:", pendingError)
      }

      console.log("Utilisateur non trouvé, email mis en pending:", customerEmail)
      return new Response(JSON.stringify({ received: true, action: "pending", email: customerEmail }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    }

    // 2. Mettre à jour le profil → is_premium = true
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_premium: true,
        premium_activated_at: new Date().toISOString(),
        chariow_sale_id: data?.sale?.id || data?.id || null,
      })
      .eq("id", matchedUser.id)

    if (updateError) {
      console.error("Erreur update profiles:", updateError)
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }

    console.log("✅ Premium activé pour user:", matchedUser.id, "email:", customerEmail)

    return new Response(
      JSON.stringify({ received: true, action: "activated", userId: matchedUser.id, email: customerEmail }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )

  } catch (err) {
    console.error("Erreur générale:", err)
    return new Response(JSON.stringify({ error: "Erreur serveur interne" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
})
