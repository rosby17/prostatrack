import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../context/SubscriptionContext'
import './Layout.css'

const NAV = [
  { to: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Tableau de bord' },
  { to: '/log', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', label: 'Journal du jour' },
  { to: '/progress', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Ma progression', premium: true },
  { to: '/program', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', label: 'Programme 8 semaines' },
  { to: '/score', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z', label: 'Mon score santé', premium: true },
]

function UserMenu({ userName, planName, isPremium, onSignOut }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-menu__trigger" onClick={() => setOpen(o => !o)}>
        <div className="user-menu__avatar">
          {(userName || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="user-menu__info">
          <span className="user-menu__name">{userName || 'Utilisateur'}</span>
          <span className={`user-menu__plan ${isPremium ? 'user-menu__plan--premium' : ''}`}>
            {isPremium ? '💎 ' : ''}{planName}
          </span>
        </div>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--gray-400)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="user-menu__dropdown">
          <div className="user-menu__dropdown-header">
            <div className="user-menu__avatar user-menu__avatar--lg">
              {(userName || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--charcoal)' }}>{userName}</p>
              <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>{planName}</p>
            </div>
          </div>

          <div className="user-menu__dropdown-section">
            <Link to="/settings" className="user-menu__item" onClick={() => setOpen(false)}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </Link>
            <Link to="/settings?tab=password" className="user-menu__item" onClick={() => setOpen(false)}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Changer le mot de passe
            </Link>
            <Link to="/pricing" className="user-menu__item" onClick={() => setOpen(false)}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Abonnement
            </Link>
          </div>

          <div className="user-menu__dropdown-divider" />

          <button className="user-menu__item user-menu__item--danger" onClick={() => { setOpen(false); onSignOut() }}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      )}
    </div>
  )
}

export default function Layout({ children, isDemo, userName }) {
  const { signOut } = useAuth()
  const { isPremium, planName } = useSubscription()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-dot" />
            <span>ProstaTrack</span>
          </div>
          {isDemo && <span className="badge badge-amber">Démo</span>}
        </div>

        <nav className="sidebar__nav">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to + (isDemo ? '?demo=true' : '')}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </div>
              {item.premium && !isPremium && <span className="premium-lock">🔒</span>}
            </NavLink>
          ))}
        </nav>

        {!isPremium && !isDemo && (
          <div className="sidebar__upgrade">
            <h4>Passez Premium 💎</h4>
            <p>Accédez à l'historique complet et à l'analyse détaillée.</p>
            <button className="btn btn-primary btn-sm btn-full" onClick={() => navigate('/pricing')}>
              Voir les plans
            </button>
          </div>
        )}
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      {/* MAIN */}
      <div className="layout__main">
        <header className="layout__header">
          {/* Burger mobile uniquement */}
          <button className="layout__burger btn btn-ghost" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {isDemo && (
            <div className="layout__demo-banner">
              Mode démo — <a href="/register">Créer un compte gratuit</a> pour sauvegarder vos données
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Menu utilisateur en haut à droite */}
          <UserMenu
            userName={userName}
            planName={planName}
            isPremium={isPremium}
            onSignOut={handleSignOut}
          />
        </header>

        <main className="layout__content">
          {children}
        </main>
      </div>
    </div>
  )
}