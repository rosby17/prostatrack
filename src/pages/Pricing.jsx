import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '../context/SubscriptionContext'
import './Pricing.css'

export default function Pricing() {
  const [annual, setAnnual] = useState(true)
  const { upgrade, isPremium } = useSubscription()
  const navigate = useNavigate()

  const handleSubscribe = () => {
    // Simulate Stripe checkout
    upgrade()
    navigate('/dashboard')
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
            Choisissez le plan qui vous convient pour reprendre le contrôle de votre prostate et retrouver un sommeil réparateur.
          </p>
          
          <div className="billing-toggle">
            <span className={!annual ? 'active' : ''}>Mensuel</span>
            <button 
              className={`toggle-btn ${annual ? 'on' : 'off'}`}
              onClick={() => setAnnual(!annual)}
            >
              <div className="toggle-knob" />
            </button>
            <span className={annual ? 'active' : ''}>Annuel <span className="badge badge-success">Économisez 33%</span></span>
          </div>
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
            <div className="popular-badge">Le plus choisi</div>
            <div className="pricing-card-header">
              <h3>Premium</h3>
              <div className="price">
                <span className="amount">{annual ? '6,58€' : '9,90€'}</span>
                <span className="period">/mois</span>
              </div>
              <p className="text-muted text-sm">
                {annual ? 'Facturé 79€ une fois par an.' : 'Facturé 9,90€ chaque mois. Sans engagement.'}
              </p>
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
              {annual ? 'Commencer l\'abonnement annuel' : 'Commencer l\'abonnement mensuel'}
            </button>
            <p className="text-xs text-muted text-center" style={{ marginTop: 16 }}>
              Paiement sécurisé par Stripe. Annulable à tout moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
