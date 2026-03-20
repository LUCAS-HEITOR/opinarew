import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useOpiniao } from '../context/OpiniaoContext';
import './Live.css';

const Live = () => {
  const { opinioes, isAdmin, categorizarOpiniao } = useOpiniao();
  const [opiniaoAtual, setOpiniaoAtual] = useState(null);
  const [indice, setIndice] = useState(0);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [modoApresentacao, setModoApresentacao] = useState(false);
  const [animacao, setAnimacao] = useState('');

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  const opinioesDisponiveis = opinioes.filter(op => {
    if (filtroCategoria === 'todas') return true;
    if (filtroCategoria === 'pendente') return op.categoria === 'pendente';
    return op.categoria === filtroCategoria;
  });

  useEffect(() => {
    if (opinioesDisponiveis.length > 0 && indice < opinioesDisponiveis.length) {
      setOpiniaoAtual(opinioesDisponiveis[indice]);
    } else if (opinioesDisponiveis.length > 0) {
      setIndice(0);
      setOpiniaoAtual(opinioesDisponiveis[0]);
    } else {
      setOpiniaoAtual(null);
    }
  }, [indice, opinioesDisponiveis]);

  const proximaOpiniao = () => {
    setAnimacao('slide-out');
    setTimeout(() => {
      if (indice < opinioesDisponiveis.length - 1) {
        setIndice(indice + 1);
      } else {
        setIndice(0);
      }
      setAnimacao('slide-in');
      setTimeout(() => setAnimacao(''), 500);
    }, 300);
  };

  const opiniaoAnterior = () => {
    setAnimacao('slide-out-right');
    setTimeout(() => {
      if (indice > 0) {
        setIndice(indice - 1);
      } else {
        setIndice(opinioesDisponiveis.length - 1);
      }
      setAnimacao('slide-in');
      setTimeout(() => setAnimacao(''), 500);
    }, 300);
  };

  const getCategoriaInfo = (categoria) => {
    const infos = {
      pendente: { emoji: '⏳', label: 'PENDENTE', cor: 'pendente' },
      normal: { emoji: '💬', label: 'OPINIÃO NORMAL', cor: 'normal' },
      criminosa: { emoji: '💀', label: 'OPINIÃO CRIMINOSA', cor: 'criminosa' },
      lucida: { emoji: '🧠', label: 'OPINIÃO LÚCIDA', cor: 'lucida' },
      'chat-decide': { emoji: '🎭', label: 'CHAT DECIDE', cor: 'chat-decide' },
    };
    return infos[categoria] || infos.pendente;
  };

  return (
    <div className={`live-page ${modoApresentacao ? 'fullscreen' : ''}`}>
      {/* Controles */}
      {!modoApresentacao && (
        <div className="live-controls">
          <div className="controls-left">
            <select
              value={filtroCategoria}
              onChange={(e) => {
                setFiltroCategoria(e.target.value);
                setIndice(0);
              }}
              className="filter-select"
            >
              <option value="todas">📋 Todas ({opinioes.length})</option>
              <option value="pendente">⏳ Pendentes ({opinioes.filter(o => o.categoria === 'pendente').length})</option>
              <option value="normal">💬 Normais ({opinioes.filter(o => o.categoria === 'normal').length})</option>
              <option value="criminosa">💀 Criminosas ({opinioes.filter(o => o.categoria === 'criminosa').length})</option>
              <option value="lucida">🧠 Lúcidas ({opinioes.filter(o => o.categoria === 'lucida').length})</option>
              <option value="chat-decide">🎭 Chat Decide ({opinioes.filter(o => o.categoria === 'chat-decide').length})</option>
            </select>
            <span className="counter">
              {opinioesDisponiveis.length > 0 ? `${indice + 1}/${opinioesDisponiveis.length}` : '0/0'}
            </span>
          </div>
          <div className="controls-right">
            <button
              className="btn-fullscreen"
              onClick={() => setModoApresentacao(true)}
            >
              🖥️ Modo Apresentação
            </button>
          </div>
        </div>
      )}

      {/* Área Principal */}
      <div className="live-main">
        {opiniaoAtual ? (
          <div className={`opinion-display ${animacao}`}>
            {/* Categoria Badge */}
            <div className={`live-category-badge ${getCategoriaInfo(opiniaoAtual.categoria).cor}`}>
              <span className="badge-emoji">{getCategoriaInfo(opiniaoAtual.categoria).emoji}</span>
              <span className="badge-text">{getCategoriaInfo(opiniaoAtual.categoria).label}</span>
            </div>

            {/* Autor */}
            <div className="live-author">
              <div className="author-avatar-live">
                {opiniaoAtual.autor.charAt(0).toUpperCase()}
              </div>
              <span className="author-name-live">{opiniaoAtual.autor}</span>
            </div>

            {/* Opinião */}
            <div className="live-opinion-text">
              <span className="quote-mark">"</span>
              {opiniaoAtual.texto}
              <span className="quote-mark">"</span>
            </div>

            {/* Ações Rápidas */}
            {!modoApresentacao && (
              <div className="live-quick-actions">
                <button
                  className="quick-cat-btn normal"
                  onClick={() => categorizarOpiniao(opiniaoAtual.id, 'normal')}
                >
                  💬 Normal
                </button>
                <button
                  className="quick-cat-btn criminosa"
                  onClick={() => categorizarOpiniao(opiniaoAtual.id, 'criminosa')}
                >
                  💀 Criminosa
                </button>
                <button
                  className="quick-cat-btn lucida"
                  onClick={() => categorizarOpiniao(opiniaoAtual.id, 'lucida')}
                >
                  🧠 Lúcida
                </button>
                <button
                  className="quick-cat-btn chat-decide"
                  onClick={() => categorizarOpiniao(opiniaoAtual.id, 'chat-decide')}
                >
                  🎭 Chat Decide
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="no-opinion">
            <div className="no-opinion-icon">📭</div>
            <h2>Nenhuma opinião disponível</h2>
            <p>Aguardando novas opiniões...</p>
          </div>
        )}
      </div>

      {/* Navegação */}
      <div className="live-navigation">
        <button className="nav-btn prev" onClick={opiniaoAnterior} disabled={opinioesDisponiveis.length <= 1}>
          ⬅️ Anterior
        </button>
        <button className="nav-btn next" onClick={proximaOpiniao} disabled={opinioesDisponiveis.length <= 1}>
          Próxima ➡️
        </button>
      </div>

      {/* Botão Sair Fullscreen */}
      {modoApresentacao && (
        <button
          className="exit-fullscreen"
          onClick={() => setModoApresentacao(false)}
        >
          ✕
        </button>
      )}

      {/* Branding */}
      <div className="live-branding">
        <span className="brand-icon">🔥</span>
        <span className="brand-text">OPINAREW</span>
      </div>
    </div>
  );
};

export default Live;
