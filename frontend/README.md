# Erictel Challenge - Frontend

Frontend Vue 3 com TypeScript para o desafio técnico da Erictel.

## 🚀 Tecnologias

- **Vue 3** - Framework JavaScript progressivo
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Roteamento SPA
- **Axios** - Cliente HTTP
- **Vue Toastification** - Notificações toast
- **VueUse** - Utilitários composables

## 📋 Funcionalidades

- ✅ **Autenticação JWT** - Login e registro de usuários
- ✅ **Gerenciamento de Perfil** - Visualizar e editar informações do usuário
- ✅ **Upload de Imagem** - Foto de perfil com validação
- ✅ **Listagem de Criptomoedas** - Visualização com filtros e busca
- ✅ **Detalhes de Criptomoedas** - Modal com informações completas
- ✅ **Dashboard** - Visão geral e ações rápidas
- ✅ **Navegação Responsiva** - Interface adaptável a diferentes telas
- ✅ **Persistência de Sessão** - Manutenção do login entre sessões

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend da API rodando na porta 3001

### Passos

1. **Clone o repositório e navegue para a pasta frontend:**
```bash
cd frontend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Execute o servidor de desenvolvimento:**
```bash
npm run dev
```

4. **Acesse a aplicação:**
```
http://localhost:3000
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Verificação de tipos TypeScript
npm run type-check

# Linting
npm run lint

# Testes unitários e de integração
npm run test

# Testes com watch mode
npm run test:watch

# Testes com cobertura
npm run test:coverage
```

## 🏗️ Estrutura do Projeto

```
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── NavBar.vue      # Barra de navegação
│   │   └── CryptoModal.vue # Modal de detalhes da criptomoeda
│   ├── views/              # Páginas/Views
│   │   ├── LoginView.vue   # Página de login
│   │   ├── RegisterView.vue # Página de registro
│   │   ├── DashboardView.vue # Dashboard principal
│   │   ├── ProfileView.vue # Perfil do usuário
│   │   └── CryptocurrenciesView.vue # Listagem de criptomoedas
│   ├── stores/             # Gerenciamento de estado (Pinia)
│   │   ├── auth.ts         # Store de autenticação
│   │   └── cryptocurrency.ts # Store de criptomoedas
│   ├── services/           # Serviços de API
│   │   ├── api.ts          # Configuração do Axios
│   │   ├── authService.ts  # Serviços de autenticação
│   │   └── cryptoService.ts # Serviços de criptomoedas
│   ├── router/             # Configuração de rotas
│   │   └── index.ts        # Definição das rotas e guards
│   ├── types/              # Definições de tipos TypeScript
│   │   └── index.ts        # Interfaces e tipos
│   ├── App.vue             # Componente raiz
│   ├── main.ts             # Ponto de entrada da aplicação
│   └── env.d.ts            # Declarações de tipos para Vite
├── tests/
│   ├── components/         # Testes de componentes
│   │   ├── LoginView.spec.ts
│   │   ├── NavBar.spec.ts
│   │   └── CryptoModal.spec.ts
│   ├── stores/             # Testes de stores
│   │   ├── auth.spec.ts
│   │   └── cryptocurrency.spec.ts
│   └── unit/               # Testes unitários
│       ├── api.spec.ts
│       ├── authService.spec.ts
│       ├── cryptoService.spec.ts
│       └── router.spec.ts
├── vitest.config.ts        # Configuração do Vitest
```

## 🔧 Configuração

### Proxy da API

O Vite está configurado para fazer proxy das requisições `/api` para `http://localhost:3001`:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false
    }
  }
}
```

### Autenticação

O token JWT é armazenado no `localStorage` e automaticamente incluído nas requisições via interceptor do Axios.

### Roteamento

Rotas protegidas por guards de autenticação:
- `/login` e `/register` - Apenas usuários não autenticados
- `/dashboard`, `/profile`, `/cryptocurrencies` - Apenas usuários autenticados

## 🎨 Design

- **Tema**: Gradiente roxo/azul moderno
- **Layout**: Responsivo com CSS Grid e Flexbox
- **Componentes**: Cards, modais, formulários estilizados
- **UX**: Transições suaves, feedback visual, loading states

## 🔒 Segurança

- Validação de formulários no frontend
- Sanitização de inputs
- Proteção de rotas com guards
- Interceptação de erros 401 (redirecionamento para login)
- Validação de tipos de arquivo para upload

## 📱 Responsividade

Interface adaptada para:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🧪 Desenvolvimento e Testes

### TypeScript

Projeto totalmente tipado com:
- Interfaces para dados da API
- Tipos para props e eventos de componentes
- Configuração strict do TypeScript

### Composables

Uso de Composition API e VueUse para:
- Gerenciamento de estado reativo
- Debounce de busca
- Ciclo de vida de componentes

### Padrões

- **Single File Components** com `<script setup>`
- **Composition API** para lógica reativa
- **Pinia stores** para estado global
- **Axios interceptors** para requisições
- **Vue Router guards** para proteção de rotas

### Testes

- **Vitest** - Framework de testes rápido e compatível com Vite
- **Vue Test Utils** - Biblioteca oficial para testar componentes Vue
- **Happy DOM** - Ambiente DOM para testes
- **Cobertura de código** - Relatórios de cobertura com v8

#### Estratégia de Testes

- **Testes unitários** para serviços, stores e utilitários
- **Testes de componentes** para verificar renderização e interações
- **Testes de integração** para verificar fluxos completos
- **Mocks** para APIs externas e serviços

#### Exemplos de Testes

- Autenticação e gerenciamento de tokens
- Proteção de rotas e redirecionamentos
- Renderização condicional de componentes
- Chamadas de API e tratamento de erros
- Interações de usuário (cliques, formulários)

## 🚀 Deploy

Para build de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/` prontos para deploy em qualquer servidor web estático.

## 🔗 Integração com Backend

O frontend consome as seguintes APIs do backend:

- `POST /api/v1/auth/login` - Autenticação
- `POST /api/v1/auth/register` - Registro
- `GET /api/v1/users/profile` - Perfil do usuário
- `PATCH /api/v1/users/profile` - Atualização do perfil
- `POST /api/v1/users/profile/image` - Upload de imagem
- `GET /api/v1/cryptocurrencies` - Lista de criptomoedas
- `GET /api/v1/cryptocurrencies/top/:limit` - Top criptomoedas
- `GET /api/v1/cryptocurrencies/search` - Busca de criptomoedas

## 📄 Licença

Este projeto foi desenvolvido para o desafio técnico da Erictel.
