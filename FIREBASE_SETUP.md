# 🔥 OPINAREW - Configuração Firebase

## Como Configurar Firebase (Passo a Passo)

### 1️⃣ Criar um Projeto no Firebase Console

1. Acesse: **https://console.firebase.google.com/**
2. Clique em **"Adicionar projeto"**
3. Escolha um nome (ex: `opinarew-app`)
4. Desabilite Google Analytics (opcional)
5. Clique em **"Criar projeto"**
6. Aguarde o projeto ser criado

### 2️⃣ Pegar as Credenciais

1. No painel esquerdo, clique em **⚙️ Configurações do projeto**
2. Role para baixo até **"Seus aplicativos"**
3. Clique no ícone **`</>`** para criar um aplicativo web
4. Dê um nome (ex: `opinarew-web`)
5. Copie o objeto de configuração que aparecer

Seu config será assim:
```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456...",
  appId: "1:123456..."
}
```

### 3️⃣ Criar a Coleção no Firestore

1. No painel esquerdo, clique em **Firestore Database**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Modo de produção"** (ou teste se quiser desenvolvimento)
4. Selecione a localização (ex: `us-central1`)
5. Clique em **"Criar"**

### 4️⃣ Configurar o Arquivo .env.local

1. Na raiz do projeto (`c:/Users/CoreL/OneDrive/Desktop/PET LINK/OPINAREW/`)
2. Crie um arquivo chamado `.env.local`
3. Copie e preencha com seus valores:

```env
VITE_FIREBASE_API_KEY=AIzaSyD...aqui_sua_api_key...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 5️⃣ Definir Permissões de Segurança

1. No Firestore, clique na aba **"Regras"**
2. Substitua pelo código abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Qualquer um pode ler opiniões
    match /opinioes/{document=**} {
      allow read;
      // Apenas permitir adicionar novas opiniões
      allow create;
      // Não permitir editar ou deletar (apenas admin faz isso)
      allow update, delete: if false;
    }
  }
}
```

3. Clique em **"Publicar"**

### 6️⃣ Pronto!

Agora:
- Pessoas podem enviar opiniões (criadas no Firestore)
- Admin pode categorizar (usa localStorage para autenticação simples)
- Tudo está sincronizado em tempo real! 🚀

---

## 📝 Testando

1. Reinicie o servidor: `npm run dev`
2. Envie uma opinião
3. Vá para `/admin` (user: `admin`, pass: `opinarew2024`)
4. Veja a opinião aparecer em tempo real!

---

## 🚨 Importante!

- **Não commit do arquivo `.env.local`** (já está no .gitignore)
- O `.env.example` mostra o template
- Nunca compartilhe sua API Key publicamente!

---

## 🆘 Erros Comuns

### "Failed to initialize Firebase"
→ Verifique se as credenciais no `.env.local` estão corretas

### "Missing or insufficient permissions"
→ Verifique as regras de segurança do Firestore

### "Cannot read 'db' of undefined"
→ Reinicie o servidor (`npm run dev`)

---

## 📞 Precisa de ajuda?
Abra uma issue no GitHub!
