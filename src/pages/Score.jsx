import { useSearchParams } from 'react-router-dom'
import { useUserData } from '../lib/useUserData'
import './Score.css'

function GaugeArc({ score, color }) {
  const r = 54
  const circ = Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width="140" height="80" viewBox="0 0 140 80">
      <path d="M 14 76 A 56 56 0 0 1 126 76" fill="none" stroke="var(--gray-100)" strokeWidth="12" strokeLinecap="round" />
      <path d="M 14 76 A 56 56 0 0 1 126 76" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="70" y="68" textAnchor="middle" fontSize="26" fontWeight="800" fill={color}>{score}</text>
      <text x="70" y="80" textAnchor="middle" fontSize="11" fill="var(--gray-400)">/100</text>
    </svg>
  )
}

export default function Score() {
  const [params] = useSearchParams()
  const isDemo = params.get('demo') === 'true'
  const { logs, loading } = useUserData(isDemo)

  const avg = (arr, key) => arr.length ? Math.round(arr.reduce((s, l) => s + (l[key] || 0), 0) / arr.length * 10) / 10 : 0

  // Score par semaine pour l'historique
  const weeks = []
  for (let i = 0; i < Math.min(4, Math.ceil(logs.length / 7)); i++) {
    const slice = logs.slice(-(i + 1) * 7, i === 0 ? undefined : -i * 7)
    if (slice.length === 0) continue
    const w = avg(slice, 'night_wakings')
    const s = avg(slice, 'sleep_quality')
    const u = avg(slice, 'urgency_level')
    const e = avg(slice, 'energy_level')
    const score = Math.min(100, Math.round(
      ((5 - w) / 4 * 30) + (s / 5 * 30) + ((5 - u) / 4 * 20) + (e / 5 * 20)
    ))
    weeks.unshift({ label: i === 0 ? 'Cette semaine' : `S-${i}`, score })
  }

  const last7 = logs.slice(-7)
  const wakings = avg(last7, 'night_wakings')
  const sleep = avg(last7, 'sleep_quality')
  const urgency = avg(last7, 'urgency_level')
  const energy = avg(last7, 'energy_level')

  const score = last7.length === 0 ? 0 : Math.min(100, Math.round(
    ((5 - wakings) / 4 * 30) + (sleep / 5 * 30) + ((5 - urgency) / 4 * 20) + (energy / 5 * 20)
  ))

  const scoreColor = score >= 70 ? 'var(--teal)' : score >= 45 ? 'var(--warning)' : 'var(--error)'
  const scoreLabel = score >= 70 ? 'Bon' : score >= 45 ? 'En progression' : 'À améliorer'
  const scoreMsg = score >= 70
    ? 'Vos indicateurs sont bons. Continuez le programme pour maintenir ces résultats.'
    : score >= 45
      ? 'Vous progressez. Restez régulier dans votre suivi et votre programme.'
      : 'Des améliorations sont possibles. Consultez les recommandations ci-dessous.'

  const components = [
    { label: 'Réveils nocturnes', desc: 'Moins de réveils = meilleur score', raw: `${wakings}/nuit`, pts: Math.round((5 - wakings) / 4 * 30), max: 30, color: 'var(--teal)' },
    { label: 'Qualité du sommeil', desc: 'Score de 1 à 5 sur votre ressenti', raw: `${sleep}/5`, pts: Math.round(sleep / 5 * 30), max: 30, color: '#3b82f6' },
    { label: 'Urgence urinaire', desc: "Moins d'urgence = meilleur score", raw: `${urgency}/5`, pts: Math.round((5 - urgency) / 4 * 20), max: 20, color: '#f59e0b' },
    { label: "Niveau d'énergie", desc: 'Votre vitalité au quotidien', raw: `${energy}/5`, pts: Math.round(energy / 5 * 20), max: 20, color: '#8b5cf6' },
  ]

  const actions = [
    { text: 'Réduire la consommation d\'eau après 18h', impact: '+3 pts', color: 'var(--teal)' },
    { text: 'Pratiquer les exercices du plancher pelvien', impact: '+5 pts', color: '#3b82f6' },
    { text: 'Compléter le module "Gestion du stress"', impact: '+4 pts', color: '#f59e0b' },
  ]

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>

  if (logs.length === 0) {
    return (
      <div className="score-page">
        <h1>Mon score de santé</h1>
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
          <h3 style={{ marginBottom: 8 }}>Pas encore de données</h3>
          <p className="text-muted text-sm">Saisissez votre journal quotidien pendant 7 jours pour voir votre score apparaître ici.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="score-page">
      <div>
        <h1>Mon score de santé</h1>
        <p className="text-muted text-sm">Calculé automatiquement à partir de vos {Math.min(7, last7.length)} derniers jours de journal</p>
      </div>

      {/* SCORE HERO */}
      <div className="card">
        <div className="score-hero">
          <div className="score-hero__gauge">
            <GaugeArc score={score} color={scoreColor} />
          </div>
          <div className="score-hero__info">
            <div className="score-hero__label" style={{ color: scoreColor }}>{scoreLabel}</div>
            <p>{scoreMsg}</p>
          </div>
        </div>
      </div>

      {/* SCORE BREAKDOWN */}
      <div className="card">
        <h3 style={{ marginBottom: 20 }}>Détail du score</h3>
        <div className="score-breakdown">
          {components.map((c, i) => (
            <div key={i}>
              <div className="score-component__header">
                <div>
                  <strong>{c.label}</strong>
                  <span className="text-xs text-muted">{c.desc}</span>
                </div>
                <div className="score-component__values">
                  <span className="score-component__raw">{c.raw}</span>
                  <div className="score-component__pts" style={{ color: c.color }}>
                    {c.pts}<small>/{c.max}pts</small>
                  </div>
                </div>
              </div>
              <div className="score-bar">
                <div className="score-bar__fill" style={{ width: `${(c.pts / c.max) * 100}%`, background: c.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCORE HISTORY */}
      {weeks.length > 1 && (
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Évolution de votre score</h3>
          <div className="score-history">
            {weeks.map((w, i) => {
              const c = w.score >= 70 ? 'var(--teal)' : w.score >= 45 ? 'var(--warning)' : 'var(--error)'
              return (
                <div key={i} className="score-history__item">
                  <div className="score-history__bar-wrap">
                    <div className="score-history__bar" style={{ height: `${w.score}%`, background: c }} />
                  </div>
                  <strong style={{ color: c }}>{w.score}</strong>
                  <span className="text-xs text-muted">{w.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* NEXT ACTIONS */}
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Actions recommandées</h3>
        <div className="next-actions">
          {actions.map((a, i) => (
            <div key={i} className="next-action">
              <div className="next-action__dot" style={{ background: a.color }} />
              <span>{a.text}</span>
              <span className="next-action__impact" style={{ color: a.color }}>{a.impact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}