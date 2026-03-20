import { useState, useEffect } from 'react';
import { useOpiniao } from '../context/OpiniaoContext';
import './Home.css';

const Home = () => {
  const { adicionarOpiniao, podeEnviar, tempoRestante, getEstatisticas, carregando } = useOpiniao();
  const [opiniao, setOpiniao] = useState('');
  const [autor, setAutor] = useState('');
  const [mensagem, setMensagem] = useState(null);
  const [tempoEspera, setTempoEspera] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const stats = getEstatisticas();

  useEffect(() => {
    const interval = setInterval(() => {
      setTempoEspera(tempoRestante());
    }, 1000);

    return () => clearInterval(interval);
  }, [tempoRestante]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!opiniao.trim()) {
      setMensagem({ tipo: 'error', texto: 'Digite sua opinião!' });
      return;
    }

    if (opiniao.trim().length < 10) {
      setMensagem({ tipo: 'error', texto: 'Opinião muito curta! Mínimo 10 caracteres.' });
      return;
    }

    setEnviando(true);

    // Simular delay para efeito visual
    setTimeout(() => {
      const resultado = adicionarOpiniao(opiniao.trim(), autor.trim());
      setMensagem({ tipo: resultado.success ? 'success' : 'error', texto: resultado.message });

      if (resultado.success) {
        setOpiniao('');
        setAutor('');
      }

      setEnviando(false);
    }, 800);
  };

  return (
    <div className="home">
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content animate-fade-in">
            <h1 className="hero-title">
              <span className="title-emoji">🔥</span>
              OPINA<span className="highlight">REW</span>
            </h1>
            <p className="hero-subtitle">
              Solte sua opinião mais absurda, polêmica ou lúcida!
              <br />
              <span className="subtitle-small">Todas serão lidas na live do TikTok</span>
            </p>

            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Opiniões</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{stats.criminosas}</span>
                <span className="stat-label">Criminosas 💀</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{stats.lucidas}</span>
                <span className="stat-label">Lúcidas 🧠</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="form-section">
          <div className="form-card card animate-fade-in">
            <div className="form-header">
              <h2>💭 Manda tua opinião!</h2>
              <p>Pode ser qualquer coisa... a gente julga na live 😂</p>
            </div>

            <form onSubmit={handleSubmit} className="opinion-form">
              <div className="input-group">
                <label htmlFor="autor">
                  <span className="label-icon">👤</span>
                  Nome (opcional)
                </label>
                <input
                  type="text"
                  id="autor"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  placeholder="Como quer ser chamado? (ou deixa em branco)"
                  maxLength={30}
                />
              </div>

              <div className="input-group">
                <label htmlFor="opiniao">
                  <span className="label-icon">💬</span>
                  Sua Opinião
                </label>
                <textarea
                  id="opiniao"
                  value={opiniao}
                  onChange={(e) => setOpiniao(e.target.value)}
                  placeholder="Escreva aqui sua opinião mais sincera, polêmica ou aleatória..."
                  maxLength={1000}
                  rows={5}
                />
                <div className="char-counter">
                  <span className={opiniao.length > 900 ? 'warning' : ''}>
                    {opiniao.length}/1000
                  </span>
                </div>
              </div>

              {mensagem && (
                <div className={`message ${mensagem.tipo}`}>
                  {mensagem.tipo === 'success' ? '✅' : '❌'} {mensagem.texto}
                </div>
              )}

              {tempoEspera > 0 ? (
                <div className="cooldown">
                  <div className="cooldown-icon">⏳</div>
                  <div className="cooldown-text">
                    <span>Aguarde para enviar outra</span>
                    <span className="cooldown-time">{tempoEspera}s</span>
                  </div>
                  <div className="cooldown-bar">
                    <div
                      className="cooldown-progress"
                      style={{ width: `${((60 - tempoEspera) / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary submit-btn"
                  disabled={enviando}
                >
                  {enviando ? (
                    <>
                      <div className="spinner small"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      Enviar Opinião
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
        </section>

        {/* Categories Info */}
        <section className="categories-section">
          <h3 className="section-title">📊 Categorias das Opiniões</h3>
          <div className="categories-grid">
            <div className="category-card normal">
              <div className="category-icon">💬</div>
              <h4>Opinião Normal</h4>
              <p>Você lê e reage normalmente</p>
            </div>
            <div className="category-card criminosa">
              <div className="category-icon">💀</div>
              <h4>Opinião Criminosa</h4>
              <p>As mais absurdas e polêmicas</p>
            </div>
            <div className="category-card lucida">
              <div className="category-icon">🧠</div>
              <h4>Opinião Lúcida</h4>
              <p>Polêmicas que fazem sentido</p>
            </div>
            <div className="category-card chat-decide">
              <div className="category-icon">🎭</div>
              <h4>Chat Decide</h4>
              <p>O chat escolhe: julgar ou defender</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
