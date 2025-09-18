# Guia de Instalação Mobile - Twin Capture

## 🚀 Como usar nos seus dois aparelhos

### 1. **Transferir projeto para Github**
- Clique no botão "Export to Github" no Lovable
- Faça `git pull` do seu repositório

### 2. **Instalar dependências**
```bash
npm install
```

### 3. **Adicionar plataformas mobile**
```bash
# Para Android
npx cap add android

# Para iOS (apenas no Mac)
npx cap add ios
```

### 4. **Construir e sincronizar**
```bash
# Buildar o projeto
npm run build

# Sincronizar com as plataformas
npx cap sync
```

### 5. **Executar nos dispositivos**
```bash
# Android (requer Android Studio)
npx cap run android

# iOS (requer Mac + Xcode)
npx cap run ios
```

## 📱 Como funciona

### **Dispositivo 1 - CONTROLADOR**
1. Abra o app e vá em "Usar como Controlador"
2. Clique em "Criar Nova Sessão"
3. Compartilhe o código de 6 letras com o outro dispositivo

### **Dispositivo 2 - GRAVADOR**  
1. Abra o app e vá em "Usar como Gravador"
2. Digite o código recebido do controlador
3. Permita o acesso ao microfone quando solicitado

### **Gravação Remota**
- No **Controlador**: Clique "Iniciar" → o gravador inicia automaticamente
- No **Controlador**: Clique "Parar" → o gravador para e envia por email

## ✅ Funcionalidades Implementadas

- ✅ **Pairing automático** com códigos de 6 dígitos
- ✅ **Comunicação em tempo real** via Supabase Realtime
- ✅ **Gravação automática** no dispositivo gravador
- ✅ **Envio por email** automático após gravação
- ✅ **Interface mobile-friendly** com Capacitor
- ✅ **Status em tempo real** entre dispositivos

## 🔧 Requisitos do Sistema

**Android:**
- Android Studio instalado
- SDK Android configurado

**iOS:**
- Mac com Xcode
- Conta de desenvolvedor Apple (para dispositivos físicos)

## 📧 Email de Gravações
As gravações são enviadas automaticamente para: **pedrohcdiniz00@gmail.com**

## 🆘 Solução de Problemas

**Erro de permissão de microfone:**
- Verifique as configurações do app nas configurações do celular
- Permita acesso ao microfone

**Código inválido:**
- Verifique se o código foi digitado corretamente
- Certifique-se que a sessão ainda está ativa

**Problemas de conexão:**
- Verifique a conexão com a internet
- Reinicie o app se necessário