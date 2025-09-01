import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Container } from "@/types/container";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  ExternalLink,
  FileText,
  HelpCircle,
  MemoryStick,
  MoreVertical,
  Network,
  Play,
  RotateCcw,
  Server,
  Square,
  Trash2,
  XCircle,
} from "lucide-react";

interface ContainerCardProps {
  container: Container;
  onAction: (
    action: "start" | "stop" | "restart" | "delete",
    containerId: string
  ) => void;
  onViewLogs: (containerId: string) => void;
  onViewStats: (containerId: string) => void;
  isActionLoading?: boolean;
}

export const ContainerCard = ({
  container,
  onAction,
  onViewLogs,
  onViewStats,
  isActionLoading = false,
}: ContainerCardProps) => {
  // Formatadores
  const formatUptime = (seconds: number) => {
    if (seconds === 0) return "Não está executando";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatMemory = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  // Status visual helpers
  const getStatusColor = (status: Container["status"]) => {
    switch (status) {
      case "running":
        return "bg-emerald-500";
      case "stopped":
        return "bg-slate-500";
      case "error":
        return "bg-red-500";
      case "pending":
        return "bg-amber-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStatusVariant = (status: Container["status"]) => {
    switch (status) {
      case "running":
        return "default";
      case "stopped":
        return "secondary";
      case "error":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getCardGradient = () => {
    // Sempre usa o mesmo visual do "stopped" para todos os cards
    return "bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-950 border-slate-200 dark:border-slate-800";
  };

  const getHealthIcon = (health: Container["health"]) => {
    switch (health) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "unhealthy":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "unknown":
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card
      className={`relative shadow-lg hover:shadow-xl transition-all duration-300 ${getCardGradient()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div
                className={`p-1.5 rounded-lg ${
                  container.status === "running"
                    ? "bg-emerald-500"
                    : container.status === "error"
                    ? "bg-red-500"
                    : container.status === "pending"
                    ? "bg-amber-500"
                    : "bg-slate-500"
                }`}>
                <Server className="h-4 w-4 text-white" />
              </div>
              <span
                className={
                  container.status === "running"
                    ? "text-emerald-900 dark:text-emerald-100"
                    : container.status === "error"
                    ? "text-red-900 dark:text-red-100"
                    : container.status === "pending"
                    ? "text-amber-900 dark:text-amber-100"
                    : "text-slate-900 dark:text-slate-100"
                }>
                {container.name}
              </span>
            </CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <span
                className={
                  container.status === "running"
                    ? "text-emerald-700 dark:text-emerald-300"
                    : container.status === "error"
                    ? "text-red-700 dark:text-red-300"
                    : container.status === "pending"
                    ? "text-amber-700 dark:text-amber-300"
                    : "text-slate-700 dark:text-slate-300"
                }>
                {container.clientName}
              </span>
              <Separator orientation="vertical" className="h-4" />
              <Badge
                variant="outline"
                className={
                  container.status === "running"
                    ? "border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
                    : container.status === "error"
                    ? "border-red-300 text-red-700 dark:border-red-700 dark:text-red-300"
                    : container.status === "pending"
                    ? "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300"
                    : "border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300"
                }>
                {container.type}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status indicator */}
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  container.status
                )}`}
              />
              <Badge variant={getStatusVariant(container.status)}>
                {container.status}
              </Badge>
            </div>

            {/* Actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isActionLoading}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewStats(container.id)}>
                  <Activity className="mr-2 h-4 w-4" />
                  Ver Estatísticas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewLogs(container.id)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Logs
                </DropdownMenuItem>
                {container.domain && (
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(`https://${container.domain}`, "_blank")
                    }>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir Site
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {container.status !== "running" ? (
                  <DropdownMenuItem
                    onClick={() => onAction("start", container.id)}
                    disabled={isActionLoading}>
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onAction("stop", container.id)}
                    disabled={isActionLoading}>
                    <Square className="mr-2 h-4 w-4" />
                    Parar
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onAction("restart", container.id)}
                  disabled={isActionLoading || container.status === "stopped"}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reiniciar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onAction("delete", container.id)}
                  disabled={isActionLoading}
                  className="text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Health Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getHealthIcon(container.health)}
            <span className="text-sm font-medium">
              {container.health === "healthy"
                ? "Saudável"
                : container.health === "unhealthy"
                ? "Com problemas"
                : "Status desconhecido"}
            </span>
          </div>
          {container.restarts > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <AlertTriangle className="h-3 w-3" />
              {container.restarts} restart{container.restarts > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Container Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">Imagem</div>
            <div className="font-mono text-xs">
              {container.image}:{container.tag}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Porta</div>
            <div className="font-mono">
              {container.port} → {container.internalPort}
            </div>
          </div>
        </div>

        {/* Metrics - Only show if running */}
        {container.status === "running" && (
          <div className="space-y-3">
            <Separator />

            {/* CPU Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded">
                    <Cpu className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">CPU</span>
                </div>
                <span className="font-mono font-semibold text-blue-700 dark:text-blue-300">
                  {container.cpu.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={container.cpu}
                className="h-2 bg-blue-100 dark:bg-blue-900"
              />
            </div>

            {/* Memory Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-purple-100 dark:bg-purple-900 rounded">
                    <MemoryStick className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium">Memória</span>
                </div>
                <span className="font-mono font-semibold text-purple-700 dark:text-purple-300">
                  {formatMemory(container.memory)}
                </span>
              </div>
              <div className="w-full bg-purple-100 dark:bg-purple-900 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((container.memory / 2048) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Network */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-emerald-100 dark:bg-emerald-900 rounded">
                  <Network className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="font-medium">Rede</span>
              </div>
              <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                {container.network.toFixed(1)} MB/s
              </span>
            </div>

            {/* Uptime */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-amber-100 dark:bg-amber-900 rounded">
                  <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="font-medium">Uptime</span>
              </div>
              <span className="font-semibold text-amber-700 dark:text-amber-300">
                {formatUptime(container.uptime)}
              </span>
            </div>
          </div>
        )}

        {/* Domain */}
        {container.domain && (
          <>
            <Separator />
            <div className="text-sm">
              <div className="text-muted-foreground mb-1">Domínio</div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 bg-muted rounded text-xs">
                  {container.domain}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    window.open(`https://${container.domain}`, "_blank")
                  }>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
          <div>Criado: {formatDate(container.createdAt)}</div>
          {container.lastStarted && (
            <div>Último início: {formatDate(container.lastStarted)}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
