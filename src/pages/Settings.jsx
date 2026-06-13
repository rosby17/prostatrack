import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'

const TABS = [
  { key: 'profile', label: '👤 Mon profil' },
  { key: 'password', label: '🔑 Mot de passe' },
  { key: 'subscription', label: '💳 Abonnement' },
]

function Alert({ type, message }) {
  if (!message) return null
  const styles = {
    success: { bg: '#f0fdf4', border: '#86efac', color: '#166534' },
    error: { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b' },
  }
  const s = styles[type]
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, borderRadius: 8, padding: '12px 16px', fontSize: 14, marginBottom: 16 }}>
      {type === 'success' ? '✓ ' : '⚠ '}{message}
    </div>
  )
}

function ProfileTab({ user, updateProfile, updateEmail }) {
  const [name, setName] = useState(user?.user_metadata?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAlert(null)

    const errors = []

    if (name !== (user?.user_metadata?.full_name || '')) {
      const { error } = await updateProfile(name)
      if (error) errors.push('Erreur lors de la mise à jour du nom.')
    }

    if (email !== user?.email) {
      const { error } = await updateEmail(email)
      if (error) errors.push('Erreur lors de la mise à jour de l\'email.')
      else setAlert({ type: 'success', message: 'Un email de confirmation a été envoyé à votre nouvelle adresse.' })
    }

    setLoading(false)

    if (errors.length > 0) {
      setAlert({ type: 'error', message: errors.join(' ') })
    } else if (!email !== user?.email) {
      setAlert({ type: 'success', message: 'Profil mis à jour avec succès.' })
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Mon profil</h2>
      <p className="text-muted text-sm" style={{ marginBottom: 24 }}>Modifiez vos informations personnelles.</p>

      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, padding: 20, background: 'var(--gray-100)', borderRadius: 12 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--teal)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, fontWeight: 700, flexShrink: 0
        }}>
          {(name || user?.email || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: 16, color: 'var(--charcoal)' }}>{name || 'Utilisateur'}</p>
          <p className="text-muted text-sm">{user?.email}</p>
          <p className="text-xs text-muted" style={{ marginTop: 4 }}>
            Membre depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '—'}
          </p>
        </div>
      </div>

      <Alert type={alert?.type} message={alert?.message} />

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label className="form-label">Prénom</label>
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Votre prénom"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Adresse email</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
          />
          {email !== user?.email && (
            <p className="text-xs text-muted" style={{ marginTop: 4 }}>
              ⚠ Un email de confirmation sera envoyé à la nouvelle adresse.
            </p>
          )}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  )
}

function PasswordTab({ updatePassword }) {
  const [form, setForm] = useState({ current: '', newPwd: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAlert(null)

    if (form.newPwd.length < 6) {
      setAlert({ type: 'error', message: 'Le mot de passe doit contenir au moins 6 caractères.' })
      return
    }
    if (form.newPwd !== form.confirm) {
      setAlert({ type: 'error', message: 'Les mots de passe ne correspondent pas.' })
      return
    }

    setLoading(true)
    const { error } = await updatePassword(form.newPwd)
    setLoading(false)

    if (error) {
      setAlert({ type: 'error', message: 'Erreur lors du changement de mot de passe. Reconnectez-vous et réessayez.' })
    } else {
      setAlert({ type: 'success', message: 'Mot de passe mis à jour avec succès.' })
      setForm({ current: '', newPwd: '', confirm: '' })
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Changer le mot de passe</h2>
      <p className="text-muted text-sm" style={{ marginBottom: 24 }}>Choisissez un mot de passe sécurisé d'au moins 6 caractères.</p>

      <Alert type={alert?.type} message={alert?.message} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nouveau mot de passe</label>
          <input
            className="form-input"
            type="password"
            placeholder="Minimum 6 caractères"
            value={form.newPwd}
            onChange={e => setForm(p => ({ ...p, newPwd: e.target.value }))}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Confirmer le nouveau mot de passe</label>
          <input
            className="form-input"
            type="password"
            placeholder="Répétez le mot de passe"
            value={form.confirm}
            onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
            required
          />
        </div>

        {/* Indicateur de force */}
        {form.newPwd && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {[1, 2, 3, 4].map(i => {
                const strength = form.newPwd.length >= 12 ? 4 : form.newPwd.length >= 8 ? 3 : form.newPwd.length >= 6 ? 2 : 1
                return (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 99,
                    background: i <= strength
                      ? strength === 4 ? '#22c55e' : strength === 3 ? '#84cc16' : strength === 2 ? '#f59e0b' : '#ef4444'
                      : 'var(--gray-200)'
                  }} />
                )
              })}
            </div>
            <p className="text-xs text-muted">
              {form.newPwd.length >= 12 ? 'Très fort' : form.newPwd.length >= 8 ? 'Fort' : form.newPwd.length >= 6 ? 'Moyen' : 'Faible'}
            </p>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'Mettre à jour le mot de passe'}
        </button>
      </form>
    </div>
  )
}

function SubscriptionTab({ isPremium, planName, expiresAt, daysLeft }) {
  const navigate = useNavigate()
  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Mon abonnement</h2>
      <p className="text-muted text-sm" style={{ marginBottom: 24 }}>Gérez votre plan ProstaTrack.</p>

      <div style={{
        padding: 24, borderRadius: 12,
        background: isPremium ? 'linear-gradient(135deg, #f0fdfa, #fff)' : 'var(--gray-100)',
        border: isPremium ? '1px solid var(--teal-muted)' : '1px solid var(--gray-200)',
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-400)', marginBottom: 4 }}>PLAN ACTUEL</p>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: isPremium ? 'var(--teal)' : 'var(--charcoal)' }}>
              {isPremium ? '💎 Premium Mensuel' : '🆓 Gratuit'}
            </h3>
          </div>
          <span className={`badge ${isPremium ? 'badge-primary' : 'badge-gray'}`} style={{ background: isPremium ? 'var(--teal-light)' : 'var(--gray-200)', color: isPremium ? 'var(--teal)' : 'var(--gray-600)' }}>
            {isPremium ? 'Actif' : 'Limité'}
          </span>
        </div>

        {isPremium && formattedExpiry && (
          <div style={{ marginBottom: 12 }}>
            <p className="text-sm" style={{ color: isExpiringSoon ? '#e53e3e' : 'var(--gray-600)' }}>
              {isExpiringSoon
                ? `⚠ Expire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''} — renouvelez maintenant`
                : `✓ Accès valide jusqu'au ${formattedExpiry}`}
            </p>
          </div>
        )}

        {isPremium ? (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Historique illimité et graphiques', 'Analyse détaillée du score', 'Programme complet 8 semaines', 'Export PDF', 'Support prioritaire'].map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--gray-600)' }}>
                <span style={{ color: 'var(--teal)', fontSize: 16 }}>✓</span> {f}
              </li>
            ))}
          </ul>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Journal quotidien (7 jours max)', 'Score de santé basique', 'Semaine 1 du programme'].map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--gray-600)' }}>
                <span style={{ color: 'var(--teal)' }}>✓</span> {f}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="btn btn-primary" onClick={() => navigate('/pricing')}>
        {isPremium ? 'Renouveler mon abonnement' : 'Passer Premium 💎'}
      </button>
    </div>
  )
}

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'profile'
  const { user, updateProfile, updatePassword, updateEmail } = useAuth()
  const { isPremium, planName, expiresAt, daysLeft } = useSubscription()

  const setTab = (tab) => setSearchParams({ tab })

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Paramètres</h1>
      <p className="text-muted text-sm" style={{ marginBottom: 32 }}>Gérez votre compte et vos préférences.</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--gray-100)', padding: 4, borderRadius: 12 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === tab.key ? 'white' : 'transparent',
              color: activeTab === tab.key ? 'var(--charcoal)' : 'var(--gray-400)',
              boxShadow: activeTab === tab.key ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card">
        {activeTab === 'profile' && (
          <ProfileTab user={user} updateProfile={updateProfile} updateEmail={updateEmail} />
        )}
        {activeTab === 'password' && (
          <PasswordTab updatePassword={updatePassword} />
        )}
        {activeTab === 'subscription' && (
          <SubscriptionTab isPremium={isPremium} planName={planName} expiresAt={expiresAt} daysLeft={daysLeft} />
        )}
      </div>
    </div>
  )
}
