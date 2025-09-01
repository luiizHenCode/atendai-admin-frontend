import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Eye, EyeOff, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/contexts/auth/use-auth";

const signInSchema = z.object({
  email: z.string().email("O e-mail deve ser válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type SignInFormType = z.infer<typeof signInSchema>;

export function LoginForm() {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "admin@atendai.com",
      password: "admin123",
    },
  });

  const onSubmit = async (data: SignInFormType) => {
    try {
      setIsLoading(true);
      await signIn(data);
    } catch (error) {
      // Erro já tratado no contexto
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-20 animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full opacity-10 animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-2xl">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AtendAI Admin</h1>
          <p className="text-purple-200">Plataforma de Gestão Inteligente</p>
        </div>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-white">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="text-purple-200">
              Acesse sua conta para continuar
            </CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-100">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-300">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-purple-100">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400 pr-10"
                    {...form.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-white/10 text-purple-300 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-300">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-400 mb-1">
                      Credenciais de Demonstração
                    </p>
                    <p className="text-xs text-purple-200">
                      Email: admin@atendai.com
                      <br />
                      Senha: admin123
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Entrar na Plataforma</span>
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-purple-200">
            <Bot className="w-6 h-6 mx-auto mb-1 text-purple-400" />
            <p className="text-xs">IA Integrada</p>
          </div>
          <div className="text-purple-200">
            <Shield className="w-6 h-6 mx-auto mb-1 text-purple-400" />
            <p className="text-xs">Seguro</p>
          </div>
          <div className="text-purple-200">
            <Zap className="w-6 h-6 mx-auto mb-1 text-purple-400" />
            <p className="text-xs">Rápido</p>
          </div>
        </div>
      </div>
    </div>
  );
}
