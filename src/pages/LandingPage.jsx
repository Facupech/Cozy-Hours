import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import LanguageToggle from '../components/LanguageToggle';
import './LandingPage.css';
import './LandingPageExtras.css';

const LandingPage = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="landing-page">
      {/* Encabezado */}
      <header className="landing-header">
        <div className="header-container">
          <div className="logo">
            <h1>Cozy Hours</h1>
          </div>
          <nav className="nav">
            <LanguageToggle className="header-toggle" />
            <Link to="/login" className="nav-link">{t.login}</Link>
            <Link to="/register" className="nav-link btn-primary">{t.register}</Link>
          </nav>
        </div>
      </header>

      {/* Sección Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              {t.heroTitle} <span className="highlight">{t.heroTitleHighlight}</span>
            </h1>
            <p className="hero-subtitle">
              {t.heroSubtitle}
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                {t.startJourney}
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                {t.signIn}
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="emotional-preview">
              <div className="preview-card happy">
                <div className="card-emoji">😊</div>
                <div className="card-title">{t.happyWorkspace}</div>
                <div className="card-features">
                  <div className="feature">{t.happyMusic}</div>
                  <div className="feature">{t.brightColors}</div>
                  <div className="feature">{t.energeticVibes}</div>
                </div>
              </div>
              <div className="preview-card focused">
                <div className="card-emoji">🎯</div>
                <div className="card-title">{t.focusedMode}</div>
                <div className="card-features">
                  <div className="feature">{t.ambientSounds}</div>
                  <div className="feature">{t.calmColors}</div>
                  <div className="feature">{t.pomodoroTimer}</div>
                </div>
              </div>
              <div className="preview-card relaxed">
                <div className="card-emoji">😌</div>
                <div className="card-title">{t.relaxedSpace}</div>
                <div className="card-features">
                  <div className="feature">{t.natureSounds}</div>
                  <div className="feature">{t.softColors}</div>
                  <div className="feature">{t.gentleReminders}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de precios */}
      <section className="pricing">
        <div className="container">
          <h2 className="section-title">{t.choosePlan}</h2>
          <p className="section-subtitle">{t.planSubtitle}</p>
          
          <div className="pricing-grid">
            {/* Plan gratuito */}
            <div className="pricing-card free">
              <div className="plan-header">
                <div className="plan-icon">🆓</div>
                <h3 className="plan-name">{t.free}</h3>
                <div className="plan-price">
                  <span className="price">$0</span>
                  <span className="period">{t.perMonth}</span>
                </div>
              </div>
              
              <div className="plan-features">
                <div className="feature-item">
                  <span className="check">✅</span>
                  <span>{t.basicEmotionalSetup}</span>
                </div>
                <div className="feature-item">
                  <span className="check">✅</span>
                  <span>{t.standardMusicCollection}</span>
                </div>
                <div className="feature-item">
                  <span className="check">✅</span>
                  <span>{t.basicWallpapers}</span>
                </div>
                <div className="feature-item limited">
                  <span className="check">📝</span>
                  <span>{t.upTo5Notes}</span>
                </div>
                <div className="feature-item limited">
                  <span className="check">✅</span>
                  <span>{t.upTo10Tasks}</span>
                </div>
                <div className="feature-item limited">
                  <span className="check">🖥️</span>
                  <span>{t.upTo3Desktops}</span>
                </div>
              </div>
              
              <Link to="/register" className="plan-btn free-btn">
                {t.startFree}
              </Link>
            </div>

            {/* Plan Premium */}
            <div className="pricing-card premium">
              <div className="popular-badge">{t.mostPopular}</div>
              <div className="plan-header">
                <div className="plan-icon">👑</div>
                <h3 className="plan-name">{t.premium}</h3>
                <div className="plan-price">
                  <span className="price">$4.99</span>
                  <span className="period">{t.perMonth}</span>
                </div>
              </div>
              
              <div className="plan-features">
                <div className="feature-item">
                  <span className="check">✨</span>
                  <span>{t.everythingFree}</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">🎵</span>
                  <span>{t.premiumMusicLibrary}</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">🎨</span>
                  <span>{t.premiumWallpapers}</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">⚙️</span>
                  <span>{t.advancedCustomization}</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">📝</span>
                  <span>{t.unlimitedNotes}</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">✅</span>
                  <span>{t.unlimitedTasks}</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">🖥️</span>
                  <span>{t.unlimitedWorkspaces}</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">🎯</span>
                  <span>{t.prioritySupport}</span>
                </div>
              </div>
              
              <Link to="/register?trial=premium" className="plan-btn premium-btn">
                {t.startPremiumTrial}
              </Link>
            </div>
          </div>
          
          <div className="pricing-note">
            <p>{t.pricingNote}</p>
          </div>
        </div>
      </section>

      {/* Sección de características */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">{t.featuresTitle}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎭</div>
              <h3>{t.emotionalProfiles}</h3>
              <p>{t.emotionalProfilesDesc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>{t.adaptiveMusic}</h3>
              <p>{t.adaptiveMusicDesc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>{t.smartNotes}</h3>
              <p>{t.smartNotesDesc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>{t.moodBasedTasks}</h3>
              <p>{t.moodBasedTasksDesc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>{t.pomodoroTimerFeature}</h3>
              <p>{t.pomodoroTimerDesc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>{t.customThemes}</h3>
              <p>{t.customThemesDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaSubtitle}</p>
            <Link to="/register" className="btn btn-primary btn-large">
              {t.startFree}
            </Link>
          </div>
        </div>
      </section>

      {/* Pie de página */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Cozy Hours</h3>
              <p>{t.footerTagline}</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>{t.product}</h4>
                <Link to="/register">{t.register}</Link>
                <Link to="/login">{t.login}</Link>
              </div>
              <div className="link-group">
                <h4>{t.support}</h4>
                <a href="#help">{t.helpCenter}</a>
                <a href="#contact">{t.contactUs}</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Cozy Hours. {t.allRightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
