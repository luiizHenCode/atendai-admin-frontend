import { signIn as signInAPI, type SignInProps } from "@/api/auth/sign-in";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import type { User } from "@/types/auth";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { AuthContext } from "./auth-context";

interface IAuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: IAuthProviderProps) {
  // 1. Hooks de persistência
  const [token, setToken] = useLocalStorage<string | null>(
    STORAGE_KEYS.AUTH_TOKEN,
    null
  );
  const [userData, setUserData] = useLocalStorage<User | null>(
    STORAGE_KEYS.USER_DATA,
    null
  );

  // 2. Estados locais
  const [isLoading, setIsLoading] = useState(true);

  // 3. Estados computados
  const isAuthenticated = !!token && !!userData;

  // 4. Verificação inicial da autenticação
  useEffect(() => {
    // Simula verificação de token
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 5. Ação de login
  const signIn = useCallback(
    async (data: SignInProps) => {
      try {
        setIsLoading(true);
        const response = await signInAPI(data);

        setToken(response.token);
        setUserData(response.user);

        toast.success(response.message);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro desconhecido";
        toast.error(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setToken, setUserData]
  );

  // 6. Ação de logout
  const signOut = useCallback(() => {
    setToken(null);
    setUserData(null);
    toast.success("Logout realizado com sucesso!");
  }, [setToken, setUserData]);

  // 7. Valor do contexto
  const contextValue = {
    user: userData,
    token,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export { AuthProvider };
