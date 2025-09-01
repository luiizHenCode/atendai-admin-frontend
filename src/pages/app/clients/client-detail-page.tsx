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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContainers } from "@/hooks/use-containers";
import type { Client } from "@/types/client";
import type { Container } from "@/types/container";
import {
  Activity,
  ArrowLeft,
  Calendar,
  Cpu,
  Globe,
  MemoryStick,
  Server,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

// Mock data - em produção viria de APIs
const mockClient: Client = {
  id: "1",
  nome: "TechCorp Solutions",
  slug: "techcorp-solutions",
  dominio: "techcorp.com",
  status: "active",
  containers: [],
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-03-20T14:20:00Z",
};

const mockContainers: Container[] = [
  {
    id: "1",
    name: "techcorp-web",
    clientId: "1",
    clientName: "TechCorp Solutions",
    type: "frontend",
    status: "running",
    health: "healthy",
    image: "nginx",
    tag: "latest",
    cpu: 45,
    memory: 512,
    network: 10,
    uptime: 300000, // 3d 12h em segundos
    restarts: 0,
    port: 8080,
    internalPort: 80,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-03-20T14:20:00Z",
  },
  {
    id: "2",
    name: "techcorp-api",
    clientId: "1",
    clientName: "TechCorp Solutions",
    type: "backend",
    status: "running",
    health: "healthy",
    image: "node",
    tag: "18",
    cpu: 32,
    memory: 1024,
    network: 15,
    uptime: 200000, // 2d 8h em segundos
    restarts: 1,
    port: 3000,
    internalPort: 3000,
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-03-19T11:45:00Z",
  },
];

export function ClientDetailPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para o modal de logs
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(
    null
  );
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [containerLogs, setContainerLogs] = useState<string[]>([]);

  // Hook para buscar logs
  const { getContainerLogs } = useContainers();

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setClient(mockClient);
      setContainers(mockContainers);
      setLoading(false);
    }, 500);
  }, [clientId]);

  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
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

  const handleContainerAction = async (
    action: "start" | "stop" | "restart" | "delete",
    containerId: string
  ) => {
    toast.info(`Ação "${action}" executada no container ${containerId}`);
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
    toast.info(`Visualizando estatísticas do container ${containerId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Carregando dados do cliente...</span>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <h2 className="text-xl font-semibold">Cliente não encontrado</h2>
        <Button onClick={() => navigate("/clientes")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Clientes
        </Button>
      </div>
    );
  }

  const runningContainers = containers.filter((c) => c.status === "running");
  const totalCpu = runningContainers.reduce((acc, c) => acc + c.cpu, 0);
  const totalMemory = containers.reduce((acc, c) => acc + c.memory, 0);
  const avgCpu =
    runningContainers.length > 0 ? totalCpu / runningContainers.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-100 dark:from-slate-950 dark:via-emerald-950 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/clientes")}
              className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  {client.nome}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {client.dominio || client.slug}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(
                      client.status
                    )} text-white border-0`}>
                    {getStatusText(client.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Containers
              </CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Server className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {containers.length}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {runningContainers.length} em execução
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                CPU Média
              </CardTitle>
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Cpu className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                {avgCpu.toFixed(1)}%
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                Uso de processamento
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Memória Total
              </CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <MemoryStick className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {(totalMemory / 1024).toFixed(1)}GB
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Memória alocada
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Uptime
              </CardTitle>
              <div className="p-2 bg-orange-500 rounded-lg">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                99.9%
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Disponibilidade
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="containers" className="space-y-4">
          <TabsList className="bg-white/20 dark:bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="containers" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Containers ({containers.length})
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Métricas
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Informações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="containers" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {containers.map((container) => (
                <ContainerCard
                  key={container.id}
                  container={container}
                  onAction={handleContainerAction}
                  onViewLogs={handleViewLogs}
                  onViewStats={handleViewStats}
                  isActionLoading={false}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Uso de CPU
                  </CardTitle>
                  <CardDescription>
                    Utilização de processamento dos containers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {containers.map((container) => (
                      <div
                        key={container.id}
                        className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {container.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: `${container.cpu}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {container.cpu}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MemoryStick className="h-5 w-5" />
                    Uso de Memória
                  </CardTitle>
                  <CardDescription>
                    Alocação de RAM dos containers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {containers.map((container) => (
                      <div
                        key={container.id}
                        className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {container.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {container.memory}MB
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
                <CardDescription>
                  Detalhes e configurações do cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Nome
                      </label>
                      <p className="text-lg font-semibold">{client.nome}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Slug
                      </label>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {client.slug}
                      </code>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Domínio
                      </label>
                      <p className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {client.dominio || "Não configurado"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusColor(
                            client.status
                          )}`}
                        />
                        {getStatusText(client.status)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Criado em
                      </label>
                      <p className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Última atualização
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(client.updatedAt).toLocaleDateString("pt-BR")}{" "}
                        às{" "}
                        {new Date(client.updatedAt).toLocaleTimeString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Logs */}
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
