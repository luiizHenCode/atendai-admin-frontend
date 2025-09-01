# AtendAI Admin - Gerenciador de Containers por Cliente

## 🌟 Visão Geral

Esta aplicação é um sistema completo de gerenciamento de containers Docker focado em clientes, onde cada cliente possui seus próprios containers de frontend e backend. A aplicação foi desenvolvida com React, TypeScript, Vite, Tailwind CSS e shadcn/ui, com **tema escuro por padrão** e **sistema de autenticação**.

## ✨ Novas Funcionalidades

### 🔒 Sistema de Autenticação
- **Login Seguro**: Tela de login com validação completa
- **Credenciais Demo**: admin@atendai.com / admin123  
- **Persistência de Sessão**: Mantém usuário logado entre sessões
- **Logout Seguro**: Remoção completa da sessão

### � Tema Escuro Padrão
- **Dark Mode Nativo**: Aplicação inicia sempre em tema escuro
- **Interface Moderna**: Cores otimizadas para baixa fadiga visual
- **Contraste Ideal**: Legibilidade aprimorada em qualquer hora do dia

### 👤 Perfil de Usuário
- **Header Interativo**: Avatar e informações do usuário
- **Menu Dropdown**: Acesso rápido às configurações
- **Status de Sistema**: Métricas visíveis no header
- **Último Acesso**: Rastreamento de atividade

## 🚀 Funcionalidades Principais

### 🏢 Gerenciamento de Clientes
- **Criação Automatizada**: Containers frontend + backend criados automaticamente
- **Slug Inteligente**: Geração automática baseada no nome
- **Domínio Personalizado**: Configuração opcional por cliente
- **Controle de Status**: Ativar/desativar clientes facilmente

### 🐳 Gerenciamento de Containers
- **Containers Dedicados**: Cada cliente tem seus próprios containers
- **Múltiplas Tecnologias**: Nginx, Node.js, Python, Java, Go
- **Controle Granular**: Start, stop, restart, delete individual
- **Health Monitoring**: Monitoramento de saúde em tempo real

### 📊 Dashboard e Métricas
- **Tempo Real**: Atualizações automáticas de métricas
- **Gráficos Interativos**: Histórico visual de performance
- **Alertas Visuais**: Indicadores coloridos de status
- **Métricas Detalhadas**: CPU, memória, rede, uptime

## 🔐 Como Acessar

### Credenciais de Login
```
Email: admin@atendai.com
Senha: admin123
```

### Primeira Utilização
1. Acesse a aplicação no navegador
2. Será redirecionado para a tela de login
3. Digite as credenciais acima
4. Clique em "Entrar"
5. Será redirecionado para o dashboard principal

## 🎨 Interface

### Tela de Login
- ✅ Campo de email com validação
- ✅ Campo de senha com toggle de visibilidade  
- ✅ Validação de formulário em tempo real
- ✅ Mensagens de erro claras
- ✅ Loading state durante autenticação
- ✅ Credenciais demo visíveis

### Dashboard Principal
- ✅ Header com avatar e menu do usuário
- ✅ Métricas em tempo real no header
- ✅ 4 abas principais: Dashboard, Clientes, Containers, Métricas
- ✅ Cards responsivos para clientes e containers
- ✅ Gráficos interativos de sistema

## 📱 Responsividade

- ✅ **Mobile First**: Design otimizado para celular
- ✅ **Tablet Friendly**: Layout adaptado para tablets  
- ✅ **Desktop Enhanced**: Recursos completos em desktop
- ✅ **Menu Adaptativo**: Header se ajusta ao tamanho da tela

## 🔧 Tecnologias Utilizadas

- **React 19** - Framework UI moderno
- **TypeScript** - Tipagem estática completa
- **Vite** - Build tool ultra-rápido
- **React Router** - Roteamento e navegação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Tailwind CSS** - Styling utilitário
- **shadcn/ui** - Componentes de alta qualidade
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones consistentes
- **Sonner** - Notificações elegantes
- **usehooks-ts** - Hooks utilitários

## 🚀 Executar a Aplicação

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Visualizar build
pnpm preview
```

## 📦 Estrutura Atualizada

```
src/
├── api/                       # Camada de comunicação com APIs
│   ├── auth/                  # Endpoints de autenticação
│   ├── clients/               # Endpoints de clientes
│   ├── containers/            # Endpoints de containers
│   └── helpers/               # Utilitários e endpoints auxiliares
├── components/
│   ├── ui/                    # Componentes shadcn/ui
│   ├── custom/                # Componentes customizados
│   │   ├── app-header.tsx     # Header com perfil do usuário
│   │   ├── client-card.tsx    # Card de cliente
│   │   ├── container-card.tsx # Card de container
│   │   ├── create-client-dialog.tsx # Dialog para criar cliente
│   │   ├── loading-screen.tsx # Tela de carregamento
│   │   ├── login-form.tsx     # Formulário de login
│   │   └── system-metrics.tsx # Métricas do sistema
│   └── route-guards/          # Componentes de proteção de rotas
├── contexts/                  # Contextos React
│   ├── auth/                  # Contexto de autenticação
│   └── theme/                 # Contexto de tema
├── hooks/                     # Hooks customizados
│   ├── use-auth.ts           # Hook de autenticação
│   ├── use-clients.ts        # Gerenciamento de clientes
│   ├── use-containers.ts     # Gerenciamento de containers
│   └── masks/                 # Hooks de máscaras
├── pages/                     # Páginas da aplicação
│   ├── auth/                  # Páginas de autenticação
│   ├── app/                   # Páginas da aplicação
│   │   ├── _layout/           # Layout da aplicação
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── clients/           # Gestão de clientes
│   │   ├── containers/        # Gestão de containers
│   │   └── metrics/           # Métricas e relatórios
│   └── public/                # Páginas públicas
├── routes/                    # Sistema de rotas
│   ├── index.tsx              # Configuração principal
│   ├── public-routes.tsx      # Rotas públicas
│   └── protected-routes.tsx   # Rotas protegidas
├── types/                     # Tipos TypeScript
│   ├── auth.ts               # Tipos de autenticação
│   ├── client.ts             # Tipos de clientes
│   └── container.ts          # Tipos de containers
├── utils/                     # Utilitários
│   ├── get-api.ts            # Configuração de API
│   ├── clear-string.ts       # Limpeza de strings
│   └── route-guards.ts       # Guards de rotas
├── constants/                 # Constantes da aplicação
│   └── storage-keys.ts       # Chaves do localStorage
└── App.tsx                   # Componente principal
```

## 🔄 Fluxo de Autenticação

1. **Verificação Inicial**: App verifica token no localStorage
2. **Loading Screen**: Exibe enquanto verifica autenticação
3. **Login Form**: Se não autenticado, mostra formulário com React Hook Form + Zod
4. **Validação**: Credenciais são validadas via API (mock)
5. **Token Storage**: Token salvo no localStorage usando usehooks-ts
6. **Router Redirect**: React Router redireciona para dashboard
7. **Session Persistence**: Sessão mantida entre recarregamentos
8. **Route Guards**: Proteção automática de rotas via contexto de autenticação

## 📊 Métricas Monitoradas

### Sistema Global
- ✅ Total de containers ativos/inativos
- ✅ Número de clientes ativos
- ✅ Uso médio de CPU do sistema
- ✅ Consumo total de memória RAM
- ✅ Tráfego de rede agregado
- ✅ Tempo de resposta médio
- ✅ Uptime do sistema (%)

### Por Container
- ✅ Status (running/stopped/error/pending)
- ✅ Health check (healthy/unhealthy/unknown)
- ✅ Uso individual de CPU (%)
- ✅ Consumo de memória (MB/GB)
- ✅ Contagem de restarts
- ✅ Data de criação e última atualização

## 🎯 Próximas Implementações

### Segurança
- [ ] Autenticação JWT real com refresh tokens
- [ ] Diferentes níveis de permissão (admin/operator)
- [ ] Audit logs de todas as ações
- [ ] Rate limiting para APIs

### Docker Integration
- [ ] Integração real com Docker API
- [ ] Logs em tempo real dos containers
- [ ] Terminal web para acesso direto
- [ ] Deploy automático via Git

### Funcionalidades Avançadas
- [ ] Notificações push para alertas
- [ ] Backup automático de containers
- [ ] Scaling automático baseado em métricas
- [ ] Templates de containers personalizados

## 🐛 Troubleshooting

### Problemas Comuns

**Login não funciona**
- Verifique se está usando: admin@atendai.com / admin123
- Limpe o localStorage: `localStorage.clear()`

**Tema não está escuro**
- O tema escuro é aplicado automaticamente
- Verifique se não há override no CSS

**Aplicação não carrega**
- Confirme se está em http://localhost:5174
- Verifique o console para erros

## 📄 Licença

© 2024 AtendAI Admin. Sistema desenvolvido para demonstração de gerenciamento de containers Docker com autenticação e tema escuro.
