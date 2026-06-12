import { Link } from 'react-router-dom'
import { useSubscription } from '../context/SubscriptionContext'

export default function PremiumGate({ children, featureName, fallback }) {
  const { isPremium } = useSubscription()

  if (isPremium) {
    return children
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ filter: 'blur(4px)', opacity: 0.5, pointerEvents: 'none', userSelect: 'none' }}>
        {fallback || children}
      </div>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        background: 'rgba(250, 248, 245, 0.4)'
      }}>
        <div className="card" style={{ maxWidth: '400px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>💎</div>
          <h3 style={{ marginBottom: '8px' }}>Débloquez {featureName}</h3>
          <p className="text-muted text-sm" style={{ marginBottom: '24px' }}>
            Cette fonctionnalité est réservée aux membres Premium. Passez à la vitesse supérieure pour accélérer vos résultats.
          </p>
          <Link to="/pricing" className="btn btn-primary btn-full">
            Découvrir ProstaTrack Premium
          </Link>
        </div>
      </div>
    </div>
  )
}
