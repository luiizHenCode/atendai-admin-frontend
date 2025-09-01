import { AuthProvider } from "@/contexts/auth/auth-provider";
import { ThemeProvider } from "@/contexts/theme/theme-provider";
import { Routes } from "@/routes";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <Routes />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
