import type { SignInProps } from "@/api/auth/sign-in";
import type { User } from "@/types/auth";
import { createContext } from "react";

interface IAuthContext {
  // Estados
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Ações
  signIn: (data: SignInProps) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext({} as IAuthContext);

export { AuthContext, type IAuthContext };
