import { ContainerCard } from "@/components/custom/container-card";
import { ContainerLogsDialog } from "@/components/custom/container-logs-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClients } from "@/hooks/use-clients";
import { useContainers } from "@/hooks/use-containers";
import type { Client } from "@/types/client";
import type { Container } from "@/types/container";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  Search,
  Server,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContainersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(
    null
  );
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [containerLogs, setContainerLogs] = useState<string[]>([]);

  const {
    containers,
    loading,
    actionLoading,
    stats,
    executeAction,
    getContainerLogs,
    fetchContainers,
  } = useContainers();

  const { clients } = useClients();

  // Filtrar containers
  const filteredContainers = containers.filter((container) => {
    const matchesSearch =
      container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      container.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || container.status === statusFilter;
    const matchesClient =
      clientFilter === "all" || container.clientId === clientFilter;

    return matchesSearch && matchesStatus && matchesClient;
  });

  // Agrupar containers por status
  const containersByStatus = {
    running: filteredContainers.filter((c) => c.status === "running"),
    stopped: filteredContainers.filter((c) => c.status === "stopped"),
    error: filteredContainers.filter((c) => c.status === "error"),
    pending: filteredContainers.filter((c) => c.status === "pending"),
  };

  // Handlers
  const handleAction = async (
    action: "start" | "stop" | "restart" | "delete",
    containerId: string
  ) => {
    try {
      await executeAction({ action, containerId });
    } catch (error) {
      console.error("Erro ao executar ação:", error);
    }
  };

  const handleViewLogs = async (containerId: string) => {
    try {
      const logs = await getContainerLogs(containerId);
      if (logs) {
        setContainerLogs(logs.logs);
        setSelectedContainer(
          containers.find((c) => c.id === containerId) || null
        );
        setShowLogsDialog(true);
      }
    } catch {
      toast.error("Erro ao carregar logs");
    }
  };

  const handleViewStats = (containerId: string) => {
    const container = containers.find((c) => c.id === containerId);
    if (container) {
      setSelectedContainer(container);
      // Implementar modal de estatísticas detalhadas
      toast.info(
        "Funcionalidade de estatísticas detalhadas em desenvolvimento"
      );
    }
  };

  const handleRefresh = () => {
    fetchContainers();
    toast.success("Dados atualizados");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando containers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Server className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                  Containers
                </h1>
                <p className="text-muted-foreground">
                  Gerencie todos os containers Docker dos seus clientes
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total de Containers
              </CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Server className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {stats.total}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {stats.running} em execução
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Containers Ativos
              </CardTitle>
              <div className="p-2 bg-emerald-500 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                {stats.running}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.healthy} saudáveis
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-950 dark:to-pink-950 border-red-200 dark:border-red-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
                Com Problemas
              </CardTitle>
              <div className="p-2 bg-red-500 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">
                {stats.error + stats.unhealthy}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {stats.totalRestarts} restarts totais
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 border-purple-200 dark:border-purple-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Uso de Recursos
              </CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {stats.avgCpu.toFixed(1)}%
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                {(stats.totalMemory / 1024).toFixed(1)} GB RAM
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 border-slate-200 dark:border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Search className="h-5 w-5 text-blue-500" />
              Filtros
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Filtre e encontre containers específicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nome do container ou cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="running">Em execução</SelectItem>
                    <SelectItem value="stopped">Parado</SelectItem>
                    <SelectItem value="error">Com erro</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cliente</label>
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os clientes</SelectItem>
                    {clients.map((client: Client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Badges de filtros ativos */}
            <div className="flex flex-wrap gap-2 mt-4">
              {statusFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setStatusFilter("all")}>
                  Status: {statusFilter} ×
                </Badge>
              )}
              {clientFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setClientFilter("all")}>
                  Cliente:{" "}
                  {clients.find((c: Client) => c.id === clientFilter)?.nome} ×
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Containers */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-inner">
              <TabsTrigger
                value="all"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-md">
                <Server className="h-4 w-4" />
                <div className="text-center sm:text-left">
                  <div className="text-xs sm:text-sm font-medium">
                    Todos ({filteredContainers.length})
                  </div>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="running"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-md">
                <CheckCircle className="h-4 w-4" />
                <div className="text-center sm:text-left">
                  <div className="text-xs sm:text-sm font-medium">
                    Executando ({containersByStatus.running.length})
                  </div>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="stopped"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-gray-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-md">
                <XCircle className="h-4 w-4" />
                <div className="text-center sm:text-left">
                  <div className="text-xs sm:text-sm font-medium">Parados</div>
                  <div className="text-xs opacity-75">
                    ({containersByStatus.stopped.length})
                  </div>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="error"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-md">
                <AlertTriangle className="h-4 w-4" />
                <div className="text-center sm:text-left">
                  <div className="text-xs sm:text-sm font-medium">
                    Problemas ({containersByStatus.error.length})
                  </div>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="pending"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 rounded-md">
                <Clock className="h-4 w-4" />
                <div className="text-center sm:text-left">
                  <div className="text-xs sm:text-sm font-medium">
                    Pendentes ({containersByStatus.pending.length})
                  </div>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-4">
            {filteredContainers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Server className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Nenhum container encontrado
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Não há containers que correspondam aos filtros aplicados. Os
                    containers são criados automaticamente quando um cliente é
                    adicionado.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredContainers.map((container) => (
                  <ContainerCard
                    key={container.id}
                    container={container}
                    onAction={handleAction}
                    onViewLogs={handleViewLogs}
                    onViewStats={handleViewStats}
                    isActionLoading={actionLoading === container.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {Object.entries(containersByStatus).map(([status, containers]) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {containers.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Server className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Nenhum container com status "{status}"
                    </h3>
                    <p className="text-muted-foreground text-center">
                      Não há containers neste status no momento.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {containers.map((container) => (
                    <ContainerCard
                      key={container.id}
                      container={container}
                      onAction={handleAction}
                      onViewLogs={handleViewLogs}
                      onViewStats={handleViewStats}
                      isActionLoading={actionLoading === container.id}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Dialogs */}

        {/* Dialog de Logs */}
        <ContainerLogsDialog
          container={selectedContainer}
          logs={containerLogs}
          isOpen={showLogsDialog}
          onClose={() => setShowLogsDialog(false)}
          onRefresh={handleViewLogs}
        />
      </div>
    </div>
  );
}
