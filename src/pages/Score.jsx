import { MOCK_LOGS } from '../lib/mockData'
import './Score.css'

const avg = (arr, key) => arr.length ? Math.round(arr.reduce((s, l) => s + l[key], 0) / arr.length * 10) / 10 : 0

export default function Score() {
  const last30 = MOCK_LOGS.slice(-30)
  const last7 = MOCK_LOGS.slice(-7)

  const wakings = avg(last7, 'night_wakings')
  const sleep = avg(last7, 'sleep_quality')
  const urgency = avg(last7, 'urgency_level')
  const energy = avg(last7, 'energy_level')

  const components = [
    { label: 'Réveils nocturnes', desc: 'Moins de réveils = meilleur score', value: Math.round(Math.max(0, (4 - wakings) / 4 * 30)), max: 30, color: '#16a05c', raw: `${wakings}/nuit` },
    { label: 'Qualité du sommeil', desc: 'Score de 1 à 5 sur votre ressenti', value: Math.round(sleep / 5 * 30), max: 30, color: '#3b82f6', raw: `${sleep}/5` },
    { label: 'Urgence urinaire', desc: 'Moins d\'urgence = meilleur score', value: Math.round(Math.max(0, (5 - urgency) / 4 * 20)), max: 20, color: '#f59e0b', raw: `${urgency}/5` },
    { label: "Niveau d'énergie", desc: 'Votre vitalité au quotidien', value: Math.round(energy / 5 * 20), max: 20, color: '#8b5cf6', raw: `${energy}/5` },
  ]

  const totalScore = components.reduce((s, c) => s + c.value, 0)
  const scoreColor = totalScore >= 70 ? '#16a05c' : totalScore >= 45 ? '#f59e0b' : '#ef4444'
  const scoreLabel = totalScore >= 70 ? 'Bon' : totalScore >= 45 ? 'En progression' : 'À améliorer'
  const scoreTip = totalScore >= 70
    ? 'Vos indicateurs sont bons. Continuez le programme pour maintenir ces résultats.'
    : totalScore >= 45
    ? 'Vous progressez. Soyez régulier dans votre journal et suivez le programme.'
    : 'Commencez par noter votre journal chaque matin et suivre le programme semaine 1.'

  const history = [
    { period: 'Début du suivi', score: 28 },
    { period: 'Semaine 2', score: 35 },
    { period: 'Semaine 3', score: 44 },
    { period: 'Semaine 4', score: totalScore },
  ]

  return (
    <div className="score-page">
      <div>
        <h1>Mon score de santé</h1>
        <p className="text-muted text-sm">Calculé automatiquement à partir de vos 7 derniers jours de journal</p>
      </div>

      {/* SCORE HERO */}
      <div className="score-hero card">
        <div className="score-hero__gauge">
          <svg viewBox="0 0 200 120" width="200" height="120">
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--gray-100)" strokeWidth="16" strokeLinecap="round"/>
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={scoreColor}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${(totalScore / 100) * 251} 251`}
              style={{ transition: 'stroke-dasharray 1.2s ease' }}
            />
            <text x="100" y="90" textAnchor="middle" fontSize="36" fontWeight="800" fill={scoreColor}>{totalScore}</text>
            <text x="100" y="110" textAnchor="middle" fontSize="12" fill="var(--gray-400)">/100</text>
          </svg>
        </div>
        <div className="score-hero__info">
          <div className="score-hero__label" style={{ color: scoreColor }}>{scoreLabel}</div>
          <p>{scoreTip}</p>
        </div>
      </div>

      {/* SCORE BREAKDOWN */}
      <div className="card">
        <h3 style={{ marginBottom: 20 }}>Détail du score</h3>
        <div className="score-breakdown">
          {components.map((c, i) => (
            <div className="score-component" key={i}>
              <div className="score-component__header">
                <div>
                  <strong>{c.label}</strong>
                  <span className="text-xs text-muted">{c.desc}</span>
                </div>
                <div className="score-component__values">
                  <span className="score-component__raw">{c.raw}</span>
                  <span className="score-component__pts" style={{ color: c.color }}>{c.value}<small>/{c.max}pts</small></span>
                </div>
              </div>
              <div className="score-bar">
                <div className="score-bar__fill" style={{ width: `${(c.value / c.max) * 100}%`, background: c.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCORE HISTORY */}
      <div className="card">
        <h3 style={{ marginBottom: 20 }}>Évolution de votre score</h3>
        <div className="score-history">
          {history.map((h, i) => (
            <div className="score-history__item" key={i}>
              <div className="score-history__bar-wrap">
                <div className="score-history__bar" style={{ height: `${h.score}%`, background: i === history.length - 1 ? scoreColor : 'var(--gray-200)' }} />
              </div>
              <strong style={{ color: i === history.length - 1 ? scoreColor : 'var(--gray-500)' }}>{h.score}</strong>
              <span className="text-xs text-muted">{h.period}</span>
            </div>
          ))}
        </div>
      </div>

      {/* NEXT ACTIONS */}
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Pour améliorer votre score</h3>
        <div className="next-actions">
          {[
            { action: 'Notez votre journal chaque matin', impact: '+5 pts potentiels', color: 'var(--green)' },
            { action: 'Terminez le module semaine 2', impact: '+8 pts potentiels', color: 'var(--blue)' },
            { action: 'Réduisez les liquides après 18h', impact: '+4 pts potentiels', color: 'var(--amber)' },
          ].map((a, i) => (
            <div className="next-action" key={i}>
              <div className="next-action__dot" style={{ background: a.color }} />
              <span>{a.action}</span>
              <span className="next-action__impact" style={{ color: a.color }}>{a.impact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
