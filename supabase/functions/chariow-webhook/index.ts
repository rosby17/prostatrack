import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const body = await req.json()
    console.log("Chariow Pulse reçu:", JSON.stringify(body))

    const event = body.event
    const data = body.data

    if (event !== "sale.completed" && event !== "sale.paid") {
      return new Response(JSON.stringify({ received: true, action: "ignored", event }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    }

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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    )

    // Calculer la date d'expiration : aujourd'hui + 31 jours
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 31)

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
      // Stocker en pending avec la date d'expiration
      const { error: pendingError } = await supabase
        .from("pending_premium")
        .upsert({
          email: customerEmail.toLowerCase(),
          created_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString()
        })

      if (pendingError) console.error("Erreur pending_premium:", pendingError)

      return new Response(JSON.stringify({ received: true, action: "pending", email: customerEmail }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Vérifier si le profil existe déjà et a une date d'expiration future
    // Si oui, on prolonge depuis cette date (renouvellement anticipé)
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("is_premium, premium_expires_at")
      .eq("id", matchedUser.id)
      .single()

    let newExpiresAt = expiresAt
    if (existingProfile?.premium_expires_at) {
      const currentExpiry = new Date(existingProfile.premium_expires_at)
      if (currentExpiry > new Date()) {
        // Prolonger depuis la date d'expiration actuelle
        currentExpiry.setDate(currentExpiry.getDate() + 31)
        newExpiresAt = currentExpiry
      }
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_premium: true,
        premium_activated_at: new Date().toISOString(),
        premium_expires_at: newExpiresAt.toISOString(),
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

    console.log("✅ Premium activé jusqu'au:", newExpiresAt.toISOString(), "pour:", customerEmail)

    return new Response(
      JSON.stringify({
        received: true,
        action: "activated",
        userId: matchedUser.id,
        email: customerEmail,
        expires_at: newExpiresAt.toISOString()
      }),
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
