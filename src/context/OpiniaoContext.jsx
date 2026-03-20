import { createContext, useContext, useState, useEffect } from 'react';

const OpiniaoContext = createContext();

export const useOpiniao = () => {
  const context = useContext(OpiniaoContext);
  if (!context) {
    throw new Error('useOpiniao deve ser usado dentro de um OpiniaoProvider');
  }
  return context;
};

export const OpiniaoProvider = ({ children }) => {
  const [opinioes, setOpinioes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Credenciais do admin (em produção, isso seria no backend)
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'opinarew2024';

  // Carregar opiniões do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('opinarew_opinioes');
    if (saved) {
      setOpinioes(JSON.parse(saved));
    }

    const adminSession = localStorage.getItem('opinarew_admin');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Salvar opiniões no localStorage
  useEffect(() => {
    localStorage.setItem('opinarew_opinioes', JSON.stringify(opinioes));
  }, [opinioes]);

  // Verificar se pode enviar (limite configurável)
  const podeEnviar = () => {
    const ultimoEnvio = localStorage.getItem('opinarew_ultimo_envio');
    if (!ultimoEnvio) return true;

    const agora = Date.now();
    const diferenca = agora - parseInt(ultimoEnvio);
    const tempoMinimo = 10 * 1000; // 10 segundos para teste (mude para 60*1000 depois)

    return diferenca >= tempoMinimo;
  };

  const tempoRestante = () => {
    const ultimoEnvio = localStorage.getItem('opinarew_ultimo_envio');
    if (!ultimoEnvio) return 0;

    const agora = Date.now();
    const diferenca = agora - parseInt(ultimoEnvio);
    const tempoMinimo = 10 * 1000; // 10 segundos para teste (mude para 60*1000 depois)

    if (diferenca >= tempoMinimo) return 0;
    return Math.ceil((tempoMinimo - diferenca) / 1000);
  };

  // Adicionar opinião
  const adicionarOpiniao = (texto, autor) => {
    console.log('🔥 Tentando adicionar opinião:', { texto, autor });

    if (!podeEnviar()) {
      console.warn('❌ Cooldown ativo - aguarde antes de enviar outra');
      return { success: false, message: 'Aguarde antes de enviar outra opinião!' };
    }

    const novaOpiniao = {
      id: Date.now(),
      texto,
      autor: autor || 'Anônimo',
      categoria: 'pendente',
      dataEnvio: new Date().toISOString(),
      lida: false,
    };

    console.log('✅ Opinião adicionada ao state:', novaOpiniao);
    setOpinioes(prev => [novaOpiniao, ...prev]);
    localStorage.setItem('opinarew_ultimo_envio', Date.now().toString());

    return { success: true, message: '✨ Opinião enviada com sucesso! Obrigado! 🔥' };
  };

  // Categorizar opinião (apenas admin)
  const categorizarOpiniao = (id, categoria) => {
    setOpinioes(prev =>
      prev.map(op =>
        op.id === id ? { ...op, categoria, lida: true } : op
      )
    );
  };

  // Marcar como lida
  const marcarComoLida = (id) => {
    setOpinioes(prev =>
      prev.map(op =>
        op.id === id ? { ...op, lida: true } : op
      )
    );
  };

  // Excluir opinião (apenas admin)
  const excluirOpiniao = (id) => {
    setOpinioes(prev => prev.filter(op => op.id !== id));
  };

  // Login admin
  const loginAdmin = (usuario, senha) => {
    if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
      setIsAdmin(true);
      localStorage.setItem('opinarew_admin', 'true');
      return { success: true };
    }
    return { success: false, message: 'Credenciais inválidas!' };
  };

  // Logout admin
  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('opinarew_admin');
  };

  // Estatísticas
  const getEstatisticas = () => {
    const total = opinioes.length;
    const pendentes = opinioes.filter(op => op.categoria === 'pendente').length;
    const normais = opinioes.filter(op => op.categoria === 'normal').length;
    const criminosas = opinioes.filter(op => op.categoria === 'criminosa').length;
    const lucidas = opinioes.filter(op => op.categoria === 'lucida').length;
    const chatDecide = opinioes.filter(op => op.categoria === 'chat-decide').length;
    const naoLidas = opinioes.filter(op => !op.lida).length;

    return { total, pendentes, normais, criminosas, lucidas, chatDecide, naoLidas };
  };

  return (
    <OpiniaoContext.Provider
      value={{
        opinioes,
        isAdmin,
        adicionarOpiniao,
        categorizarOpiniao,
        marcarComoLida,
        excluirOpiniao,
        loginAdmin,
        logoutAdmin,
        podeEnviar,
        tempoRestante,
        getEstatisticas,
      }}
    >
      {children}
    </OpiniaoContext.Provider>
  );
};
