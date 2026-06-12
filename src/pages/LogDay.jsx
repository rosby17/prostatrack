import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { format, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useAuth } from '../context/AuthContext'
import { useUserData } from '../lib/useUserData'
import './LogDay.css'

const FIELDS = [
  {
    key: 'night_wakings',
    label: 'Réveils nocturnes',
    desc: 'Combien de fois vous êtes-vous levé cette nuit pour uriner ?',
    type: 'number',
    min: 0, max: 10,
    unit: 'fois',
    icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  },
  {
    key: 'sleep_quality',
    label: 'Qualité du sommeil',
    desc: 'Comment évaluez-vous la qualité globale de votre nuit ?',
    type: 'scale',
    min: 1, max: 5,
    labels: ['Très mauvaise', 'Mauvaise', 'Moyenne', 'Bonne', 'Excellente'],
    colors: ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e'],
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  },
  {
    key: 'urgency_level',
    label: "Niveau d'urgence urinaire",
    desc: "Dans la journée, avez-vous ressenti des envies soudaines et difficiles à retenir ?",
    type: 'scale',
    min: 1, max: 5,
    labels: ['Aucune', 'Légère', 'Modérée', 'Forte', 'Très forte'],
    colors: ['#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444'],
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  },
  {
    key: 'energy_level',
    label: "Niveau d'énergie",
    desc: "Comment vous sentez-vous physiquement et mentalement ce matin ?",
    type: 'scale',
    min: 1, max: 5,
    labels: ['Épuisé', 'Fatigué', 'Correct', 'En forme', 'Excellent'],
    colors: ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e'],
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
]

function ScaleSelector({ field, value, onChange }) {
  return (
    <div className="scale-selector">
      {Array.from({ length: field.max - field.min + 1 }, (_, i) => i + field.min).map(v => (
        <button
          key={v}
          type="button"
          className={`scale-btn ${value === v ? 'scale-btn--active' : ''}`}
          style={value === v ? { background: field.colors[v - field.min], borderColor: field.colors[v - field.min], color: 'white' } : {}}
          onClick={() => onChange(v)}
        >
          <span className="scale-btn__num">{v}</span>
          <span className="scale-btn__label">{field.labels[v - field.min]}</span>
        </button>
      ))}
    </div>
  )
}

export default function LogDay() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isDemo = params.get('demo') === 'true'
  const { user } = useAuth()
  const { logs, todayLog, addLog } = useUserData(isDemo)

  const [step, setStep] = useState(0)
  const [values, setValues] = useState({
    night_wakings: '',
    sleep_quality: null,
    urgency_level: null,
    energy_level: null
  })
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const today = format(new Date(), 'yyyy-MM-dd')
  const currentField = FIELDS[step]
  const isLast = step === FIELDS.length - 1

  const recentValues = [3, 2, 1].map(daysAgo => {
    const date = format(subDays(new Date(), daysAgo), 'yyyy-MM-dd')
    const log = logs.find(l => l.date === date)
    return log ? log[currentField.key] : null
  })

  const isStepValid = () => {
    const val = values[currentField.key]
    if (currentField.type === 'number') return val !== '' && val !== null && !isNaN(val)
    return val !== null
  }

  const handleNext = async () => {
    if (!isLast) { setStep(s => s + 1); return }
    setSaving(true)
    setError('')
    const { error } = await addLog({
      date: today,
      night_wakings: Number(values.night_wakings),
      sleep_quality: values.sleep_quality,
      urgency_level: values.urgency_level,
      energy_level: values.energy_level,
      notes,
    })
    setSaving(false)
    if (error && !isDemo) {
      setError("Erreur lors de l'enregistrement. Veuillez réessayer.")
      return
    }
    setSaved(true)
    setTimeout(() => navigate(`/dashboard${isDemo ? '?demo=true' : ''}`), 2000)
  }

  const setValue = (key, val) => setValues(p => ({ ...p, [key]: val }))

  // Déjà saisi aujourd'hui
  if (todayLog && !isDemo) {
    return (
      <div className="log-success">
        <div className="log-success__icon" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2>Journal déjà saisi aujourd'hui ✓</h2>
        <p className="text-muted">Vous avez déjà enregistré votre journal pour aujourd'hui.<br />Revenez demain pour continuer votre suivi !</p>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: 24 }}>
          Retour au tableau de bord
        </Link>
      </div>
    )
  }

  if (saved) {
    return (
      <div className="log-success">
        <div className="log-success__icon">
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2>Journal enregistré ✓</h2>
        <p>Vos données ont été sauvegardées. Votre tableau de bord est mis à jour.</p>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="log-page">
      <div className="log-header">
        <h1>Journal du jour</h1>
        <p className="text-muted text-sm">4 questions · environ 60 secondes</p>
      </div>

      <div className="log-progress">
        {FIELDS.map((_, i) => (
          <div key={i} className={`log-progress__dot ${i <= step ? 'log-progress__dot--active' : ''} ${i < step ? 'log-progress__dot--done' : ''}`} />
        ))}
      </div>

      <div className="log-card card">
        <div className="log-card__icon">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={currentField.icon} />
          </svg>
        </div>
        <div className="log-card__step text-xs text-muted">Question {step + 1} / {FIELDS.length}</div>
        <h2 className="log-card__title">{currentField.label}</h2>
        <p className="log-card__desc text-muted">{currentField.desc}</p>

        <div className="log-card__input">
          {currentField.type === 'number' ? (
            <div className="number-input">
              <button type="button" className="number-btn"
                onClick={() => setValue(currentField.key, Math.max(0, (values[currentField.key] || 0) - 1))}>−</button>
              <div className="number-display">
                <strong>{values[currentField.key] === '' ? '—' : values[currentField.key]}</strong>
                <span>{currentField.unit}</span>
              </div>
              <button type="button" className="number-btn"
                onClick={() => setValue(currentField.key, Math.min(currentField.max, (values[currentField.key] || 0) + 1))}>+</button>
            </div>
          ) : (
            <ScaleSelector field={currentField} value={values[currentField.key]} onChange={v => setValue(currentField.key, v)} />
          )}
        </div>

        {isLast && (
          <div className="form-group" style={{ marginTop: 24, marginBottom: 0 }}>
            <label className="form-label">Note personnelle (optionnel)</label>
            <textarea
              className="form-input" rows={3}
              placeholder="Comment vous sentez-vous aujourd'hui ? Quelque chose à noter ?"
              value={notes} onChange={e => setNotes(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>
        )}

        {error && <p className="form-error" style={{ marginTop: 12 }}>{error}</p>}

        <div className="log-card__actions">
          {step > 0 && (
            <button type="button" className="btn btn-outline" onClick={() => setStep(s => s - 1)}>
              ← Précédent
            </button>
          )}
          <button type="button" className="btn btn-primary" disabled={!isStepValid() || saving}
            onClick={handleNext} style={{ marginLeft: 'auto' }}>
            {saving
              ? <span className="spinner" style={{ borderColor: 'var(--teal-light)', borderTopColor: 'var(--white)' }} />
              : isLast ? 'Enregistrer mon journal' : 'Suivant →'
            }
          </button>
        </div>
      </div>

      <div className="log-history card card-sm">
        <p className="text-xs text-muted" style={{ marginBottom: 12, fontWeight: 600 }}>VOS 3 DERNIERS JOURS</p>
        <div className="log-history__grid">
          {[3, 2, 1].map((daysAgo, i) => (
            <div key={daysAgo} className="log-history__item">
              <span className="text-xs text-muted">{format(subDays(new Date(), daysAgo), 'EEE d', { locale: fr })}</span>
              <strong style={{ fontSize: 18, color: 'var(--dark)' }}>
                {recentValues[i] !== null ? recentValues[i] : '—'}
              </strong>
              <span className="text-xs text-muted">{currentField.unit || '/5'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}