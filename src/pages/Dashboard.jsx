import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { format, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { MOCK_LOGS, MOCK_PROGRAM } from '../lib/mockData'
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

export default function Dashboard() {
  const [params] = useSearchParams()
  const isDemo = params.get('demo') === 'true'
  const logs = MOCK_LOGS

  const today = logs[logs.length - 1]
  const lastWeek = logs.slice(-14, -7)
  const thisWeek = logs.slice(-7)

  const avg = (arr, key) => arr.length ? Math.round(arr.reduce((s, l) => s + l[key], 0) / arr.length * 10) / 10 : 0

  const stats = useMemo(() => ({
    wakings: avg(thisWeek, 'night_wakings'),
    wakingsTrend: avg(thisWeek, 'night_wakings') - avg(lastWeek, 'night_wakings'),
    sleep: avg(thisWeek, 'sleep_quality'),
    sleepTrend: avg(thisWeek, 'sleep_quality') - avg(lastWeek, 'sleep_quality'),
    urgency: avg(thisWeek, 'urgency_level'),
    energy: avg(thisWeek, 'energy_level'),
  }), [logs])

  const score = Math.round(
    ((5 - stats.wakings) / 4 * 30) +
    (stats.sleep / 5 * 30) +
    ((5 - stats.urgency) / 4 * 20) +
    (stats.energy / 5 * 20)
  )

  const scoreColor = score >= 70 ? 'var(--green)' : score >= 45 ? 'var(--amber)' : 'var(--red)'
  const scoreLabel = score >= 70 ? 'Bon' : score >= 45 ? 'En progression' : 'À améliorer'

  const nextProgram = MOCK_PROGRAM.find(p => !p.done)
  const doneCount = MOCK_PROGRAM.filter(p => p.done).length

  const recentLogs = logs.slice(-7).reverse()

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>Bonjour Jean-Michel</h1>
          <p className="text-muted text-sm">{format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}</p>
        </div>
        <Link to={`/log${isDemo ? '?demo=true' : ''}`} className="btn btn-primary">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Saisir aujourd'hui
        </Link>
      </div>

      {/* SCORE BANNER */}
      <div className="score-banner">
        <div className="score-banner__left">
          <span className="text-sm text-muted">Score de santé prostatique</span>
          <div className="score-banner__score" style={{ color: scoreColor }}>
            {score}<span>/100</span>
          </div>
          <span className="badge" style={{ background: `${scoreColor}18`, color: scoreColor, border: `1px solid ${scoreColor}30` }}>
            {scoreLabel}
          </span>
        </div>
        <div className="score-banner__ring">
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="var(--gray-100)" strokeWidth="8"/>
            <circle
              cx="40" cy="40" r="32"
              fill="none" stroke={scoreColor} strokeWidth="8"
              strokeDasharray={`${score * 2.01} 201`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
            <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight="700" fill={scoreColor}>{score}</text>
          </svg>
        </div>
        <div className="score-banner__message">
          <p>Vous avez réduit vos réveils nocturnes de <strong>4 à {stats.wakings}</strong> en 30 jours.</p>
          <p className="text-sm text-muted">Continuez le programme pour consolider vos résultats.</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <StatCard label="Réveils nocturnes" value={stats.wakings} unit="/nuit" trend={Math.round(stats.wakingsTrend * 10) / 10} color="green" />
        <StatCard label="Qualité du sommeil" value={stats.sleep} unit="/5" trend={-Math.round(stats.sleepTrend * 10) / 10} color="blue" />
        <StatCard label="Urgence urinaire" value={stats.urgency} unit="/5" color="amber" />
        <StatCard label="Niveau d'énergie" value={stats.energy} unit="/5" color="purple" />
      </div>

      <div className="dashboard__grid">
        {/* RECENT LOGS */}
        <div className="card">
          <div className="card__header">
            <h3>Derniers 7 jours</h3>
            <Link to={`/progress${isDemo ? '?demo=true' : ''}`} className="btn btn-ghost btn-sm">Voir tout →</Link>
          </div>
          <div className="logs-table">
            <div className="logs-table__head">
              <span>Date</span>
              <span>Réveils</span>
              <span>Sommeil</span>
              <span>Urgence</span>
              <span>Énergie</span>
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
        </div>

        {/* PROGRAM CARD */}
        <div className="card">
          <div className="card__header">
            <h3>Programme 8 semaines</h3>
            <span className="badge badge-green">{doneCount}/{MOCK_PROGRAM.length} terminés</span>
          </div>
          <div className="program-progress">
            <div className="program-progress__bar">
              <div className="program-progress__fill" style={{ width: `${(doneCount / MOCK_PROGRAM.length) * 100}%` }} />
            </div>
            <span className="text-xs text-muted">{Math.round((doneCount / MOCK_PROGRAM.length) * 100)}% complété</span>
          </div>
          {nextProgram && (
            <div className="next-lesson">
              <div className={`next-lesson__type badge ${nextProgram.type === 'video' ? 'badge-blue' : 'badge-green'}`}>
                {nextProgram.type === 'video' ? 'Vidéo' : 'Guide PDF'}
              </div>
              <h4>Semaine {nextProgram.week} — {nextProgram.title}</h4>
              <p className="text-sm text-muted">{nextProgram.description}</p>
              <div className="next-lesson__footer">
                <span className="text-xs text-muted">{nextProgram.duration}</span>
                <Link to={`/program${isDemo ? '?demo=true' : ''}`} className="btn btn-primary btn-sm">
                  Continuer
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
