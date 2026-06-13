import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import Layout from './components/Layout'
import PremiumGate from './components/PremiumGate'
import LandingPage from './pages/LandingPage'
import Pricing from './pages/Pricing'
import { LoginPage, RegisterPage } from './pages/Auth'
import Dashboard from './pages/Dashboard'
import LogDay from './pages/LogDay'
import Progress from './pages/Progress'
import Program from './pages/Program'
import Score from './pages/Score'
import './index.css'
import { supabase } from './lib/supabase'
import Settings from './pages/Settings'



// Handles Supabase email confirmation links that return to /#/auth/callback
function AuthCallback() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Vérifier s'il y a une erreur dans le hash de l'URL
    const hash = window.location.hash
    if (hash.includes('error=')) {
      const params = new URLSearchParams(hash.replace('#', ''))
      const errorCode = params.get('error_code')
      const errorDesc = params.get('error_description')

      if (errorCode === 'otp_expired') {
        navigate('/login?error=link_expired', { replace: true })
      } else {
        navigate('/login?error=auth_failed', { replace: true })
      }
      return
    }

    if (!loading) {
      if (user) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }
  }, [user, loading, navigate])

  return <div className="page-loader"><div className="spinner spinner-lg" /></div>
}

// Page de réinitialisation du mot de passe
function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) { setError('Mot de passe minimum 6 caractères.'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError("Erreur lors de la réinitialisation. Le lien a peut-être expiré.")
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/dashboard', { replace: true }), 2500)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-dot" />
          <span>ProstaTrack</span>
        </div>
        <h1 className="auth-title">Nouveau mot de passe</h1>
        <p className="auth-sub">Choisissez un nouveau mot de passe pour votre compte.</p>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <p><strong>Mot de passe mis à jour !</strong></p>
            <p className="text-muted text-sm" style={{ marginTop: 8 }}>
              Redirection vers votre tableau de bord...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nouveau mot de passe</label>
              <input
                className="form-input"
                type="password"
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmer le mot de passe</label>
              <input
                className="form-input"
                type="password"
                placeholder="Répétez le mot de passe"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>
            {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Mettre à jour'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const [params] = useSearchParams()
  const isDemo = params.get('demo') === 'true'

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>
  if (!user && !isDemo) return <Navigate to="/login" replace />
  return children
}

function AppLayout({ page: Page }) {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const isDemo = params.get('demo') === 'true'
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'vous'

  return (
    <ProtectedRoute>
      <Layout isDemo={isDemo} userName={userName}>
        <Page />
      </Layout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/settings" element={<AppLayout page={Settings} />} />

            {/* AUTH CALLBACK — reçoit les liens de confirmation email Supabase */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* RESET PASSWORD — lien envoyé par email */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* PROTECTED ROUTES */}
            <Route path="/dashboard" element={<AppLayout page={Dashboard} />} />
            <Route path="/log" element={<AppLayout page={LogDay} />} />
            <Route path="/progress" element={
              <AppLayout page={() => (
                <PremiumGate featureName="la progression détaillée">
                  <Progress />
                </PremiumGate>
              )} />
            } />
            <Route path="/program" element={<AppLayout page={Program} />} />
            <Route path="/score" element={
              <AppLayout page={() => (
                <PremiumGate featureName="l'analyse détaillée du score">
                  <Score />
                </PremiumGate>
              )} />
            } />

            {/* CATCH ALL */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SubscriptionProvider>
      </AuthProvider>
    </HashRouter>
  )
}