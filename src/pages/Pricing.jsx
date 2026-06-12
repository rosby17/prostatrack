import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '../context/SubscriptionContext'
import './Pricing.css'

export default function Pricing() {
  const { checkStatus, isPremium } = useSubscription()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  const handleSubscribe = () => {
    // Redirect to the Chariow payment link in a new tab
    window.open('https://nextagehealth.mychariow.shop/prd_sasc20', '_blank')
    // Show the pending validation UI
    setIsPending(true)
  }

  const handleCheck = async () => {
    setIsChecking(true)
    const premium = await checkStatus()
    setIsChecking(false)
    
    if (premium) {
      navigate('/dashboard')
    } else {
      alert("Votre paiement n'est pas encore validé. Si vous venez de payer, veuillez patienter quelques minutes ou nous contacter.")
    }
  }

  if (isPremium) {
    return (
      <div className="page-loader">
        <div className="card text-center" style={{ maxWidth: 400 }}>
          <h2 style={{ marginBottom: 16 }}>Vous êtes déjà Premium 🎉</h2>
          <p className="text-muted mb-6">Merci de votre confiance. Vous avez accès à toutes les fonctionnalités.</p>
          <button className="btn btn-primary btn-full" onClick={() => navigate('/dashboard')}>
            Retour au tableau de bord
          </button>
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
            Reprenez le contrôle de votre prostate et retrouvez un sommeil réparateur avec un accès complet à vie.
          </p>
        </div>

        <div className="pricing-grid">
          {/* FREE PLAN */}
          <div className="pricing-card">
            <div className="pricing-card-header">
              <h3>Gratuit</h3>
              <div className="price">
                <span className="amount">0€</span>
              </div>
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
            <div className="popular-badge">Accès à vie</div>
            <div className="pricing-card-header">
              <h3>Premium</h3>
              <div className="price">
                <span className="amount">Paiement unique</span>
              </div>
              <p className="text-muted text-sm">
                Pas d'abonnement. Payez une fois, profitez-en pour toujours.
              </p>
            </div>
            
            {isPending ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <h4 style={{ marginBottom: '16px' }}>Paiement en cours...</h4>
                <p className="text-muted text-sm" style={{ marginBottom: '24px' }}>
                  Une fois votre paiement terminé sur la page sécurisée, cliquez ci-dessous pour vérifier l'activation de votre accès.
                </p>
                <button 
                  className="btn btn-primary btn-full" 
                  onClick={handleCheck}
                  disabled={isChecking}
                >
                  {isChecking ? <span className="spinner" style={{ borderColor: 'var(--teal-light)', borderTopColor: 'var(--white)' }} /> : 'Vérifier mon paiement'}
                </button>
                <button className="btn btn-ghost btn-full" style={{ marginTop: '12px' }} onClick={() => setIsPending(false)}>
                  Annuler
                </button>
              </div>
            ) : (
              <>
                <ul className="pricing-features">
                  <li>✓ <strong>Historique illimité</strong> et graphiques</li>
                  <li>✓ <strong>Analyse détaillée</strong> de votre score</li>
                  <li>✓ <strong>Programme complet</strong> (8 semaines)</li>
                  <li>✓ Export PDF pour votre urologue</li>
                  <li>✓ Rappels intelligents</li>
                  <li>✓ Support prioritaire à vie</li>
                </ul>
                <button className="btn btn-primary btn-full" onClick={handleSubscribe}>
                  Débloquer Premium à vie
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
