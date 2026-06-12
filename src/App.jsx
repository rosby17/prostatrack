import { useEffect } from 'react'
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

// Handles Supabase email confirmation links that return to /#/auth/callback
// Le token est lu automatiquement par le SDK Supabase via onAuthStateChange
function AuthCallback() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
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
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Jean-Michel'

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
            
            {/* AUTH CALLBACK — reçoit les liens de confirmation email Supabase */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
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
