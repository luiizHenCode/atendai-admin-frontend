import { useAuth } from "@/contexts/auth/use-auth";
import { createBrowserRouter, RouterProvider } from "react-router";

// Layouts
import { AppLayout } from "@/pages/app/_layout/app-layout";

// Páginas de autenticação
import { SignInPage } from "@/pages/auth/sign-in-page";

// Páginas da aplicação
import { ClientDetailPage } from "@/pages/app/clients/client-detail-page";
import { ClientsPage } from "@/pages/app/clients/clients-page";
import ContainersPage from "@/pages/app/containers/containers-page";
import { DashboardPage } from "@/pages/app/dashboard/dashboard-page";
import MetricsPage from "@/pages/app/metrics/metrics-page";

// Guards de rota
import { GuestRoute } from "@/components/route-guards/guest-route";
import { ProtectedRoute } from "@/components/route-guards/protected-route";

export function Routes() {
  const { isAuthenticated } = useAuth();

  const router = createBrowserRouter([
    // Rotas públicas (redirecionam se autenticado)
    {
      path: "/entrar",
      element: (
        <GuestRoute>
          <SignInPage />
        </GuestRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <GuestRoute>
          <SignInPage />
        </GuestRoute>
      ),
    },

    // Rotas protegidas (requerem autenticação)
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "dashboard",
          element: <DashboardPage />,
        },
        {
          path: "clientes",
          element: <ClientsPage />,
        },
        {
          path: "clientes/:clientId",
          element: <ClientDetailPage />,
        },
        {
          path: "containers",
          element: <ContainersPage />,
        },
        {
          path: "metricas",
          element: <MetricsPage />,
        },
      ],
    },

    // Rota padrão - redireciona baseado na autenticação
    {
      path: "*",
      element: isAuthenticated ? <DashboardPage /> : <SignInPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}
