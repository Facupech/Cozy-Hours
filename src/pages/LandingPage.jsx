import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import './LandingPageExtras.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Encabezado */}
      <header className="landing-header">
        <div className="header-container">
          <div className="logo">
            <h1>Cozy Hours</h1>
          </div>
          <nav className="nav">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link btn-primary">Empezar</Link>
          </nav>
        </div>
      </header>

      {/* Sección Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Adapte su espacio de trabajo a sus necesidades <span className="highlight">Estado Emocional</span>
            </h1>
            <p className="hero-subtitle">
              Cozy Hours crea entornos digitales personalizados que responden a cómo te sientes,
              ayudándote a ser más productivo y a mantener un equilibrio emocional a lo largo del día.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Comience su viaje
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Iniciar sesión
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="emotional-preview">
              <div className="preview-card happy">
                <div className="card-emoji">😊</div>
                <div className="card-title">Espacio de trabajo feliz</div>
                <div className="card-features">
                  <div className="feature">🎵 Música alegre</div>
                  <div className="feature">🌈 Colores brillantes</div>
                  <div className="feature">✨ Vibraciones energéticas</div>
                </div>
              </div>
              <div className="preview-card focused">
                <div className="card-emoji">🎯</div>
                <div className="card-title">Modo enfocado</div>
                <div className="card-features">
                  <div className="feature">🎧 Sonidos ambientales</div>
                  <div className="feature">🔵 Colores tranquilos</div>
                  <div className="feature">⏱️ Temporizador Pomodoro</div>
                </div>
              </div>
              <div className="preview-card relaxed">
                <div className="card-emoji">😌</div>
                <div className="card-title">Espacio Relajado</div>
                <div className="card-features">
                  <div className="feature">🌊 Sonidos de la naturaleza</div>
                  <div className="feature">🟢 Colores suaves</div>
                  <div className="feature">📝 Recordatorios suaves</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de precios */}
      <section className="pricing">
        <div className="container">
          <h2 className="section-title">Elige tu plan perfecto</h2>
          <p className="section-subtitle">Comience gratis y actualice en cualquier momento para desbloquear funciones premium</p>
          
          <div className="pricing-grid">
            {/* Plan gratuito */}
            <div className="pricing-card free">
              <div className="plan-header">
                <div className="plan-icon">🆓</div>
                <h3 className="plan-name">Gratuito</h3>
                <div className="plan-price">
                  <span className="price">$0</span>
                  <span className="period">/mes</span>
                </div>
              </div>
              
              <div className="plan-features">
                <div className="feature-item">
                  <span className="check">✅</span>
                  <span>Configuración básica del espacio de trabajo emocional</span>
                </div>
                <div className="feature-item">
                  <span className="check">✅</span>
                  <span>Colección de música estándar</span>
                </div>
                <div className="feature-item">
                  <span className="check">✅</span>
                  <span>Fondos de pantalla y temas básicos</span>
                </div>
                <div className="feature-item limited">
                  <span className="check">📝</span>
                  <span>Hasta 5 notas</span>
                </div>
                <div className="feature-item limited">
                  <span className="check">✅</span>
                  <span>Hasta 10 tareas</span>
                </div>
                <div className="feature-item limited">
                  <span className="check">🖥️</span>
                  <span>Hasta 3 escritorios</span>
                </div>
              </div>
              
              <Link to="/register" className="plan-btn free-btn">
                Comience gratis
              </Link>
            </div>

            {/* Plan Premium */}
            <div className="pricing-card premium">
              <div className="popular-badge">mas popular</div>
              <div className="plan-header">
                <div className="plan-icon">👑</div>
                <h3 className="plan-name">Premium</h3>
                <div className="plan-price">
                  <span className="price">$4.99</span>
                  <span className="period">/mes</span>
                </div>
              </div>
              
              <div className="plan-features">
                <div className="feature-item">
                  <span className="check">✨</span>
                  <span>Todo gratis</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">🎵</span>
                  <span>Biblioteca de música premium exclusiva</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">🎨</span>
                  <span>Fondos de pantalla y temas premium</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">⚙️</span>
                  <span>Opciones de personalización avanzadas</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">📝</span>
                  <span>Notas ilimitadas</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">✅</span>
                  <span>Tareas ilimitadas</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">🖥️</span>
                  <span>Espacios de trabajo ilimitados</span>
                </div>
                <div className="feature-item premium-feature">
                  <span className="check">🎯</span>
                  <span>Apoyo prioritario</span>
                </div>
              </div>
              
              <Link to="/register?trial=premium" className="plan-btn premium-btn">
                Iniciar prueba premium
              </Link>
            </div>
          </div>
          
          <div className="pricing-note">
            <p>💡 Todos los planes incluyen funciones esenciales de productividad emocional. ¡Actualízalo o reduce tu plan cuando quieras!</p>
          </div>
        </div>
      </section>

      {/* Sección de características */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Todo lo que necesitas para la productividad emocional</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎭</div>
              <h3>Perfiles emocionales</h3>
              <p>Crea espacios de trabajo personalizados que se adapten a tu estado emocional actual y aumenten tu productividad.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>Música adaptativa</h3>
              <p>Listas de reproducción seleccionadas y sonidos ambientales que se ajustan automáticamente a tu estado de ánimo seleccionado.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Notas inteligentes</h3>
              <p>Captura pensamientos e ideas con notas que se adapten al tema de tu espacio de trabajo emocional.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Tareas basadas en el estado de ánimo</h3>
              <p>Organice sus tareas pendientes con un sistema de gestión de tareas que comprende sus niveles de energía emocional.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Temporizador Pomodoro</h3>
              <p>Temporizador de enfoque incorporado con descansos diseñados para mantener su bienestar emocional.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Temas personalizados</h3>
              <p>Hermosos esquemas de colores y elementos visuales que cambian según tu estado emocional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>¿Estás listo para transformar tu espacio de trabajo?</h2>
            <p>Únase a miles de usuarios que han descubierto el poder de la productividad emocional.</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Comience gratis
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
              <p>Productividad emocional para el espacio de trabajo moderno.</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Producto</h4>
                <Link to="/register">Empezar</Link>
                <Link to="/login">Iniciar sesión</Link>
              </div>
              <div className="link-group">
                <h4>Soporte</h4>
                <a href="#help">Centro de ayuda</a>
                <a href="#contact">Contactanos</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Cozy Hours. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
