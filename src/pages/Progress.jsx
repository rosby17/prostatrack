import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useUserData } from '../lib/useUserData'
import './Progress.css'

const PERIODS = [
  { label: '7 jours', value: 7 },
  { label: '30 jours', value: 30 },
]

const METRICS = [
  { key: 'night_wakings', label: 'Réveils nocturnes', color: '#16a05c', invert: true },
  { key: 'sleep_quality', label: 'Qualité sommeil', color: '#3b82f6' },
  { key: 'urgency_level', label: 'Urgence urinaire', color: '#f59e0b', invert: true },
  { key: 'energy_level', label: 'Énergie', color: '#8b5cf6' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 8, padding: '10px 14px', boxShadow: 'var(--shadow)', fontSize: 13 }}>
      <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--dark)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name} : <strong>{p.value}</strong></p>
      ))}
    </div>
  )
}

export default function Progress() {
  const [params] = useSearchParams()
  const isDemo = params.get('demo') === 'true'
  const { logs, loading } = useUserData(isDemo)

  const [period, setPeriod] = useState(30)
  const [activeMetric, setActiveMetric] = useState('night_wakings')

  const filteredLogs = logs.slice(-period)

  const chartData = filteredLogs.map(l => ({
    date: format(parseISO(l.date), 'd MMM', { locale: fr }),
    'Réveils': l.night_wakings,
    'Sommeil': l.sleep_quality,
    'Urgence': l.urgency_level,
    'Énergie': l.energy_level,
  }))

  const metric = METRICS.find(m => m.key === activeMetric)
  const metricKey = { night_wakings: 'Réveils', sleep_quality: 'Sommeil', urgency_level: 'Urgence', energy_level: 'Énergie' }[activeMetric]

  const first7 = filteredLogs.slice(0, 7)
  const last7 = filteredLogs.slice(-7)
  const avg = (arr, key) => arr.length ? Math.round(arr.reduce((s, l) => s + (l[key] || 0), 0) / arr.length * 10) / 10 : 0
  const improvement = avg(last7, activeMetric) - avg(first7, activeMetric)
  const isGood = metric.invert ? improvement < 0 : improvement > 0

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>

  if (logs.length === 0) {
    return (
      <div className="progress-page">
        <div className="progress-header">
          <h1>Ma progression</h1>
          <p className="text-muted text-sm">Suivez l'évolution de vos 4 indicateurs de santé</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📈</div>
          <h3 style={{ marginBottom: 8 }}>Pas encore de données</h3>
          <p className="text-muted text-sm">Commencez à saisir votre journal quotidien pour voir votre progression ici.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="progress-page">
      <div className="progress-header">
        <div>
          <h1>Ma progression</h1>
          <p className="text-muted text-sm">Suivez l'évolution de vos 4 indicateurs de santé</p>
        </div>
        <div className="period-toggle">
          {PERIODS.map(p => (
            <button key={p.value} className={`period-btn ${period === p.value ? 'period-btn--active' : ''}`} onClick={() => setPeriod(p.value)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="metric-tabs">
        {METRICS.map(m => (
          <button key={m.key} className={`metric-tab ${activeMetric === m.key ? 'metric-tab--active' : ''}`}
            style={activeMetric === m.key ? { borderColor: m.color, color: m.color } : {}}
            onClick={() => setActiveMetric(m.key)}>
            <span className="metric-tab__dot" style={{ background: m.color }} />
            {m.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="chart-header">
          <div>
            <h3>{metric.label}</h3>
            {filteredLogs.length >= 7 && (
              <div className={`improvement ${isGood ? 'improvement--good' : 'improvement--bad'}`}>
                {isGood ? '▼' : '▲'} {Math.abs(improvement).toFixed(1)} pts sur la période
              </div>
            )}
          </div>
          <div className="chart-legend">
            <span style={{ background: metric.color }} />
            {metric.label}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metric.color} stopOpacity={0.12} />
                <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--gray-400)' }} axisLine={false} tickLine={false} interval={Math.floor(chartData.length / 6)} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--gray-400)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={metricKey} name={metric.label} stroke={metric.color} strokeWidth={2.5} fill="url(#colorGrad)" dot={false} activeDot={{ r: 5, fill: metric.color }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 20 }}>Vue d'ensemble — {period} jours</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--gray-400)' }} axisLine={false} tickLine={false} interval={Math.floor(chartData.length / 5)} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--gray-400)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {METRICS.map(m => (
              <Line key={m.key} type="monotone" dataKey={{ night_wakings: 'Réveils', sleep_quality: 'Sommeil', urgency_level: 'Urgence', energy_level: 'Énergie' }[m.key]} stroke={m.color} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <div className="chart-legend-row">
          {METRICS.map(m => (
            <div key={m.key} className="legend-item">
              <span style={{ background: m.color }} />
              {m.label}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Résumé de la période</h3>
        <div className="summary-table">
          <div className="summary-table__head">
            <span>Indicateur</span>
            <span>Début de période</span>
            <span>Fin de période</span>
            <span>Évolution</span>
          </div>
          {METRICS.map(m => {
            const start = avg(first7, m.key)
            const end = avg(last7, m.key)
            const diff = end - start
            const good = m.invert ? diff < 0 : diff > 0
            return (
              <div className="summary-table__row" key={m.key}>
                <div className="summary-table__metric">
                  <span style={{ background: m.color }} />
                  {m.label}
                </div>
                <span>{start}</span>
                <span>{end}</span>
                <span className={good ? 'good' : diff === 0 ? '' : 'bad'}>
                  {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                  {good ? ' ✓' : diff !== 0 ? ' ✗' : ''}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}