import type { Alert as AlertType } from "@/api/metrics";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMetrics } from "@/hooks/use-metrics";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Info,
  Loader2,
  MemoryStick,
  Network,
  RefreshCw,
  Server,
  TrendingDown,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function MetricsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("24h");

  const { metrics, alerts, performance, loading, resolveAlert, refreshAll } =
    useMetrics();

  // Formatadores
  const formatBytes = (bytes: number) => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getAlertIcon = (type: AlertType["type"]) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: AlertType["type"]) => {
    switch (type) {
      case "critical":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "default";
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "stable":
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando métricas...</span>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <Server className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Métricas não disponíveis</h3>
        <p className="text-muted-foreground text-center mb-4">
          Não foi possível carregar as métricas do sistema.
        </p>
        <Button onClick={refreshAll}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  // Dados para os gráficos
  const cpuData = metrics.historicalData.last24Hours.cpu.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: point.value,
  }));

  const memoryData = metrics.historicalData.last24Hours.memory.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: point.value / 1024, // Convert to GB
  }));

  const networkData = metrics.historicalData.last24Hours.network.map(
    (point) => ({
      time: new Date(point.timestamp).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: point.value,
    })
  );

  const containerStatusData = [
    {
      name: "Ativos",
      value: metrics.system.activeContainers,
      color: "#00C49F",
    },
    {
      name: "Parados",
      value: metrics.system.inactiveContainers,
      color: "#FF8042",
    },
    {
      name: "Com Erro",
      value: alerts.filter((a) => a.type === "critical").length,
      color: "#FF4444",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Métricas Avançadas
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Monitoramento detalhado e análise de performance do sistema
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7d</SelectItem>
                <SelectItem value="30d">Últimos 30d</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={refreshAll}
              className="gap-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Alertas */}
        {alerts.length > 0 && (
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-red-200 dark:border-red-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="h-5 w-5" />
                Alertas Ativos ({alerts.length})
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                Problemas que requerem atenção imediata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  variant={getAlertVariant(alert.type)}
                  className="bg-white/50 dark:bg-slate-900/50 w-full flex">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex flex-col items-start gap-3">
                      <AlertTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {getAlertIcon(alert.type)}
                        {alert.title}
                      </AlertTitle>
                      <div className="flex flex-col">
                        <AlertDescription className="mt-1 text-slate-700 dark:text-slate-300">
                          {alert.message}
                          {alert.containerName && (
                            <Badge
                              variant="outline"
                              className="border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300">
                              {alert.containerName}
                            </Badge>
                          )}
                        </AlertDescription>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          {new Date(alert.timestamp).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveAlert(alert.id)}
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                      Resolver
                    </Button>
                  </div>
                </Alert>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Uptime do Sistema
              </CardTitle>
              <div className="p-2 bg-emerald-500 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                {metrics.system.systemUptime}%
              </div>
              <Progress
                value={metrics.system.systemUptime}
                className="mt-3 h-2 bg-emerald-200 dark:bg-emerald-800"
              />
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                Sistema estável
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Tempo de Resposta
              </CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {metrics.system.avgResponseTime}ms
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Média das últimas 24h
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Taxa de Erro
              </CardTitle>
              <div className="p-2 bg-amber-500 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                {performance?.errorRate
                  ? (performance.errorRate * 100).toFixed(2)
                  : "0.00"}
                %
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                {performance?.totalRequests
                  ? formatNumber(performance.totalRequests)
                  : "0"}{" "}
                requisições totais
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Throughput
              </CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {performance?.throughput
                  ? formatNumber(performance.throughput)
                  : "0"}
                /s
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Requisições por segundo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos e Métricas */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-lg h-fit px-3">
            <TabsTrigger
              value="overview"
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-center">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-center">Performance</span>
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Cpu className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-center">Recursos</span>
            </TabsTrigger>
            <TabsTrigger
              value="containers"
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Server className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-center">Containers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CPU Usage Chart */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <div className="p-1.5 bg-blue-500 rounded-lg">
                      <Cpu className="h-4 w-4 text-white" />
                    </div>
                    Uso de CPU (Últimas 24h)
                  </CardTitle>
                  <CardDescription className="text-blue-600 dark:text-blue-400">
                    Monitoramento do processamento em tempo real
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={cpuData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(59, 130, 246, 0.1)"
                      />
                      <XAxis dataKey="time" stroke="#3b82f6" fontSize={12} />
                      <YAxis stroke="#3b82f6" fontSize={12} />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "CPU"]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #3b82f6",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="url(#cpuGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient
                          id="cpuGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1">
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Memory Usage Chart */}
              <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <div className="p-1.5 bg-purple-500 rounded-lg">
                      <MemoryStick className="h-4 w-4 text-white" />
                    </div>
                    Uso de Memória (Últimas 24h)
                  </CardTitle>
                  <CardDescription className="text-purple-600 dark:text-purple-400">
                    Consumo de RAM dos containers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={memoryData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(168, 85, 247, 0.1)"
                      />
                      <XAxis dataKey="time" stroke="#a855f7" fontSize={12} />
                      <YAxis stroke="#a855f7" fontSize={12} />
                      <Tooltip
                        formatter={(value) => [`${value} GB`, "Memória"]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #a855f7",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#a855f7"
                        strokeWidth={3}
                        dot={{ fill: "#a855f7", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#a855f7" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Network Traffic */}
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <div className="p-1.5 bg-emerald-500 rounded-lg">
                      <Network className="h-4 w-4 text-white" />
                    </div>
                    Tráfego de Rede (Últimas 24h)
                  </CardTitle>
                  <CardDescription className="text-emerald-600 dark:text-emerald-400">
                    Dados de entrada e saída
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={networkData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(16, 185, 129, 0.1)"
                      />
                      <XAxis dataKey="time" stroke="#10b981" fontSize={12} />
                      <YAxis stroke="#10b981" fontSize={12} />
                      <Tooltip
                        formatter={(value) => [`${value} MB/s`, "Rede"]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #10b981",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="url(#networkGradient)"
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient
                          id="networkGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1">
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0.4}
                          />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Container Status Distribution */}
              <Card className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-950 border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <div className="p-1.5 bg-slate-500 rounded-lg">
                      <Server className="h-4 w-4 text-white" />
                    </div>
                    Distribuição de Containers
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Status atual dos containers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={containerStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        stroke="#ffffff"
                        strokeWidth={2}>
                        {containerStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #64748b",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Resource Users */}
              <Card className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                    <div className="p-1.5 bg-orange-500 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    Maiores Consumidores de Recursos
                  </CardTitle>
                  <CardDescription className="text-orange-600 dark:text-orange-400">
                    Containers que mais consomem CPU e memória
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performance?.topResourceUsers.map((container, index) => (
                      <div
                        key={container.containerId}
                        className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{container.name}</p>
                          <p className="text-sm text-muted-foreground">
                            CPU: {container.cpuUsage.toFixed(1)}% | RAM:{" "}
                            {formatBytes(container.memoryUsage * 1024 * 1024)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            index === 0
                              ? "destructive"
                              : index === 1
                              ? "secondary"
                              : "outline"
                          }>
                          #{index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Slowest Containers */}
              <Card className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950 dark:to-rose-950 border-red-200 dark:border-red-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <div className="p-1.5 bg-red-500 rounded-lg">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    Containers Mais Lentos
                  </CardTitle>
                  <CardDescription className="text-red-600 dark:text-red-400">
                    Containers com maior tempo de resposta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performance?.slowestContainers.map((container, index) => (
                      <div
                        key={container.containerId}
                        className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{container.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Tempo médio: {container.avgResponseTime}ms
                          </p>
                        </div>
                        <Badge
                          variant={index === 0 ? "destructive" : "secondary"}>
                          {container.avgResponseTime}ms
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Trends Cards */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <div className="p-1.5 bg-blue-500 rounded-lg">
                      <Cpu className="h-4 w-4 text-white" />
                    </div>
                    Tendência de CPU
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {metrics.system.avgCpu.toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Média atual
                      </p>
                    </div>
                    {getTrendIcon(
                      metrics.historicalData.last30Days.trends.cpuTrend
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <div className="p-1.5 bg-purple-500 rounded-lg">
                      <MemoryStick className="h-4 w-4 text-white" />
                    </div>
                    Tendência de Memória
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatBytes(metrics.system.totalMemory * 1024 * 1024)}
                      </div>
                      <p className="text-sm text-muted-foreground">Uso total</p>
                    </div>
                    {getTrendIcon(
                      metrics.historicalData.last30Days.trends.memoryTrend
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <div className="p-1.5 bg-emerald-500 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    Tendência de Uptime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {metrics.system.systemUptime}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Disponibilidade
                      </p>
                    </div>
                    {getTrendIcon(
                      metrics.historicalData.last30Days.trends.uptimeTrend
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Growth Metrics */}
            <Card className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-950 border-slate-200 dark:border-slate-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <div className="p-1.5 bg-slate-500 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  Crescimento (Últimos 30 dias)
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Variação nos recursos e capacidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      +{metrics.historicalData.last30Days.growth.containers}%
                    </div>
                    <p className="text-sm text-muted-foreground">Containers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      +{metrics.historicalData.last30Days.growth.clients}%
                    </div>
                    <p className="text-sm text-muted-foreground">Clientes</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      +{metrics.historicalData.last30Days.growth.resources}%
                    </div>
                    <p className="text-sm text-muted-foreground">Recursos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="containers" className="space-y-4">
            <div className="space-y-4">
              {metrics.containers.map((container, index) => (
                <Card
                  key={container.containerId}
                  className={`bg-gradient-to-br ${
                    index % 4 === 0
                      ? "from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800"
                      : index % 4 === 1
                      ? "from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800"
                      : index % 4 === 2
                      ? "from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800"
                      : "from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800"
                  } shadow-lg`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg ${
                            index % 4 === 0
                              ? "bg-blue-500"
                              : index % 4 === 1
                              ? "bg-purple-500"
                              : index % 4 === 2
                              ? "bg-emerald-500"
                              : "bg-orange-500"
                          }`}>
                          <Server className="h-4 w-4 text-white" />
                        </div>
                        <span
                          className={
                            index % 4 === 0
                              ? "text-blue-700 dark:text-blue-300"
                              : index % 4 === 1
                              ? "text-purple-700 dark:text-purple-300"
                              : index % 4 === 2
                              ? "text-emerald-700 dark:text-emerald-300"
                              : "text-orange-700 dark:text-orange-300"
                          }>
                          {container.name}
                        </span>
                      </div>
                      <Badge variant="outline">{container.clientName}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {container.metrics.cpu[
                            container.metrics.cpu.length - 1
                          ]?.value.toFixed(1)}
                          %
                        </div>
                        <p className="text-sm text-muted-foreground">CPU</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {formatBytes(
                            container.metrics.memory[
                              container.metrics.memory.length - 1
                            ]?.value *
                              1024 *
                              1024
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Memória</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {container.metrics.responseTime}ms
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Resp. Time
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {(container.metrics.errorRate * 100).toFixed(2)}%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Taxa de Erro
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
