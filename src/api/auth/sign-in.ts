import type { User } from "@/types/auth";

export interface SignInProps {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  user: User;
  message: string;
}

export async function signIn(data: SignInProps): Promise<SignInResponse> {
  // Mock da API - simula autenticação
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula delay da API

  // Credenciais demo
  if (data.email === "admin@atendai.com" && data.password === "admin123") {
    const mockUser: User = {
      id: "1",
      nome: "Administrador",
      email: "admin@atendai.com",
      avatar: "https://github.com/shadcn.png",
      role: "admin",
      lastLogin: new Date().toISOString(),
      createdAt: "2024-01-01T00:00:00.000Z",
    };

    const mockResponse: SignInResponse = {
      token: "mock_jwt_token_" + Date.now(),
      user: mockUser,
      message: "Login realizado com sucesso!",
    };

    return mockResponse;
  }

  throw new Error("Credenciais inválidas");
}
