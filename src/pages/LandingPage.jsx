import { Link } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing">
      {/* HEADER */}
      <header className="landing-header">
        <div className="landing-logo">
          <div className="landing-logo-dot" />
          <span>ProstaTrack</span>
        </div>
        <div className="landing-nav">
          <Link to="/login" className="btn btn-ghost">Connexion</Link>
          <Link to="/register" className="btn btn-primary">Commencer gratuitement</Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge badge-accent mb-6">Nouveau programme 8 semaines</div>
          <h1 className="hero-title">Dormez à nouveau sans interruption.</h1>
          <p className="hero-subtitle">
            ProstaTrack est le premier outil d'accompagnement quotidien conçu pour vous aider à réduire la nycturie, comprendre votre prostate et retrouver votre énergie.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Commencer mon suivi</Link>
            <p className="hero-guarantee">✓ Gratuit et sans engagement</p>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-header">
              <span className="hero-card-label">Score de Santé</span>
              <span className="hero-card-value">82/100</span>
            </div>
            <div className="hero-card-chart">
              <div className="hero-bar" style={{ height: '40%' }}></div>
              <div className="hero-bar" style={{ height: '60%' }}></div>
              <div className="hero-bar" style={{ height: '50%' }}></div>
              <div className="hero-bar" style={{ height: '80%' }}></div>
              <div className="hero-bar" style={{ height: '90%' }}></div>
            </div>
            <p className="hero-card-desc">"Vos réveils nocturnes ont diminué de 50% ce mois-ci."</p>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="problem">
        <div className="container">
          <h2 className="section-title">Vous n'êtes pas seul face à ces symptômes.</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">🌙</div>
              <h3>Réveils fréquents</h3>
              <p>Se lever 2, 3 ou 4 fois par nuit épuise votre corps et affecte votre humeur au quotidien.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">⚡</div>
              <h3>Urgence urinaire</h3>
              <p>Cette sensation soudaine qui vous empêche de profiter pleinement de vos sorties ou voyages.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">📉</div>
              <h3>Baisse d'énergie</h3>
              <p>Le manque de sommeil profond s'accumule, créant une fatigue chronique difficile à surmonter.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="solution">
        <div className="container">
          <div className="solution-split">
            <div className="solution-text">
              <h2 className="section-title">Une approche complète et personnalisée</h2>
              <ul className="solution-list">
                <li>
                  <span className="solution-check">✓</span>
                  <div>
                    <strong>Journal quotidien</strong>
                    <p>Notez vos symptômes en 10 secondes chaque matin pour identifier ce qui fonctionne.</p>
                  </div>
                </li>
                <li>
                  <span className="solution-check">✓</span>
                  <div>
                    <strong>Score de santé intelligent</strong>
                    <p>Suivez votre évolution grâce à un algorithme qui analyse vos progrès.</p>
                  </div>
                </li>
                <li>
                  <span className="solution-check">✓</span>
                  <div>
                    <strong>Programme 8 semaines</strong>
                    <p>Guides et vidéos pour adapter votre alimentation, hydratation et renforcer votre plancher pelvien.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="solution-image">
              <div className="mockup-placeholder">
                <p>Interface intuitive et chaleureuse</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title text-center">Ce qu'ils en pensent</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">"Je suis passé de 4 réveils par nuit à 1 seul. Le programme d'exercices m'a vraiment aidé à reprendre le contrôle."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">M</div>
                <div>
                  <strong>Michel D.</strong>
                  <span>62 ans, Lyon</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">"L'application est très simple à utiliser. Le suivi quotidien me motive à faire attention à mon hydratation le soir."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">J</div>
                <div>
                  <strong>Jean-Paul B.</strong>
                  <span>58 ans, Nantes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container text-center">
          <h2 className="section-title">Prêt à retrouver des nuits paisibles ?</h2>
          <p className="cta-subtitle">Rejoignez des milliers d'hommes qui ont déjà amélioré leur santé prostatique.</p>
          <Link to="/register" className="btn btn-accent btn-lg">Créer mon compte gratuit</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="landing-logo">
                <div className="landing-logo-dot" />
                <span>ProstaTrack</span>
              </div>
              <p>L'outil d'accompagnement pour la santé prostatique.</p>
            </div>
            <div className="footer-links">
              <div>
                <h4>Produit</h4>
                <Link to="/pricing">Tarifs</Link>
                <Link to="/login">Connexion</Link>
              </div>
              <div>
                <h4>Légal</h4>
                <a href="#">CGU</a>
                <a href="#">Confidentialité</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 ProstaTrack. Tous droits réservés.</p>
            <p className="footer-disclaimer">ProstaTrack n'est pas un dispositif médical et ne remplace pas une consultation avec votre urologue.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
