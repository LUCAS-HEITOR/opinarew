import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpiniao } from '../context/OpiniaoContext';
import './Login.css';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { loginAdmin, isAdmin } = useOpiniao();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  if (isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    setTimeout(() => {
      const resultado = loginAdmin(usuario, senha);

      if (resultado.success) {
        navigate('/admin');
      } else {
        setErro(resultado.message);
      }

      setCarregando(false);
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-container animate-fade-in">
        <div className="login-card card">
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <h1>Área Administrativa</h1>
            <p>Acesso restrito ao administrador</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="usuario">
                <span className="label-icon">👤</span>
                Usuário
              </label>
              <input
                type="text"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Digite seu usuário"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="senha">
                <span className="label-icon">🔑</span>
                Senha
              </label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>

            {erro && (
              <div className="error-message">
                <span>❌</span> {erro}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <div className="spinner small"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              <span>💡</span> Dica: Só o admin tem acesso aqui!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
