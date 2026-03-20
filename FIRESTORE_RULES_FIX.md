## 🔐 Atualizar Regras de Segurança do Firestore

Siga estes passos para corrigir o erro de permissão:

### **1. Acesse as Regras**

Vá para: https://console.firebase.google.com/project/opinarew/firestore/rules

### **2. Copie e Cole Este Código**

Delete tudo e cole:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Opiniões - qualquer um pode ler, criar, editar e deletar
    match /opinioes/{document=**} {
      allow read, create, update, delete;
    }
  }
}
```

### **3. Clique em "Publicar"**

Aguarde a confirmação "Publicado com sucesso"

### **4. Redeploy no Vercel**

1. Acesse: https://vercel.com/dashboard
2. Projeto opinarew
3. Deployments → Redeploy o último
4. Aguarde 2-3 minutos

### **5. Pronto!**

Agora o admin consegue categorizar opiniões sem erro! ✅
