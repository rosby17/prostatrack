import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(form.email, form.password)
    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  const handleDemo = () => navigate('/dashboard?demo=true')

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-dot" />
          <span>ProstaTrack</span>
        </div>
        <h1 className="auth-title">Bon retour</h1>
        <p className="auth-sub">Connectez-vous à votre espace de suivi</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="vous@exemple.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
            />
          </div>

          {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Se connecter'}
          </button>
        </form>

        <div className="auth-divider"><span>ou</span></div>

        <button className="btn btn-outline btn-full" onClick={handleDemo}>
          Essayer la démo gratuite
        </button>

        <p className="auth-footer">
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { setError('Mot de passe minimum 6 caractères.'); return }
    setLoading(true)
    setError('')
    const { error } = await signUp(form.email, form.password, form.name)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-dot" />
          <span>ProstaTrack</span>
        </div>
        <h1 className="auth-title">Commencer votre suivi</h1>
        <p className="auth-sub">Créez votre compte ProstaTrack gratuitement</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Prénom</label>
            <input
              className="form-input"
              type="text"
              placeholder="Jean-Michel"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="vous@exemple.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              className="form-input"
              type="password"
              placeholder="Minimum 6 caractères"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
            />
          </div>

          {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Créer mon compte'}
          </button>
        </form>

        <p className="auth-footer">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>

        <p className="auth-legal">
          En créant un compte, vous acceptez nos <a href="#">CGU</a> et notre <a href="#">politique de confidentialité</a>.
          ProstaTrack est un outil de suivi personnel, pas un dispositif médical.
        </p>
      </div>
    </div>
  )
}
