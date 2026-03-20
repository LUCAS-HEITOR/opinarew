import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useOpiniao } from '../context/OpiniaoContext';
import './Admin.css';

const Admin = () => {
  const { opinioes, isAdmin, categorizarOpiniao, excluirOpiniao, getEstatisticas } = useOpiniao();
  const [filtro, setFiltro] = useState('todas');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const stats = getEstatisticas();

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  const categorias = [
    { valor: 'normal', label: 'Normal', emoji: '💬', cor: 'normal' },
    { valor: 'criminosa', label: 'Criminosa', emoji: '💀', cor: 'criminosa' },
    { valor: 'lucida', label: 'Lúcida', emoji: '🧠', cor: 'lucida' },
    { valor: 'chat-decide', label: 'Chat Decide', emoji: '🎭', cor: 'chat-decide' },
  ];

  const opinioeFiltradas = opinioes.filter(op => {
    if (filtro === 'todas') return true;
    if (filtro === 'pendente') return op.categoria === 'pendente';
    return op.categoria === filtro;
  });

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      excluirOpiniao(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header Stats */}
        <section className="admin-header animate-fade-in">
          <div className="header-content">
            <h1>
              <span>⚙️</span> Painel do Admin
            </h1>
            <p>Gerencie e categorize todas as opiniões</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
            <div className="stat-card pendente">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <span className="stat-value">{stats.pendentes}</span>
                <span className="stat-label">Pendentes</span>
              </div>
            </div>
            <div className="stat-card normal">
              <div className="stat-icon">💬</div>
              <div className="stat-info">
                <span className="stat-value">{stats.normais}</span>
                <span className="stat-label">Normais</span>
              </div>
            </div>
            <div className="stat-card criminosa">
              <div className="stat-icon">💀</div>
              <div className="stat-info">
                <span className="stat-value">{stats.criminosas}</span>
                <span className="stat-label">Criminosas</span>
              </div>
            </div>
            <div className="stat-card lucida">
              <div className="stat-icon">🧠</div>
              <div className="stat-info">
                <span className="stat-value">{stats.lucidas}</span>
                <span className="stat-label">Lúcidas</span>
              </div>
            </div>
            <div className="stat-card chat">
              <div className="stat-icon">🎭</div>
              <div className="stat-info">
                <span className="stat-value">{stats.chatDecide}</span>
                <span className="stat-label">Chat Decide</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="filters-section">
          <div className="filters">
            <button
              className={`filter-btn ${filtro === 'todas' ? 'active' : ''}`}
              onClick={() => setFiltro('todas')}
            >
              📋 Todas
            </button>
            <button
              className={`filter-btn pendente ${filtro === 'pendente' ? 'active' : ''}`}
              onClick={() => setFiltro('pendente')}
            >
              ⏳ Pendentes
              {stats.pendentes > 0 && <span className="filter-count">{stats.pendentes}</span>}
            </button>
            <button
              className={`filter-btn ${filtro === 'normal' ? 'active' : ''}`}
              onClick={() => setFiltro('normal')}
            >
              💬 Normais
            </button>
            <button
              className={`filter-btn ${filtro === 'criminosa' ? 'active' : ''}`}
              onClick={() => setFiltro('criminosa')}
            >
              💀 Criminosas
            </button>
            <button
              className={`filter-btn ${filtro === 'lucida' ? 'active' : ''}`}
              onClick={() => setFiltro('lucida')}
            >
              🧠 Lúcidas
            </button>
            <button
              className={`filter-btn ${filtro === 'chat-decide' ? 'active' : ''}`}
              onClick={() => setFiltro('chat-decide')}
            >
              🎭 Chat Decide
            </button>
          </div>
        </section>

        {/* Opinions List */}
        <section className="opinions-section">
          {opinioeFiltradas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>Nenhuma opinião encontrada</h3>
              <p>
                {filtro === 'todas'
                  ? 'Ainda não há opiniões enviadas'
                  : `Nenhuma opinião na categoria "${filtro}"`}
              </p>
            </div>
          ) : (
            <div className="opinions-list">
              {opinioeFiltradas.map((opiniao, index) => (
                <div
                  key={opiniao.id}
                  className={`opinion-card ${opiniao.categoria} ${!opiniao.lida ? 'nova' : ''}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="opinion-header">
                    <div className="opinion-author">
                      <span className="author-avatar">
                        {opiniao.autor.charAt(0).toUpperCase()}
                      </span>
                      <div className="author-info">
                        <span className="author-name">{opiniao.autor}</span>
                        <span className="opinion-date">{formatarData(opiniao.dataEnvio)}</span>
                      </div>
                    </div>
                    <div className={`category-tag ${opiniao.categoria}`}>
                      {opiniao.categoria === 'pendente' && '⏳ Pendente'}
                      {opiniao.categoria === 'normal' && '💬 Normal'}
                      {opiniao.categoria === 'criminosa' && '💀 Criminosa'}
                      {opiniao.categoria === 'lucida' && '🧠 Lúcida'}
                      {opiniao.categoria === 'chat-decide' && '🎭 Chat Decide'}
                    </div>
                  </div>

                  <div className="opinion-content">
                    <p>{opiniao.texto}</p>
                  </div>

                  <div className="opinion-actions">
                    <div className="category-buttons">
                      {categorias.map(cat => (
                        <button
                          key={cat.valor}
                          className={`cat-btn ${cat.cor} ${opiniao.categoria === cat.valor ? 'selected' : ''}`}
                          onClick={() => categorizarOpiniao(opiniao.id, cat.valor)}
                          title={cat.label}
                        >
                          <span className="cat-emoji">{cat.emoji}</span>
                          <span className="cat-label">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      className={`delete-btn ${confirmDelete === opiniao.id ? 'confirm' : ''}`}
                      onClick={() => handleDelete(opiniao.id)}
                    >
                      {confirmDelete === opiniao.id ? '⚠️ Confirmar' : '🗑️'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;
