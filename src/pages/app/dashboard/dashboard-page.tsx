import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BarChart3,
  Clock,
  Cpu,
  MemoryStick,
  Network,
  Server,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock de dados
const systemMetrics = {
  totalContainers: 24,
  activeContainers: 18,
  inactiveContainers: 6,
  activeClients: 12,
  avgCpu: 65,
  totalMemory: 8.4, // GB
  networkTraffic: 234, // MB/s
  avgResponseTime: 45, // ms
  systemUptime: 99.9, // %
};

const performanceData = [
  { time: "00:00", cpu: 45, memory: 6.2, network: 180 },
  { time: "04:00", cpu: 52, memory: 6.8, network: 210 },
  { time: "08:00", cpu: 78, memory: 7.5, network: 290 },
  { time: "12:00", cpu: 65, memory: 8.1, network: 234 },
  { time: "16:00", cpu: 82, memory: 8.4, network: 312 },
  { time: "20:00", cpu: 58, memory: 7.2, network: 198 },
];

// Mock de clientes
const clientsData = [
  {
    id: 1,
    name: "Tech Solutions LTDA",
    status: "active",
    containers: 5,
    lastActivity: "2 min atrás",
    plan: "Premium",
    usage: 85,
  },
  {
    id: 2,
    name: "Digital Innovations",
    status: "active",
    containers: 3,
    lastActivity: "15 min atrás",
    plan: "Business",
    usage: 62,
  },
  {
    id: 3,
    name: "StartupXYZ",
    status: "inactive",
    containers: 2,
    lastActivity: "2 horas atrás",
    plan: "Basic",
    usage: 23,
  },
  {
    id: 4,
    name: "Enterprise Corp",
    status: "active",
    containers: 8,
    lastActivity: "5 min atrás",
    plan: "Enterprise",
    usage: 94,
  },
];

// Mock de containers
const containersData = [
  {
    id: "cnt-001",
    name: "web-frontend",
    status: "running",
    cpu: 45,
    memory: 512,
    uptime: "5d 3h",
    client: "Tech Solutions LTDA",
  },
  {
    id: "cnt-002",
    name: "api-backend",
    status: "running",
    cpu: 72,
    memory: 1024,
    uptime: "12d 8h",
    client: "Digital Innovations",
  },
  {
    id: "cnt-003",
    name: "database-proxy",
    status: "stopped",
    cpu: 0,
    memory: 256,
    uptime: "0m",
    client: "StartupXYZ",
  },
  {
    id: "cnt-004",
    name: "microservice-auth",
    status: "running",
    cpu: 38,
    memory: 2048,
    uptime: "8d 14h",
    client: "Enterprise Corp",
  },
  {
    id: "cnt-005",
    name: "cache-redis",
    status: "running",
    cpu: 15,
    memory: 512,
    uptime: "15d 2h",
    client: "Tech Solutions LTDA",
  },
];

export function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Visão geral completa da sua plataforma
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="text-sm bg-white/80 backdrop-blur-sm">
            Última atualização: {new Date().toLocaleTimeString()}
          </Badge>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm p-2 h-auto rounded-2xl border border-white/10">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 py-3 px-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Visão Geral</span>
              <span className="sm:hidden">Geral</span>
            </TabsTrigger>
            <TabsTrigger
              value="clients"
              className="flex items-center gap-2 py-3 px-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clientes</span>
              <span className="sm:hidden">CLI</span>
            </TabsTrigger>
            <TabsTrigger
              value="containers"
              className="flex items-center gap-2 py-3 px-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300">
              <Server className="w-4 h-4" />
              <span className="hidden sm:inline">Containers</span>
              <span className="sm:hidden">CNT</span>
            </TabsTrigger>
            <TabsTrigger
              value="metrics"
              className="flex items-center gap-2 py-3 px-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/10 transition-all duration-200 text-gray-700 dark:text-gray-300">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Métricas</span>
              <span className="sm:hidden">MET</span>
            </TabsTrigger>
          </TabsList>{" "}
          <TabsContent value="overview" className="space-y-8">
            {/* Cards de Métricas Principais */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
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
                    {systemMetrics.totalContainers}
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {systemMetrics.activeContainers} ativos,{" "}
                    {systemMetrics.inactiveContainers} inativos
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Clientes Ativos
                  </CardTitle>
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                    {systemMetrics.activeClients}
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    +2 novos este mês
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    CPU Médio
                  </CardTitle>
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                    {systemMetrics.avgCpu}%
                  </div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    +5% desde ontem
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Uptime do Sistema
                  </CardTitle>
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                    {systemMetrics.systemUptime}
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Últimos 30 dias
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid gap-8 md:grid-cols-1">
              <Card className="bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-900 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    Performance do Sistema
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Métricas de CPU, memória e rede nas últimas 24h
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="cpu"
                        stroke="#3b82f6"
                        name="CPU %"
                      />
                      <Line
                        type="monotone"
                        dataKey="memory"
                        stroke="#22c55e"
                        name="Memória GB"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="clients">
            <div className="grid gap-6">
              {/* Resumo de Clientes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Total de Clientes
                    </CardTitle>
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {clientsData.length}
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {clientsData.filter((c) => c.status === "active").length}{" "}
                      ativos
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Clientes Ativos
                    </CardTitle>
                    <div className="p-2 bg-emerald-500 rounded-lg">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                      {clientsData.filter((c) => c.status === "active").length}
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      +2 novos este mês
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 border-purple-200 dark:border-purple-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Total Containers
                    </CardTitle>
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Server className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      {clientsData.reduce(
                        (acc, client) => acc + client.containers,
                        0
                      )}
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      Distribuídos entre clientes
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      Uso Médio
                    </CardTitle>
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                      {Math.round(
                        clientsData.reduce(
                          (acc, client) => acc + client.usage,
                          0
                        ) / clientsData.length
                      )}
                      %
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      Recursos utilizados
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de Clientes */}
              <Card>
                <CardHeader>
                  <CardTitle>Clientes Recentes</CardTitle>
                  <CardDescription>
                    Lista dos principais clientes e seus status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clientsData.map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{client.name}</h4>
                            <Badge
                              variant={
                                client.status === "active"
                                  ? "default"
                                  : "secondary"
                              }>
                              {client.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                            <Badge variant="outline">{client.plan}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {client.containers} containers •{" "}
                            {client.lastActivity}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {client.usage}% uso
                          </div>
                          <div className="w-20 h-2 bg-muted rounded-full mt-1">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${client.usage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="containers">
            <div className="grid gap-6">
              {/* Resumo de Containers */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Total Containers
                    </CardTitle>
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Server className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {containersData.length}
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {
                        containersData.filter((c) => c.status === "running")
                          .length
                      }{" "}
                      em execução
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Em Execução
                    </CardTitle>
                    <div className="p-2 bg-emerald-500 rounded-lg">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                      {
                        containersData.filter((c) => c.status === "running")
                          .length
                      }
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      Containers ativos
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      CPU Média
                    </CardTitle>
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Cpu className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                      {Math.round(
                        containersData
                          .filter((c) => c.status === "running")
                          .reduce((acc, container) => acc + container.cpu, 0) /
                          containersData.filter((c) => c.status === "running")
                            .length
                      )}
                      %
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      Uso de processamento
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      RAM Total
                    </CardTitle>
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <MemoryStick className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      {Math.round(
                        containersData.reduce(
                          (acc, container) => acc + container.memory,
                          0
                        ) / 1024
                      )}
                      GB
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      Memória alocada
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de Containers */}
              <Card>
                <CardHeader>
                  <CardTitle>Containers Ativos</CardTitle>
                  <CardDescription>
                    Status e performance dos containers em execução
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {containersData.map((container) => (
                      <div
                        key={container.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{container.name}</h4>
                              <Badge
                                variant={
                                  container.status === "running"
                                    ? "default"
                                    : "destructive"
                                }>
                                {container.status === "running"
                                  ? "Executando"
                                  : "Parado"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {container.client} • {container.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm font-medium">CPU</div>
                            <div className="text-lg">{container.cpu}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">RAM</div>
                            <div className="text-lg">{container.memory}MB</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">Uptime</div>
                            <div className="text-lg">{container.uptime}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="metrics">
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      CPU Utilização
                    </CardTitle>
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Cpu className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {systemMetrics.avgCpu}%
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${systemMetrics.avgCpu}%` }}></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Memória
                    </CardTitle>
                    <div className="p-2 bg-emerald-500 rounded-lg">
                      <MemoryStick className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                      {systemMetrics.totalMemory}GB
                    </div>
                    <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(systemMetrics.totalMemory / 16) * 100}%`,
                        }}></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 border-purple-200 dark:border-purple-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Rede
                    </CardTitle>
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Network className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      {systemMetrics.networkTraffic}MB/s
                    </div>
                    <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mt-2">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% desde ontem
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Performance</CardTitle>
                  <CardDescription>
                    Monitoramento detalhado dos recursos do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cpu" fill="#3b82f6" name="CPU %" />
                      <Bar dataKey="memory" fill="#22c55e" name="Memória GB" />
                      <Bar dataKey="network" fill="#f59e0b" name="Rede MB/s" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
