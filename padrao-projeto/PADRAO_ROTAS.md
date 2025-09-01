# 🛣️ Padrão do Sistema de Rotas

## Estrutura de Navegação com React Router

Esta documentação apresenta os padrões utilizados para organizar e configurar o sistema de rotas da aplicação, incluindo autenticação, layouts e navegação aninhada.

---

## 📋 **Stack Tecnológica**

```typescript
// Principais bibliotecas utilizadas
import { createBrowserRouter, redirect, RouterProvider, Outlet, Navigate } from "react-router";
import { useAuth } from "@/contexts/auth/use-auth";
```

---

## 🏗️ **Estrutura Geral do Sistema de Rotas**

### **Arquitetura da Aplicação**

```
📁 Aplicação
├── 🌐 Rotas Públicas (sem autenticação)
│   ├── /entrar                    # Login
│   ├── /login                     # Alias para login
│   ├── /criar-conta               # Registro
│   ├── /recuperar-senha           # Recuperação de senha
│   ├── /politica-de-privacidade   # Política de privacidade
│   └── /termos-de-uso             # Termos de uso
└── 🔒 Rotas Protegidas (com autenticação)
    ├── /                          # Raiz da aplicação (redirect)
    ├── /minhas-filiais            # Listagem de filiais
    │   ├── /:branchId             # Detalhes da filial
    │   │   └── /:tab/:voucherId   # Navegação interna
    │   └── /criar-nova-filial     # Criar nova filial
    ├── /modelos                   # Templates
    │   ├── /:templateId           # Detalhes do template
    │   └── /criar-modelo          # Criar template
    ├── /configuracoes             # Configurações
    │   ├── /perfil                # Perfil da empresa
    │   └── /clientes              # Gestão de clientes
    ├── /resgatar-cupom            # Resgate de cupons
    └── /meu-perfil                # Perfil do usuário
```

---

## 🔧 **Implementação do Sistema de Rotas**

### **1. Estrutura Principal**

```typescript
// routes.tsx
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import { useAuth } from "./contexts/auth/use-auth";

export function Routes() {
  const { isAuthenticated } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <div>Página não encontrada</div>,
      children: [
        // Rotas públicas
        ...publicRoutes(isAuthenticated),
        
        // Rotas protegidas
        {
          path: "/",
          Component: AppLayout,
          loader: () => {
            if (!isAuthenticated) {
              return redirect("/login");
            }
            return null;
          },
          children: protectedRoutes,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
```

### **2. Rotas Públicas (Sem Autenticação)**

```typescript
// Rotas que redirecionam usuários logados
const publicRoutes = (isAuthenticated: boolean) => [
  {
    path: "entrar",
    loader: () => {
      if (isAuthenticated) {
        return redirect("/minhas-filiais");
      }
      return null;
    },
    Component: SignInPage,
  },
  {
    path: "login", // Alias para entrada
    loader: () => {
      if (isAuthenticated) {
        return redirect("/minhas-filiais");
      }
      return null;
    },
    Component: SignInPage,
  },
  {
    path: "criar-conta",
    loader: () => {
      if (isAuthenticated) {
        return redirect("/minhas-filiais");
      }
      return null;
    },
    Component: SignUpPage,
  },
  {
    path: "recuperar-senha",
    loader: () => {
      if (isAuthenticated) {
        return redirect("/minhas-filiais");
      }
      return null;
    },
    Component: ForgotPasswordPage,
  },
  // Rotas sempre acessíveis
  {
    path: "politica-de-privacidade",
    Component: PrivacyPolicyPage,
  },
  {
    path: "termos-de-uso",
    Component: TermsOfUsePage,
  },
];
```

### **3. Rotas Protegidas (Com Autenticação)**

```typescript
const protectedRoutes = [
  {
    index: true, // Rota raiz "/"
    loader: () => redirect("/minhas-filiais"), // Redirect padrão
  },
  {
    path: "minhas-filiais",
    children: [
      {
        index: true, // Lista de filiais
        Component: BranchesPage,
      },
      {
        path: ":branchId", // Detalhes da filial
        loader: async ({ params }) => {
          if (!params.branchId) {
            return redirect("/minhas-filiais");
          }
          return null;
        },
        children: [
          {
            index: true,
            Component: BranchPage,
          },
          {
            path: ":tab", // Abas dentro da filial
            children: [
              {
                index: true,
                Component: BranchPage,
              },
              {
                path: ":voucherId", // Item específico
                element: <BranchPage />,
              },
            ],
          },
        ],
      },
      {
        path: "criar-nova-filial",
        Component: CreateBranchPage,
      },
    ],
  },
  {
    path: "modelos",
    children: [
      {
        index: true,
        Component: TemplatesPage,
      },
      {
        path: ":templateId",
        loader: async ({ params }) => {
          if (!params.templateId) {
            return redirect("/modelos");
          }
          return null;
        },
        Component: TemplatePage,
      },
      {
        path: "criar-modelo",
        Component: CreateTemplatePage,
      },
    ],
  },
  {
    path: "configuracoes",
    children: [
      {
        index: true,
        Component: SettingsPage,
      },
      {
        path: "perfil",
        Component: SettingsProfilePage,
      },
      {
        path: "clientes",
        Component: CustomersPage,
      },
    ],
  },
];
```

---

## 🎨 **Layouts da Aplicação**

### **1. Layout da Aplicação Autenticada**

```typescript
// pages/app/_layout/app-layout.tsx
import { SidebarMenu } from "@/components/custom/sidebar-menu";
import { Outlet } from "react-router";

export function AppLayout() {
  return (
    <div className="w-full min-h-svh flex-col pt-18">
      <SidebarMenu />
      <div className="w-full flex flex-col min-h-[calc(100svh-72px)] px-4 items-center">
        <Outlet />
      </div>
    </div>
  );
}
```

### **2. Layout Público**

```typescript
// pages/public/_layout/public-layout.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header público */}
      <div className="w-full h-16 backdrop-blur-xl flex justify-center border-b px-4 fixed top-0 z-10 bg-background/80">
        <div className="w-full max-w-6xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={LogoIcon} className="size-8" alt="Logo" />
            <span className="font-semibold">Ganhe Ofertas</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link to="/entrar">Entrar</Link>
            </Button>
            <Button asChild>
              <Link to="/criar-conta">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto p-6">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-16">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 Ganhe Ofertas. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <Link 
                to="/politica-de-privacidade"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Política de Privacidade
              </Link>
              <Link 
                to="/termos-de-uso"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔐 **Proteção de Rotas**

### **1. Guards de Autenticação**

```typescript
// utils/route-guards.ts
import { redirect } from "react-router";

export function requireAuth(isAuthenticated: boolean) {
  return () => {
    if (!isAuthenticated) {
      return redirect("/entrar");
    }
    return null;
  };
}

export function requireGuest(isAuthenticated: boolean) {
  return () => {
    if (isAuthenticated) {
      return redirect("/minhas-filiais");
    }
    return null;
  };
}

export function requireParams(paramNames: string[]) {
  return ({ params }: { params: Record<string, string> }) => {
    for (const paramName of paramNames) {
      if (!params[paramName]) {
        return redirect("/"); // ou rota de fallback apropriada
      }
    }
    return null;
  };
}
```

### **2. Componente de Proteção**

```typescript
// components/route-guards/protected-route.tsx
import { useAuth } from "@/contexts/auth/use-auth";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: string;
}

export function ProtectedRoute({ 
  children, 
  fallback = "/entrar" 
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
```

### **3. Componente para Usuários Visitantes**

```typescript
// components/route-guards/guest-route.tsx
import { useAuth } from "@/contexts/auth/use-auth";
import { Navigate } from "react-router";

interface GuestRouteProps {
  children: React.ReactNode;
  fallback?: string;
}

export function GuestRoute({ 
  children, 
  fallback = "/minhas-filiais" 
}: GuestRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
```

---

## 🧭 **Navegação Programática**

### **1. Hook de Navegação**

```typescript
// hooks/use-navigation.ts
import { useNavigate, useLocation } from "react-router";
import { useCallback } from "react";

export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = useCallback((path: string, options?: { replace?: boolean }) => {
    navigate(path, options);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goHome = useCallback(() => {
    navigate("/minhas-filiais");
  }, [navigate]);

  const isCurrentPath = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  const isChildPath = useCallback((parentPath: string) => {
    return location.pathname.startsWith(parentPath);
  }, [location.pathname]);

  return {
    goTo,
    goBack,
    goHome,
    isCurrentPath,
    isChildPath,
    currentPath: location.pathname,
  };
}
```

### **2. Navegação com Estado**

```typescript
// utils/navigation-helpers.ts
import { NavigateOptions } from "react-router";

export function navigateWithState(
  navigate: (to: string, options?: NavigateOptions) => void,
  to: string,
  state?: any
) {
  navigate(to, { state });
}

export function navigateWithReplace(
  navigate: (to: string, options?: NavigateOptions) => void,
  to: string
) {
  navigate(to, { replace: true });
}

export function navigateWithQuery(
  navigate: (to: string, options?: NavigateOptions) => void,
  to: string,
  params: Record<string, string>
) {
  const searchParams = new URLSearchParams(params);
  navigate(`${to}?${searchParams.toString()}`);
}
```

---

## 🎯 **Padrões de URL e Parâmetros**

### **1. Estrutura de URLs**

```
✅ Boas Práticas:
/minhas-filiais                    # Lista de recursos
/minhas-filiais/123                # Recurso específico
/minhas-filiais/123/cupons         # Sub-recursos
/minhas-filiais/123/cupons/456     # Sub-recurso específico
/minhas-filiais/criar-nova-filial  # Ação de criação

❌ Evitar:
/branch                            # Nomes em inglês
/minhas-filiais/edit/123          # Verbos desnecessários
/minhasFiliais                    # CamelCase em URLs
```

### **2. Parâmetros de Rota**

```typescript
// Acessando parâmetros
import { useParams } from "react-router";

export function BranchPage() {
  const { branchId, tab, voucherId } = useParams<{
    branchId: string;
    tab?: string;
    voucherId?: string;
  }>();

  return (
    <div>
      <h1>Filial: {branchId}</h1>
      {tab && <p>Aba: {tab}</p>}
      {voucherId && <p>Cupom: {voucherId}</p>}
    </div>
  );
}
```

### **3. Query Parameters**

```typescript
// hooks/use-query-params.ts
import { useSearchParams } from "react-router";
import { useCallback } from "react";

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback((key: string) => {
    return searchParams.get(key);
  }, [searchParams]);

  const setParam = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const removeParam = useCallback((key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const getAllParams = useCallback(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  return {
    getParam,
    setParam,
    removeParam,
    getAllParams,
  };
}
```

---

## 📁 **Organização de Arquivos de Rotas**

### **Estrutura Recomendada**

```
src/
├── routes/
│   ├── index.tsx              # Configuração principal
│   ├── public-routes.tsx      # Rotas públicas
│   ├── protected-routes.tsx   # Rotas protegidas
│   └── route-guards.tsx       # Guards de proteção
├── pages/
│   ├── auth/                  # Páginas de autenticação
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── forgot-password/
│   ├── app/                   # Páginas da aplicação
│   │   ├── _layout/           # Layout da aplicação
│   │   ├── branches/
│   │   ├── templates/
│   │   └── settings/
│   └── public/                # Páginas públicas
│       ├── _layout/           # Layout público
│       ├── privacy-policy/
│       └── terms-of-use/
└── hooks/
    ├── use-navigation.ts      # Hook de navegação
    └── use-query-params.ts    # Hook de query params
```

### **Arquivo Principal de Rotas**

```typescript
// routes/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import { useAuth } from "@/contexts/auth/use-auth";
import { publicRoutes } from "./public-routes";
import { protectedRoutes } from "./protected-routes";
import { AppLayout } from "@/pages/app/_layout/app-layout";

export function Routes() {
  const { isAuthenticated } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <NotFoundPage />,
      children: [
        ...publicRoutes(isAuthenticated),
        {
          path: "/",
          Component: AppLayout,
          loader: requireAuth(isAuthenticated),
          children: protectedRoutes,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
```

---

## 🔄 **Loading e Error States**

### **1. Loading de Rotas**

```typescript
// components/route-loading.tsx
export function RouteLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

// Usando em rotas
{
  path: "data",
  lazy: async () => {
    const { DataPage } = await import("./data-page");
    return { Component: DataPage };
  },
  HydrateFallback: RouteLoading,
}
```

### **2. Error Boundaries**

```typescript
// components/route-error-boundary.tsx
import { useRouteError, isRouteErrorResponse } from "react-router";

export function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">
          {error.status} {error.statusText}
        </h1>
        <p className="text-muted-foreground">
          {error.data?.message || "Algo deu errado"}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold mb-4">Erro inesperado</h1>
      <p className="text-muted-foreground">
        Algo deu errado. Tente novamente.
      </p>
    </div>
  );
}
```

---

## ✅ **Checklist de Implementação**

### **Para Estrutura de Rotas**
- [ ] Rotas organizadas por contexto (auth, app, public)
- [ ] Layouts apropriados para cada seção
- [ ] Guards de autenticação implementados
- [ ] Redirects configurados corretamente
- [ ] Error boundaries definidos

### **Para URLs e Navegação**
- [ ] URLs semânticas e em português
- [ ] Parâmetros de rota tipados
- [ ] Query parameters quando necessário
- [ ] Navegação programática implementada
- [ ] Breadcrumbs para rotas aninhadas

### **Para Performance**
- [ ] Lazy loading para rotas pesadas
- [ ] Loading states definidos
- [ ] Code splitting por rota
- [ ] Prefetch de rotas críticas

### **Para UX**
- [ ] Página 404 personalizada
- [ ] Loading states durante navegação
- [ ] Feedback visual de rota ativa
- [ ] Preservação de estado quando necessário

---

## 🎯 **Exemplo Completo - Sistema de Rotas Modular**

```typescript
// routes/app-routes.tsx
import { lazy } from "react";
import { RouteObject } from "react-router";
import { AppLayout } from "@/pages/app/_layout/app-layout";
import { requireAuth } from "./route-guards";

// Lazy loading de páginas
const BranchesPage = lazy(() => import("@/pages/app/branches/branches-page"));
const BranchPage = lazy(() => import("@/pages/app/branch/branch-page"));
const SettingsPage = lazy(() => import("@/pages/app/settings/settings-page"));

export function createAppRoutes(isAuthenticated: boolean): RouteObject {
  return {
    path: "/",
    Component: AppLayout,
    loader: requireAuth(isAuthenticated),
    children: [
      {
        index: true,
        loader: () => redirect("/minhas-filiais"),
      },
      {
        path: "minhas-filiais",
        children: [
          {
            index: true,
            Component: BranchesPage,
          },
          {
            path: ":branchId",
            Component: BranchPage,
            loader: ({ params }) => {
              if (!params.branchId) {
                return redirect("/minhas-filiais");
              }
              return null;
            },
          },
        ],
      },
      {
        path: "configuracoes",
        Component: SettingsPage,
      },
    ],
  };
}
```

```typescript
// routes/public-routes.tsx
import { RouteObject } from "react-router";
import { requireGuest } from "./route-guards";
import { SignInPage } from "@/pages/auth/sign-in/sign-in-page";
import { PrivacyPolicyPage } from "@/pages/privacy-policy/privacy-policy-page";

export function createPublicRoutes(isAuthenticated: boolean): RouteObject[] {
  return [
    {
      path: "entrar",
      Component: SignInPage,
      loader: requireGuest(isAuthenticated),
    },
    {
      path: "politica-de-privacidade",
      Component: PrivacyPolicyPage,
    },
  ];
}
```

```typescript
// routes/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import { useAuth } from "@/contexts/auth/use-auth";
import { createAppRoutes } from "./app-routes";
import { createPublicRoutes } from "./public-routes";
import { RouteErrorBoundary } from "@/components/route-error-boundary";

export function Routes() {
  const { isAuthenticated } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <RouteErrorBoundary />,
      children: [
        ...createPublicRoutes(isAuthenticated),
        createAppRoutes(isAuthenticated),
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
```

---

*Esta documentação estabelece padrões consistentes para o sistema de rotas, garantindo navegação segura, performance otimizada e experiência do usuário fluida.*
