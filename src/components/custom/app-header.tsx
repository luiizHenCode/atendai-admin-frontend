import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth/use-auth";
import {
  BarChart3,
  LogOut,
  Menu,
  Server,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";

export function AppHeader() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mockMetrics = {
    activeContainers: 12,
    totalClients: 8,
    systemUptime: "99.9%",
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/clientes", label: "Clientes", icon: Users },
    { path: "/containers", label: "Containers", icon: Server },
    { path: "/metricas", label: "Métricas", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo e Brand */}
          <div className="flex items-center space-x-4">
            {/* Menu Mobile Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      AtendAI Admin
                    </span>
                  </SheetTitle>
                  <SheetDescription>
                    Sistema de gerenciamento de containers
                  </SheetDescription>
                </SheetHeader>

                {/* Menu Mobile Navigation */}
                <nav className="mt-8 flex flex-col space-y-2 px-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      location.pathname === item.path ||
                      (item.path === "/dashboard" && location.pathname === "/");

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={`w-full justify-start gap-3 h-12 ${
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                              : "hover:bg-muted/80"
                          }`}>
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>

                {/* Métricas Mobile */}
                <div className="mt-8 space-y-3 px-4">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Status do Sistema
                  </h4>
                  <div className="space-y-2">
                    <Badge
                      variant="outline"
                      className="w-full justify-start bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {mockMetrics.activeContainers} containers ativos
                    </Badge>
                    <Badge
                      variant="outline"
                      className="w-full justify-start bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300">
                      <Users className="h-4 w-4 mr-2" />
                      {mockMetrics.totalClients} clientes
                    </Badge>
                    <Badge
                      variant="outline"
                      className="w-full justify-start bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      {mockMetrics.systemUptime} uptime
                    </Badge>
                  </div>
                </div>

                {/* User Info Mobile */}
                <div className="mt-8 pt-6 border-t px-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.nome} />
                      <AvatarFallback>
                        {user?.nome?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user?.nome}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut();
                      }}>
                      <LogOut className="h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AtendAI Admin
              </span>
            </Link>

            {/* Navegação principal - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1 ml-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path === "/dashboard" && location.pathname === "/");

                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`flex items-center gap-2 transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "hover:bg-muted/80"
                      }`}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Métricas e Menu do usuário */}
          <div className="flex items-center space-x-4">
            {/* Métricas do sistema - Desktop */}
            <div className="hidden xl:flex items-center space-x-3">
              <Badge
                variant="outline"
                className="bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {mockMetrics.activeContainers} containers
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300">
                {mockMetrics.totalClients} clientes
              </Badge>
              <Badge
                variant="outline"
                className="bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300">
                {mockMetrics.systemUptime} uptime
              </Badge>
            </div>

            {/* Menu do usuário - Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.nome} />
                    <AvatarFallback>
                      {user?.nome?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.nome}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
