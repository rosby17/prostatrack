import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useUserData } from '../lib/useUserData'
import './Program.css'

// Timer component
function Timer({ seconds, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            onComplete?.()
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const progress = ((seconds - timeLeft) / seconds) * 100

  return (
    <div style={{ background: 'var(--teal-light)', borderRadius: 12, padding: 20, textAlign: 'center', margin: '20px 0' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', marginBottom: 8 }}>MINUTEUR</p>
      <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--teal)', fontFamily: 'monospace', marginBottom: 12 }}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
      <div style={{ height: 6, background: 'white', borderRadius: 99, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--teal)', borderRadius: 99, transition: 'width 1s linear' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button className="btn btn-primary btn-sm" onClick={() => setRunning(r => !r)}>
          {running ? '⏸ Pause' : timeLeft === seconds ? '▶ Démarrer' : '▶ Reprendre'}
        </button>
        <button className="btn btn-outline btn-sm" onClick={() => { setRunning(false); setTimeLeft(seconds) }}>
          ↺ Réinitialiser
        </button>
      </div>
    </div>
  )
}

// Module content expanded view
function ModuleContent({ item, onMarkDone }) {
  const [localActions, setLocalActions] = useState(item.content?.dailyActions || [])
  const [timerDone, setTimerDone] = useState(false)

  const toggleAction = (id) => {
    setLocalActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a))
  }

  const allDone = localActions.every(a => a.done)

  return (
    <div className="module-content">
      {/* Objectif */}
      <div style={{ background: 'var(--teal-light)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', marginBottom: 4 }}>OBJECTIF DE CE MODULE</p>
        <p style={{ fontSize: 15, color: 'var(--teal-dark)', fontWeight: 500 }}>{item.content?.objective}</p>
      </div>

      {/* Points clés */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 12 }}>Points clés à retenir</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {item.content?.keyPoints?.map((point, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--teal)', fontSize: 16, flexShrink: 0, marginTop: 1 }}>✓</span>
              <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.5 }}>{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Protocole */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 12 }}>Protocole pratique</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {item.content?.protocol?.map((step, i) => (
            <div key={i} style={{ padding: '10px 14px', background: 'var(--gray-100)', borderRadius: 8, fontSize: 14, color: 'var(--charcoal)', lineHeight: 1.5 }}>
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Timer si applicable */}
      {item.content?.hasTimer && (
        <Timer seconds={item.content.timerSeconds} onComplete={() => setTimerDone(true)} />
      )}

      {/* Lien YouTube si disponible */}
      {item.youtubeUrl && (
        <a href={item.youtubeUrl} target="_blank" rel="noopener noreferrer"
          className="btn btn-primary" style={{ marginBottom: 20, display: 'flex', width: '100%', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          Regarder la vidéo sur YouTube
        </a>
      )}

      {/* Checklist actions du jour */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 12 }}>
          Actions à faire aujourd'hui
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {localActions.map(action => (
            <button key={action.id}
              onClick={() => toggleAction(action.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 8, border: '1px solid',
                borderColor: action.done ? 'var(--teal)' : 'var(--gray-200)',
                background: action.done ? 'var(--teal-light)' : 'white',
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
              }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                border: `2px solid ${action.done ? 'var(--teal)' : 'var(--gray-200)'}`,
                background: action.done ? 'var(--teal)' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {action.done && <svg width="12" height="12" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span style={{ fontSize: 14, color: action.done ? 'var(--teal-dark)' : 'var(--charcoal)', textDecoration: action.done ? 'line-through' : 'none', fontWeight: 500 }}>
                {action.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Astuce */}
      {item.content?.tip && (
        <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <p style={{ fontSize: 14, color: '#854d0e', lineHeight: 1.5 }}>{item.content.tip}</p>
        </div>
      )}

      {/* Bouton marquer comme terminé */}
      {!item.done && (
        <button
          className={`btn btn-full ${allDone ? 'btn-primary' : 'btn-outline'}`}
          onClick={onMarkDone}
          style={{ marginTop: 8 }}
        >
          {allDone ? '✓ Marquer ce module comme terminé' : 'Marquer comme terminé (sans tout cocher)'}
        </button>
      )}

      {item.done && (
        <div style={{ textAlign: 'center', padding: '16px', background: 'var(--teal-light)', borderRadius: 10 }}>
          <span style={{ fontSize: 24, marginRight: 8 }}>✅</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal)' }}>Module terminé !</span>
        </div>
      )}
    </div>
  )
}

export default function Program() {
  const [searchParams] = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'
  const { program, loading, markProgramDone } = useUserData(isDemo)

  const [activeWeek, setActiveWeek] = useState(1)
  const [expanded, setExpanded] = useState(null)

  const WEEKS = [...new Set(program.map(p => p.week))]
  const weekItems = program.filter(p => p.week === activeWeek)
  const totalDone = program.filter(p => p.done).length

  const handleMarkDone = async (item) => {
    await markProgramDone(item.week, item.title)
  }

  if (loading) return <div className="page-loader"><div className="spinner spinner-lg" /></div>

  return (
    <div className="program-page">
      <div className="program-header">
        <div>
          <h1>Programme 8 semaines</h1>
          <p className="text-muted text-sm">Votre protocole complet de santé prostatique naturelle</p>
        </div>
        <div className="program-overall">
          <span className="text-sm text-muted">{totalDone}/{program.length} modules complétés</span>
          <div className="program-overall__bar">
            <div style={{ width: `${(totalDone / program.length) * 100}%`, height: '100%', background: 'var(--teal)', borderRadius: 999, transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </div>

      {/* WEEK TABS */}
      <div className="week-tabs">
        {WEEKS.map(w => {
          const items = program.filter(p => p.week === w)
          const done = items.filter(p => p.done).length
          const complete = done === items.length
          const inProgress = done > 0 && !complete
          return (
            <button key={w}
              className={`week-tab ${activeWeek === w ? 'week-tab--active' : ''} ${complete ? 'week-tab--done' : ''}`}
              onClick={() => { setActiveWeek(w); setExpanded(null) }}>
              <div className="week-tab__num">
                {complete
                  ? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  : `S${w}`}
              </div>
              <span>Semaine {w}</span>
              <span className={`badge ${complete ? 'badge-green' : inProgress ? 'badge-amber' : 'badge-gray'}`}>
                {done}/{items.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* WEEK CONTENT */}
      <div className="week-content">
        <div className="week-content__title">
          <h2>Semaine {activeWeek}</h2>
          <span className="text-muted text-sm">{weekItems.length} modules</span>
        </div>
        <div className="lessons-list">
          {weekItems.map((item, i) => (
            <div key={i} className={`lesson-card card ${item.done ? 'lesson-card--done' : ''} ${expanded === i ? 'lesson-card--expanded' : ''}`}>
              {/* Header */}
              <div className="lesson-card__header" onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className={`lesson-card__status ${item.done ? 'lesson-card__status--done' : ''}`}>
                  {item.done
                    ? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    : <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                  }
                </div>
                <div className="lesson-card__info">
                  <div className="lesson-card__meta">
                    <span className={`badge ${item.type === 'video' ? 'badge-blue' : 'badge-green'}`}>
                      {item.type === 'video' ? '▶ Vidéo' : '📄 Guide PDF'}
                    </span>
                    <span className="text-xs text-muted">{item.duration}</span>
                    {item.content?.hasTimer && <span className="text-xs" style={{ color: 'var(--teal)' }}>⏱ Minuteur inclus</span>}
                  </div>
                  <h3>{item.title}</h3>
                  <p className="text-sm text-muted" style={{ marginTop: 4 }}>{item.description}</p>
                </div>
                <svg className="lesson-card__arrow" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  style={{ transform: expanded === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Expanded content */}
              {expanded === i && (
                <ModuleContent item={item} onMarkDone={() => handleMarkDone(item)} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}