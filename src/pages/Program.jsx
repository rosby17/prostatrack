import { useState } from 'react'
import { MOCK_PROGRAM } from '../lib/mockData'
import './Program.css'

const WEEKS = [...new Set(MOCK_PROGRAM.map(p => p.week))]

export default function Program() {
  const [activeWeek, setActiveWeek] = useState(1)
  const [expanded, setExpanded] = useState(null)

  const weekItems = MOCK_PROGRAM.filter(p => p.week === activeWeek)
  const totalDone = MOCK_PROGRAM.filter(p => p.done).length

  return (
    <div className="program-page">
      <div className="program-header">
        <div>
          <h1>Programme 8 semaines</h1>
          <p className="text-muted text-sm">Votre protocole complet de santé prostatique naturelle</p>
        </div>
        <div className="program-overall">
          <span className="text-sm text-muted">{totalDone}/{MOCK_PROGRAM.length} modules complétés</span>
          <div className="program-overall__bar">
            <div style={{ width: `${(totalDone / MOCK_PROGRAM.length) * 100}%`, height: '100%', background: 'var(--green)', borderRadius: 999 }} />
          </div>
        </div>
      </div>

      {/* WEEK TABS */}
      <div className="week-tabs">
        {WEEKS.map(w => {
          const items = MOCK_PROGRAM.filter(p => p.week === w)
          const done = items.filter(p => p.done).length
          const complete = done === items.length
          const inProgress = done > 0 && !complete
          return (
            <button key={w} className={`week-tab ${activeWeek === w ? 'week-tab--active' : ''} ${complete ? 'week-tab--done' : ''}`} onClick={() => setActiveWeek(w)}>
              <div className="week-tab__num">
                {complete ? (
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                ) : `S${w}`}
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
              <div className="lesson-card__header" onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className={`lesson-card__status ${item.done ? 'lesson-card__status--done' : ''}`}>
                  {item.done ? (
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  ) : (
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
                  )}
                </div>
                <div className="lesson-card__info">
                  <div className="lesson-card__meta">
                    <span className={`badge ${item.type === 'video' ? 'badge-blue' : 'badge-green'}`}>
                      {item.type === 'video' ? 'Vidéo' : 'Guide PDF'}
                    </span>
                    <span className="text-xs text-muted">{item.duration}</span>
                  </div>
                  <h3>{item.title}</h3>
                </div>
                <svg className="lesson-card__arrow" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: expanded === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
              {expanded === i && (
                <div className="lesson-card__body">
                  <p>{item.description}</p>
                  <div className="lesson-card__actions">
                    <button className="btn btn-primary btn-sm">
                      {item.type === 'video' ? (
                        <>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          Lancer la vidéo
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                          Télécharger le guide
                        </>
                      )}
                    </button>
                    {!item.done && (
                      <button className="btn btn-outline btn-sm">Marquer comme terminé</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
