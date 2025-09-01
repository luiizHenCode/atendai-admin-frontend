import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Client } from "@/types/client";
import {
  Activity,
  Calendar,
  ExternalLink,
  Globe,
  MoreHorizontal,
  Pause,
  Play,
  Server,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router";

interface ClientCardProps {
  client: Client;
  onStatusChange?: (clientId: string, status: Client["status"]) => void;
  onDelete?: (clientId: string) => void;
}

export function ClientCard({
  client,
  onStatusChange,
  onDelete,
}: ClientCardProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-500";
      case "inactive":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "pending":
        return "Pendente";
      default:
        return "Desconhecido";
    }
  };

  const containerCount = client.containers?.length || 0;
  const activeContainers =
    client.containers?.filter((c) => c.status === "running").length || 0;

  const handleViewDetails = () => {
    navigate(`/clientes/${client.id}`);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Server className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                  {client.nome}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Globe className="h-4 w-4" />
                  {client.dominio || client.slug}
                </CardDescription>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`${getStatusColor(
                client.status
              )} text-white border-0 shadow-sm`}>
              {getStatusText(client.status)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {client.status === "active" ? (
                  <DropdownMenuItem
                    onClick={() => onStatusChange?.(client.id, "inactive")}>
                    <Pause className="mr-2 h-4 w-4" />
                    Desativar
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onStatusChange?.(client.id, "active")}>
                    <Play className="mr-2 h-4 w-4" />
                    Ativar
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(client.id)}
                  className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent onClick={handleViewDetails}>
        <div className="space-y-4">
          {/* Estatísticas dos Containers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-blue-500 rounded">
                  <Server className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Containers
                </span>
              </div>
              <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {containerCount}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                {activeContainers} ativos
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-emerald-500 rounded">
                  <Activity className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  Status
                </span>
              </div>
              <div className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                {client.status === "active" ? "100%" : "0%"}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">
                Disponibilidade
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Slug:</span>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono">
                {client.slug}
              </code>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                Criado em{" "}
                {new Date(client.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={handleViewDetails}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0">
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver Detalhes
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <TrendingUp className="h-4 w-4" />
              Métricas
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
