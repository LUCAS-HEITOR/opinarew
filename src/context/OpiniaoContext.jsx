import { createContext, useContext, useState, useEffect } from 'react';
import {
  db,
  collection,
  addDoc,
  query,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from '../config/firebase';

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
  const [carregando, setCarregando] = useState(true);

  // Credenciais do admin
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'opinarew2024';

  // Carregar opiniões em tempo real do Firestore
  useEffect(() => {
    console.log('📡 Conectando ao Firestore...');
    try {
      const opinioesCollection = collection(db, 'opinioes');
      const unsubscribe = onSnapshot(opinioesCollection, (snapshot) => {
        const dados = [];
        snapshot.forEach((docSnapshot) => {
          dados.push({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          });
        });
        // Ordenar por data mais recente primeiro
        dados.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio));
        setOpinioes(dados);
        console.log('✅ Opiniões carregadas:', dados.length);
        setCarregando(false);
      });

      // Carregar sessão do admin
      const adminSession = localStorage.getItem('opinarew_admin_session');
      if (adminSession === 'true') {
        setIsAdmin(true);
      }

      return () => unsubscribe();
    } catch (erro) {
      console.error('❌ Erro ao conectar Firestore:', erro);
      setCarregando(false);
    }
  }, []);

  // Verificar se pode enviar (limite de 1 por minuto)
  const podeEnviar = () => {
    const ultimoEnvio = localStorage.getItem('opinarew_ultimo_envio');
    if (!ultimoEnvio) return true;

    const agora = Date.now();
    const diferenca = agora - parseInt(ultimoEnvio);
    const tempoMinimo = 10 * 1000; // 10 segundos para teste

    return diferenca >= tempoMinimo;
  };

  const tempoRestante = () => {
    const ultimoEnvio = localStorage.getItem('opinarew_ultimo_envio');
    if (!ultimoEnvio) return 0;

    const agora = Date.now();
    const diferenca = agora - parseInt(ultimoEnvio);
    const tempoMinimo = 10 * 1000; // 10 segundos para teste

    if (diferenca >= tempoMinimo) return 0;
    return Math.ceil((tempoMinimo - diferenca) / 1000);
  };

  // Adicionar opinião ao Firestore
  const adicionarOpiniao = async (texto, autor) => {
    console.log('🔥 Tentando adicionar opinião:', { texto, autor });

    if (!podeEnviar()) {
      console.warn('❌ Cooldown ativo');
      return { success: false, message: 'Aguarde antes de enviar outra opinião!' };
    }

    try {
      const novaOpiniao = {
        texto,
        autor: autor || 'Anônimo',
        categoria: 'pendente',
        dataEnvio: new Date().toISOString(),
        lida: false,
      };

      const docRef = await addDoc(collection(db, 'opinioes'), novaOpiniao);
      console.log('✅ Opinião salva no Firestore com ID:', docRef.id);
      localStorage.setItem('opinarew_ultimo_envio', Date.now().toString());

      return { success: true, message: '✨ Opinião enviada com sucesso! Obrigado! 🔥' };
    } catch (erro) {
      console.error('❌ Erro ao salvar opinião:', erro);
      return { success: false, message: 'Erro ao enviar opinião. Tente novamente!' };
    }
  };

  // Categorizar opinião
  const categorizarOpiniao = async (id, categoria) => {
    try {
      const docRef = doc(db, 'opinioes', id);
      await updateDoc(docRef, {
        categoria,
        lida: true,
      });
      console.log('✅ Opinião categorizada:', id);
    } catch (erro) {
      console.error('❌ Erro ao categorizar:', erro);
    }
  };

  // Marcar como lida
  const marcarComoLida = async (id) => {
    try {
      const docRef = doc(db, 'opinioes', id);
      await updateDoc(docRef, { lida: true });
    } catch (erro) {
      console.error('❌ Erro ao marcar como lida:', erro);
    }
  };

  // Excluir opinião
  const excluirOpiniao = async (id) => {
    try {
      await deleteDoc(doc(db, 'opinioes', id));
      console.log('✅ Opinião deletada:', id);
    } catch (erro) {
      console.error('❌ Erro ao deletar:', erro);
    }
  };

  // Login admin
  const loginAdmin = (usuario, senha) => {
    if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
      setIsAdmin(true);
      localStorage.setItem('opinarew_admin_session', 'true');
      return { success: true };
    }
    return { success: false, message: 'Credenciais inválidas!' };
  };

  // Logout admin
  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('opinarew_admin_session');
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
        carregando,
      }}
    >
      {children}
    </OpiniaoContext.Provider>
  );
};
