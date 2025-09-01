# 📁 Estrutura de Pastas - Frontend React/TypeScript

## Organização Semântica para Projetos Escaláveis

Esta documentação apresenta uma estrutura de pastas otimizada para projetos React/TypeScript, baseada em separação de responsabilidades e escalabilidade.

---

## 🎯 **Tipagens e Contratos**

```
src/
├── @types/                     # Definições de tipos TypeScript globais
│   ├── auth-types.ts          # Tipos de autenticação (User, Login, Token)
│   ├── api-types.ts           # Tipos de resposta da API (Response, Error)
│   ├── entities/              # Entidades do domínio
│   │   ├── user-type.ts       # Tipos de usuário
│   │   ├── company-type.ts    # Tipos de empresa/organização
│   │   ├── product-type.ts    # Tipos de produtos/serviços
│   │   └── feature-type.ts    # Tipos específicos da funcionalidade
│   └── ui-types.ts            # Tipos de componentes UI (Props, States)
```

**Responsabilidade:** Centralizar todas as definições de tipos e interfaces TypeScript, garantindo consistência e reutilização.

---

## 🌐 **Comunicação Externa**

```
src/
├── api/                        # Camada de comunicação com APIs
│   ├── auth/                   # Endpoints de autenticação
│   │   ├── sign-in.ts         # Login de usuário
│   │   ├── sign-up.ts         # Registro de usuário
│   │   ├── refresh-token.ts   # Renovação de token
│   │   └── forgot-password.ts # Recuperação de senha
│   ├── users/                  # Endpoints de usuários
│   │   ├── get-profile.ts     # Buscar perfil
│   │   ├── update-profile.ts  # Atualizar perfil
│   │   └── delete-account.ts  # Excluir conta
│   ├── companies/             # Endpoints de empresas/organizações
│   │   ├── get-company.ts     # Buscar empresa
│   │   └── update-company.ts  # Atualizar empresa
│   ├── products/              # Endpoints de produtos/serviços
│   └── helpers/               # Utilitários de API
│       ├── api-client.ts      # Cliente HTTP configurado
│       ├── error-handler.ts   # Tratamento de erros
│       └── interceptors.ts    # Interceptadores de requisição
```

**Responsabilidade:** Gerenciar toda comunicação com serviços externos, organizando por contexto funcional.

---

## 🧩 **Componentes Reutilizáveis**

```
src/
├── components/                 # Componentes da interface
│   ├── ui/                     # Componentes base do design system
│   │   ├── button.tsx          # Botões padronizados
│   │   ├── input.tsx           # Campos de entrada
│   │   ├── card.tsx            # Cards/containers
│   │   ├── modal.tsx           # Modais/dialogs
│   │   ├── table.tsx           # Tabelas de dados
│   │   ├── form.tsx            # Componentes de formulário
│   │   ├── navigation.tsx      # Elementos de navegação
│   │   ├── feedback.tsx        # Toast, alerts, loading
│   │   └── layout.tsx          # Componentes de layout base
│   ├── layout/                 # Componentes de layout da aplicação
│   │   ├── header.tsx          # Cabeçalho da aplicação
│   │   ├── sidebar.tsx         # Menu lateral
│   │   ├── footer.tsx          # Rodapé
│   │   ├── page-wrapper.tsx    # Container de página
│   │   └── auth-layout.tsx     # Layout para páginas de autenticação
│   ├── theme/                  # Componentes de tema
│   │   ├── theme-provider.tsx  # Provider de tema
│   │   ├── theme-toggle.tsx    # Alternador de tema
│   │   └── theme-config.ts     # Configurações de tema
│   └── features/               # Componentes específicos do negócio
│       ├── auth/               # Componentes de autenticação
│       │   ├── login-form.tsx  # Formulário de login
│       │   └── register-form.tsx # Formulário de registro
│       ├── dashboard/          # Componentes do dashboard
│       ├── profile/            # Componentes de perfil
│       └── settings/           # Componentes de configurações
```

**Responsabilidade:** Organizar componentes por nível de abstração e reutilização.

---

## 🛡️ **Controle de Estado e Hooks**

```
src/
├── contexts/                   # Contextos React (estado global)
│   ├── auth-context.tsx        # Contexto de autenticação
│   ├── theme-context.tsx       # Contexto de tema (dark/light)
│   ├── app-context.tsx         # Contexto geral da aplicação
│   └── notification-context.tsx # Contexto de notificações
├── hooks/                      # Custom hooks reutilizáveis
│   ├── use-auth.ts            # Hook de autenticação
│   ├── use-api.ts             # Hook para chamadas de API
│   ├── use-form.ts            # Hook para formulários
│   ├── use-local-storage.ts   # Hook para localStorage
│   ├── use-debounce.ts        # Hook de debounce
│   └── use-pagination.ts      # Hook para paginação
```

**Responsabilidade:** Gerenciar estado global e lógica reutilizável entre componentes.

---

## 🗂️ **Recursos Estáticos e Configurações**

```
src/
├── assets/                     # Arquivos estáticos
│   ├── images/                 # Imagens, logos, ícones
│   │   ├── logos/             # Logotipos da aplicação
│   │   ├── icons/             # Ícones customizados
│   │   └── illustrations/     # Ilustrações
│   ├── fonts/                 # Fontes customizadas
│   └── videos/                # Vídeos e animações
├── config/                    # Configurações da aplicação
│   ├── env.ts                 # Variáveis de ambiente
│   ├── constants.ts           # Constantes globais
│   ├── api-config.ts          # Configurações de API
│   └── app-config.ts          # Configurações gerais
```

**Responsabilidade:** Centralizar recursos estáticos e configurações do projeto.

---

## 📄 **Páginas da Aplicação**

```
src/
├── pages/                      # Páginas/telas da aplicação
│   ├── auth/                   # Páginas de autenticação
│   │   ├── sign-in/           # Página de login
│   │   │   ├── sign-in-page.tsx
│   │   │   └── sign-in-form.tsx
│   │   ├── sign-up/           # Página de cadastro
│   │   │   ├── sign-up-page.tsx
│   │   │   └── sign-up-form.tsx
│   │   └── forgot-password/   # Recuperação de senha
│   │       ├── forgot-password-page.tsx
│   │       └── forgot-password-form.tsx
│   ├── app/                    # Páginas internas (autenticadas)
│   │   ├── _layout/           # Layout das páginas internas
│   │   │   └── app-layout.tsx
│   │   ├── dashboard/         # Painel principal
│   │   │   ├── dashboard-page.tsx
│   │   │   └── components/    # Componentes específicos do dashboard
│   │   ├── profile/           # Perfil do usuário
│   │   ├── settings/          # Configurações
│   │   └── [feature]/         # Outras funcionalidades específicas
│   └── public/                # Páginas públicas (não autenticadas)
│       ├── _layout/           # Layout das páginas públicas
│       │   └── public-layout.tsx
│       ├── home/              # Página inicial
│       ├── about/             # Sobre
│       ├── privacy-policy/    # Política de privacidade
│       └── terms-of-use/      # Termos de uso
```

**Responsabilidade:** Organizar páginas por contexto de acesso e funcionalidade.

---

## 🔧 **Utilitários e Serviços**

```
src/
├── utils/                      # Funções utilitárias
│   ├── helpers.ts             # Funções auxiliares gerais
│   ├── formatters.ts          # Formatação de dados (datas, moeda, texto)
│   ├── validators.ts          # Validações customizadas
│   ├── parsers.ts             # Parsers de dados
│   ├── generators.ts          # Geradores (IDs, slugs, etc.)
│   └── transformers.ts        # Transformação de dados
├── services/                  # Serviços externos
│   ├── storage.ts             # Serviço de armazenamento
│   ├── notification.ts        # Serviço de notificações
│   ├── analytics.ts           # Serviço de analytics
│   └── external-apis.ts       # APIs de terceiros
├── lib/                       # Bibliotecas e configurações
│   ├── react-query.ts         # Configuração do React Query
│   ├── router.ts              # Configuração do roteador
│   └── validation.ts          # Schemas de validação (Zod, Yup)
```

**Responsabilidade:** Funcões auxiliares, serviços externos e configurações de bibliotecas.

---

## 🎨 **Estilos e Temas**

```
src/
├── styles/                     # Arquivos de estilo
│   ├── globals.css            # Estilos globais
│   ├── components.css         # Estilos de componentes
│   ├── utilities.css          # Classes utilitárias
│   └── themes/                # Temas da aplicação
│       ├── light-theme.css    # Tema claro
│       └── dark-theme.css     # Tema escuro
```

**Responsabilidade:** Centralizar estilos globais e configurações de tema.

---

## 🚦 **Navegação e Entrada**

```
src/
├── routes.tsx                  # Definição das rotas da aplicação
├── main.tsx                    # Entrada principal da aplicação
├── App.tsx                     # Componente raiz
└── vite-env.d.ts              # Tipagens do ambiente de desenvolvimento
```

**Responsabilidade:** Configuração de rotas e ponto de entrada da aplicação.

---

## 📋 **Resumo por Responsabilidade**

### **1. Dados e Contratos** 
- `@types/` - Definições de tipos e interfaces
- `api/` - Comunicação com serviços externos
- `lib/` - Configurações de bibliotecas

### **2. Interface do Usuário**
- `components/` - Componentes reutilizáveis e específicos
- `styles/` - Estilos e temas
- `assets/` - Recursos estáticos

### **3. Páginas e Navegação**
- `pages/` - Estrutura de páginas da aplicação
- `routes.tsx` - Configuração de rotas

### **4. Estado e Lógica**
- `contexts/` - Estado global
- `hooks/` - Lógica reutilizável
- `services/` - Serviços externos

### **5. Utilitários e Configurações**
- `utils/` - Funções auxiliares
- `config/` - Configurações da aplicação

---

## ✅ **Vantagens desta Estrutura**

- **🔄 Escalabilidade**: Fácil adição de novas funcionalidades
- **🧩 Modularidade**: Componentes e lógica bem separados
- **🔍 Encontrabilidade**: Localização intuitiva de arquivos
- **♻️ Reutilização**: Maximiza o reuso de código
- **🛠️ Manutenibilidade**: Facilita manutenção e refatoração
- **👥 Colaboração**: Estrutura clara para trabalho em equipe

---

## 🚀 **Como Usar**

1. **Copie esta estrutura** para seu novo projeto
2. **Adapte as pastas** conforme suas necessidades específicas
3. **Remova pastas** que não se aplicam ao seu contexto
4. **Adicione novas pastas** seguindo a mesma lógica semântica
5. **Documente mudanças** para manter a consistência da equipe

---

*Esta estrutura é baseada em boas práticas da comunidade React/TypeScript e pode ser adaptada conforme as necessidades específicas do projeto.*
