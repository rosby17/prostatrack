import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '../context/SubscriptionContext'
import './Pricing.css'

export default function Pricing() {
  const { checkStatus, isPremium, daysLeft, expiresAt } = useSubscription()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [checkStep, setCheckStep] = useState(0) // 0=idle 1=checking 2=failed

  const handleSubscribe = () => {
    window.open('https://nextagehealth.mychariow.shop/prd_1dkmqi', '_blank')
    setIsPending(true)
  }

  const handleCheck = async () => {
    setIsChecking(true)
    setCheckStep(1)

    // Retry jusqu'à 8 fois avec 3s d'intervalle = 24s max
    let premium = false
    for (let i = 0; i < 8; i++) {
      premium = await checkStatus()
      if (premium) break
      if (i < 7) await new Promise(r => setTimeout(r, 3000))
    }

    setIsChecking(false)

    if (premium) {
      navigate('/dashboard')
    } else {
      setCheckStep(2)
    }
  }

  // Déjà premium — afficher statut + renouvellement
  if (isPremium) {
    const formattedExpiry = expiresAt
      ? expiresAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : null
    const isExpiringSoon = daysLeft !== null && daysLeft <= 7

    return (
      <div className="pricing-page">
        <div className="container">
          <div className="pricing-header">
            <h1 className="section-title">Votre abonnement 💎</h1>
          </div>
          <div className="pricing-grid" style={{ justifyContent: 'center' }}>
            <div className="pricing-card premium" style={{ maxWidth: 480 }}>
              <div className="popular-badge">Actif</div>
              <div className="pricing-card-header">
                <h3>Premium Mensuel</h3>
                {formattedExpiry && (
                  <p className="text-muted text-sm" style={{ marginTop: 8 }}>
                    Accès valide jusqu'au <strong>{formattedExpiry}</strong>
                  </p>
                )}
                {daysLeft !== null && (
                  <p className="text-sm" style={{
                    marginTop: 6,
                    color: isExpiringSoon ? '#e53e3e' : 'var(--teal)',
                    fontWeight: 600
                  }}>
                    {isExpiringSoon
                      ? `⚠️ Plus que ${daysLeft} jour${daysLeft > 1 ? 's' : ''} — renouvelez maintenant`
                      : `✓ ${daysLeft} jours restants`}
                  </p>
                )}
              </div>
              <ul className="pricing-features">
                <li>✓ <strong>Historique illimité</strong> et graphiques</li>
                <li>✓ <strong>Analyse détaillée</strong> de votre score</li>
                <li>✓ <strong>Programme complet</strong> (8 semaines)</li>
                <li>✓ Export PDF pour votre urologue</li>
                <li>✓ Rappels intelligents</li>
                <li>✓ Support prioritaire</li>
              </ul>
              <button className="btn btn-primary btn-full" onClick={handleSubscribe}>
                Renouveler pour 1 mois
              </button>
              <button className="btn btn-outline btn-full" style={{ marginTop: 12 }} onClick={() => navigate('/dashboard')}>
                Retour au tableau de bord
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pricing-page">
      <div className="container">
        <div className="pricing-header">
          <h1 className="section-title">Investissez dans vos nuits</h1>
          <p className="text-muted" style={{ fontSize: 18, maxWidth: 600, margin: '0 auto 40px' }}>
            Reprenez le contrôle de votre prostate et retrouvez un sommeil réparateur.
          </p>
        </div>

        <div className="pricing-grid">
          {/* FREE PLAN */}
          <div className="pricing-card">
            <div className="pricing-card-header">
              <h3>Gratuit</h3>
              <div className="price"><span className="amount">0€</span></div>
              <p className="text-muted text-sm">Pour commencer à suivre vos symptômes.</p>
            </div>
            <ul className="pricing-features">
              <li>✓ Journal quotidien (7 jours max)</li>
              <li>✓ Score de santé basique</li>
              <li>✓ Semaine 1 du programme</li>
              <li className="disabled">✗ Historique illimité</li>
              <li className="disabled">✗ Analyse détaillée du score</li>
              <li className="disabled">✗ Programme complet (8 semaines)</li>
            </ul>
            <button className="btn btn-outline btn-full" onClick={() => navigate('/dashboard')}>
              Continuer en gratuit
            </button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="pricing-card premium">
            <div className="popular-badge">Mensuel</div>
            <div className="pricing-card-header">
              <h3>Premium</h3>
              <div className="price"><span className="amount">Abonnement mensuel</span></div>
              <p className="text-muted text-sm">Renouvelable chaque mois. Annulez quand vous voulez.</p>
            </div>

            {isPending ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>

                {/* ÉTAPE 1 — Vérification en cours */}
                {isChecking && (
                  <>
                    <div style={{ marginBottom: 20 }}>
                      {/* Spinner animé */}
                      <div style={{
                        width: 56, height: 56, margin: '0 auto 16px',
                        border: '4px solid #e5e7eb',
                        borderTop: '4px solid var(--teal)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                    <h4 style={{ marginBottom: 8, color: '#111827' }}>Vérification en cours...</h4>
                    <p className="text-muted text-sm" style={{ marginBottom: 0 }}>
                      Nous confirmons votre paiement.<br />
                      Cela peut prendre quelques secondes.
                    </p>
                  </>
                )}

                {/* ÉTAPE 2 — Échec après tous les retries */}
                {!isChecking && checkStep === 2 && (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                    <h4 style={{ marginBottom: 8, color: '#111827' }}>Paiement en cours de traitement</h4>
                    <p className="text-muted text-sm" style={{ marginBottom: 24 }}>
                      Votre paiement n'est pas encore confirmé. Si vous venez de payer, patientez 1 à 2 minutes et réessayez.
                    </p>
                    <button
                      className="btn btn-primary btn-full"
                      onClick={handleCheck}
                    >
                      Réessayer
                    </button>
                    <button
                      className="btn btn-ghost btn-full"
                      style={{ marginTop: 12 }}
                      onClick={() => { setIsPending(false); setCheckStep(0) }}
                    >
                      Annuler
                    </button>
                  </>
                )}

                {/* ÉTAPE 0 — En attente du clic */}
                {!isChecking && checkStep === 0 && (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                    <h4 style={{ marginBottom: 8, color: '#111827' }}>Paiement en cours...</h4>
                    <p className="text-muted text-sm" style={{ marginBottom: 24 }}>
                      Une fois votre paiement terminé sur la page sécurisée, cliquez ci-dessous pour activer votre accès Premium.
                    </p>
                    <button
                      className="btn btn-primary btn-full"
                      onClick={handleCheck}
                    >
                      Vérifier mon paiement
                    </button>
                    <button
                      className="btn btn-ghost btn-full"
                      style={{ marginTop: 12 }}
                      onClick={() => { setIsPending(false); setCheckStep(0) }}
                    >
                      Annuler
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <ul className="pricing-features">
                  <li>✓ <strong>Historique illimité</strong> et graphiques</li>
                  <li>✓ <strong>Analyse détaillée</strong> de votre score</li>
                  <li>✓ <strong>Programme complet</strong> (8 semaines)</li>
                  <li>✓ Export PDF pour votre urologue</li>
                  <li>✓ Rappels intelligents</li>
                  <li>✓ Support prioritaire</li>
                </ul>
                <button className="btn btn-primary btn-full" onClick={handleSubscribe}>
                  S'abonner pour 1 mois
                </button>
                <p className="text-xs text-muted text-center" style={{ marginTop: 16 }}>
                  Paiement sécurisé. Accès immédiat après validation.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}