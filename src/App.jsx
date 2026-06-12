import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import { LoginPage, RegisterPage } from './pages/Auth'
import Dashboard from './pages/Dashboard'
import LogDay from './pages/LogDay'
import Progress from './pages/Progress'
import Program from './pages/Program'
import Score from './pages/Score'
import './index.css'

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
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<AppLayout page={Dashboard} />} />
          <Route path="/log" element={<AppLayout page={LogDay} />} />
          <Route path="/progress" element={<AppLayout page={Progress} />} />
          <Route path="/program" element={<AppLayout page={Program} />} />
          <Route path="/score" element={<AppLayout page={Score} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
