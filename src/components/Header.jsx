import { Link, useLocation } from 'react-router-dom';
import { useOpiniao } from '../context/OpiniaoContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { isAdmin, logoutAdmin, getEstatisticas } = useOpiniao();
  const stats = getEstatisticas();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🔥</span>
          <span className="logo-text">OPINA<span className="logo-highlight">REW</span></span>
        </Link>

        <nav className="nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            Início
          </Link>

          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
              >
                <span className="nav-icon">⚙️</span>
                Painel Admin
                {stats.pendentes > 0 && (
                  <span className="badge">{stats.pendentes}</span>
                )}
              </Link>
              <Link
                to="/live"
                className={`nav-link ${location.pathname === '/live' ? 'active' : ''}`}
              >
                <span className="nav-icon">📺</span>
                Modo Live
              </Link>
              <button onClick={logoutAdmin} className="nav-link logout-btn">
                <span className="nav-icon">🚪</span>
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              <span className="nav-icon">🔐</span>
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
