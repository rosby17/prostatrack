import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useAuth } from '../context/AuthContext'
import { useUserData } from '../lib/useUserData'
import { useGamification, BADGES } from '../lib/useGamification'
import PremiumGate from '../components/PremiumGate'
import './Dashboard.css'

function StatCard({ label, value, unit, trend, color = 'green' }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <span className="stat-card__label">{label}</span>
      <div className="stat-card__value">
        <strong>{value}</strong>
        {unit && <span>{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className={`stat-card__trend ${trend < 0 ? 'trend--good' : trend > 0 ? 'trend--bad' : 'trend--neutral'}`}>
          {trend < 0 ? '▼' : trend > 0 ? '▲' : '—'} {Math.abs(trend)} vs semaine dernière
        </div>
      )}
    </div>
  )
}

function MiniBar({ value, max, color }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="mini-bar">
      <div className="mini-bar__fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

// Composant Streak
function StreakCard({ streak }) {
  const flames = Math.min(streak.current, 7)
  return (
    <div className="card streak-card" style={{ background: streak.current >= 3 ? 'linear-gradient(135deg, #fff7ed, #fff)' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <p className="text-xs text-muted" style={{ fontWeight: 600, marginBottom: 4 }}>SÉRIE EN COURS</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: streak.current >= 3 ? '#f97316' : 'var(--charcoal)' }}>
              {streak.current}
            </span>
            <span className="text-muted" style={{ fontSize: 14 }}>jour{streak.current > 1 ? 's' : ''}</span>
          </div>
        </div>
        <div style={{ fontSize: 40 }}>
          {streak.current === 0 ? '💤' : streak.current < 3 ? '🌱' : streak.current < 7 ? '🔥' : '⚡'}
        </div>
      </div>
      {/* Mini flammes visuelles */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} style={{
            flex: 1, height: 6, borderRadius: 99,
            background: i < streak.current ? '#f97316' : 'var(--gray-100)',
            transition: 'background 0.3s'
          }} />
        ))}
      </div>
      <p className="text-xs text-muted">
        {streak.current === 0 ? 'Saisissez votre journal pour commencer une série !' :
          streak.current < 3 ? `Plus que ${3 - streak.current} jour(s) pour gagner le badge 🔥` :
            streak.current < 7 ? `Plus que ${7 - streak.current} jour(s) pour la semaine parfaite ⚡` :
              `Record personnel : ${streak.longest} jours 🏆`}
      </p>
    </div>
  )
}

// Composant Badges
function BadgesCard({ badges, allBadges }) {
  const earned = allBadges.filter(b => badges.includes(b.key))
  const locked = allBadges.filter(b => !badges.includes(b.key))

  return (
    <div className="card">
      <div className="card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>Mes badges</h3>
        <span className="badge badge-primary">{earned.length}/{allBadges.length}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {earned.map(b => (
          <div key={b.key} title={b.desc} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '10px 12px', borderRadius: 12,
            background: `${b.color}15`, border: `1px solid ${b.color}30`,
            minWidth: 64, cursor: 'default'
          }}>
            <span style={{ fontSize: 24 }}>{b.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: b.color, textAlign: 'center', lineHeight: 1.2 }}>{b.label}</span>
          </div>
        ))}
        {locked.slice(0, 4).map(b => (
          <div key={b.key} title={`${b.desc} (verrouillé)`} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '10px 12px', borderRadius: 12,
            background: 'var(--gray-100)', border: '1px solid var(--gray-200)',
            minWidth: 64, opacity: 0.5, cursor: 'default', filter: 'grayscale(1)'
          }}>
            <span style={{ fontSize: 24 }}>{b.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-400)', textAlign: 'center', lineHeight: 1.2 }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Notification nouveau badge
function BadgeNotification({ badgeKey }) {
  const badge = BADGES.find(b => b.key === badgeKey)
  if (!badge) return null
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 100,
      background: 'white', borderRadius: 16, padding: '16px 20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      border: `2px solid ${badge.color}`,
      display: 'flex', alignItems: 'center', gap: 12,
      animation: 'slideIn 0.4s ease'
    }}>
      <style>{`@keyframes slideIn { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
      <span style={{ fontSize: 36 }}>{badge.icon}</span>
      <div>
        <p style={{ fontSize: 12, color: badge.color, fontWeight: 700, marginBottom: 2 }}>BADGE DÉBLOQUÉ !</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--charcoal)' }}>{badge.label}</p>
        <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>{badge.desc}</p>
      </div>
    </div>
  )
}

// Insight quotidien
function InsightCard({ insight }) {
  if (!insight) return null
  return (
    <div className="card" style={{
      background: `linear-gradient(135deg, ${insight.color}08, white)`,
      border: `1px solid ${insight.color}20`
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 28, flexShrink: 0 }}>{insight.icon}</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: insight.color, marginBottom: 4 }}>INSIGHT DU JOUR</p>
          <p style={{ fontSize: 15, color: 'var(--charcoal)', lineHeight: 1.5 }}>{insight.text}</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [params] = useSearchParams()
  const isDemo = params.get('demo') === 'true'
  const { user } = useAuth()
  const { logs, program, loading } = useUserData(isDemo)

  const userName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || 'vous'

  const avg = (arr, key) =>
    arr.length ? Math.round(arr.reduce((s, l) => s + (l[key] || 0), 0) / arr.length * 10) / 10 : 0

  const thisWeek = logs.slice(-7)
  const lastWeek = logs.slice(-14, -7)

  const stats = useMemo(() => ({
    wakings: avg(thisWeek, 'night_wakings'),
    wakingsTrend: Math.round((avg(thisWeek, 'night_wakings') - avg(lastWeek, 'night_wakings')) * 10) / 10,
    sleep: avg(thisWeek, 'sleep_quality'),
    sleepTrend: Math.round((avg(thisWeek, 'sleep_quality') - avg(lastWeek, 'sleep_quality')) * 10) / 10,
    urgency: avg(thisWeek, 'urgency_level'),
    energy: avg(thisWeek, 'energy_level'),
  }), [logs])

  const score = thisWeek.length === 0 ? 0 : Math.min(100, Math.round(
    ((5 - stats.wakings) / 4 * 30) +
    (stats.sleep / 5 * 30) +
    ((5 - stats.urgency) / 4 * 20) +
    (stats.energy / 5 * 20)
  ))

  const doneCount = program.filter(p => p.done).length
  const { streak, badges, newBadges, getDailyInsight, allBadges } = useGamification(logs, score, doneCount)
  const insight = getDailyInsight()

  const scoreColor = score >= 70 ? 'var(--teal)' : score >= 45 ? 'var(--warning)' : 'var(--error)'
  const scoreLabel = score >= 70 ? 'Bon' : score >= 45 ? 'En progression' : 'À améliorer'
  const firstLog = logs[0]
  const wakingStart = firstLog?.night_wakings ?? stats.wakings
  const nextProgram = program.find(p => !p.done)
  const recentLogs = logs.slice(-7).reverse()

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>

  return (
    <div className="dashboard">
      {/* Notifications nouveaux badges */}
      {newBadges.map(key => <BadgeNotification key={key} badgeKey={key} />)}

      <div className="dashboard__header">
        <div>
          <h1>Bonjour {userName} 👋</h1>
          <p className="text-muted text-sm">{format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}</p>
        </div>
        <Link to={`/log${isDemo ? '?demo=true' : ''}`} className="btn btn-primary">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Saisir aujourd'hui
        </Link>
      </div>

      {/* Aucune donnée */}
      {logs.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={{ marginBottom: 8 }}>Commencez votre suivi</h3>
          <p className="text-muted text-sm" style={{ marginBottom: 24 }}>
            Saisissez votre premier journal quotidien pour voir vos statistiques et débloquer vos premiers badges.
          </p>
          <Link to="/log" className="btn btn-primary">Saisir aujourd'hui</Link>
        </div>
      )}

      {logs.length > 0 && (
        <>
          {/* INSIGHT DU JOUR */}
          <InsightCard insight={insight} />

          {/* STREAK + SCORE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <StreakCard streak={streak} />

            {/* Score banner compact */}
            <div className="score-banner" style={{ margin: 0 }}>
              <div className="score-banner__left">
                <span className="text-sm text-muted">Score de santé</span>
                <div className="score-banner__score" style={{ color: scoreColor }}>
                  {score}<span>/100</span>
                </div>
                <span className="badge" style={{ background: `${scoreColor}18`, color: scoreColor, border: `1px solid ${scoreColor}30` }}>
                  {scoreLabel}
                </span>
              </div>
              <div className="score-banner__ring">
                <svg viewBox="0 0 80 80" width="80" height="80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="var(--gray-100)" strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor} strokeWidth="8"
                    strokeDasharray={`${score * 2.01} 201`} strokeLinecap="round"
                    transform="rotate(-90 40 40)" style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                  <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight="700" fill={scoreColor}>{score}</text>
                </svg>
              </div>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="stats-grid">
            <StatCard label="Réveils nocturnes" value={stats.wakings} unit="/nuit" trend={stats.wakingsTrend} color="teal" />
            <StatCard label="Qualité du sommeil" value={stats.sleep} unit="/5" trend={-stats.sleepTrend} color="blue" />
            <StatCard label="Urgence urinaire" value={stats.urgency} unit="/5" color="warning" />
            <StatCard label="Niveau d'énergie" value={stats.energy} unit="/5" color="terracotta" />
          </div>

          {/* BADGES */}
          <BadgesCard badges={badges} allBadges={allBadges} />
        </>
      )}

      <div className="dashboard__grid">
        {/* RECENT LOGS */}
        <div className="card">
          <div className="card__header">
            <h3>Derniers 7 jours</h3>
            <Link to={`/progress${isDemo ? '?demo=true' : ''}`} className="btn btn-ghost btn-sm">Voir tout →</Link>
          </div>
          {recentLogs.length === 0 ? (
            <p className="text-muted text-sm" style={{ padding: '16px 0' }}>Aucune donnée pour cette semaine.</p>
          ) : (
            <div className="logs-table">
              <div className="logs-table__head">
                <span>Date</span><span>Réveils</span><span>Sommeil</span><span>Urgence</span><span>Énergie</span>
              </div>
              {recentLogs.map(log => (
                <div className="logs-table__row" key={log.id}>
                  <span className="text-sm">{format(new Date(log.date), 'EEE d MMM', { locale: fr })}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: 14, minWidth: 12 }}>{log.night_wakings}</strong>
                    <MiniBar value={Math.max(0, 4 - log.night_wakings)} max={4} color="var(--green)" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: 14, minWidth: 12 }}>{log.sleep_quality}</strong>
                    <MiniBar value={log.sleep_quality} max={5} color="var(--blue)" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: 14, minWidth: 12 }}>{log.urgency_level}</strong>
                    <MiniBar value={Math.max(0, 5 - log.urgency_level)} max={4} color="var(--amber)" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: 14, minWidth: 12 }}>{log.energy_level}</strong>
                    <MiniBar value={log.energy_level} max={5} color="var(--green)" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PROGRAM CARD */}
        <div className="card">
          <div className="card__header">
            <h3>Programme 8 semaines</h3>
            <span className="badge badge-green">{doneCount}/{program.length} terminés</span>
          </div>
          <div className="program-progress">
            <div className="program-progress__bar">
              <div className="program-progress__fill" style={{ width: `${(doneCount / program.length) * 100}%` }} />
            </div>
            <span className="text-xs text-muted">{Math.round((doneCount / program.length) * 100)}% complété</span>
          </div>
          <PremiumGate featureName="le Programme complet">
            {nextProgram && (
              <div className="next-lesson">
                <div className={`next-lesson__type badge ${nextProgram.type === 'video' ? 'badge-primary' : 'badge-accent'}`}>
                  {nextProgram.type === 'video' ? 'Vidéo' : 'Guide PDF'}
                </div>
                <h4>Semaine {nextProgram.week} — {nextProgram.title}</h4>
                <p className="text-sm text-muted">{nextProgram.description}</p>
                <div className="next-lesson__footer">
                  <span className="text-xs text-muted">{nextProgram.duration}</span>
                  <Link to={`/program${isDemo ? '?demo=true' : ''}`} className="btn btn-primary btn-sm">Continuer</Link>
                </div>
              </div>
            )}
          </PremiumGate>
        </div>
      </div>
    </div>
  )
}
