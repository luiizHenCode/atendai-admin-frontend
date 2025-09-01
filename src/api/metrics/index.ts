import type { SystemMetrics } from "@/types/container";

export interface AdvancedMetrics {
  system: SystemMetrics;
  containers: ContainerDetailedMetrics[];
  historicalData: HistoricalMetrics;
  alerts: Alert[];
  performance: PerformanceMetrics;
}

export interface ContainerDetailedMetrics {
  containerId: string;
  name: string;
  clientName: string;
  metrics: {
    cpu: MetricPoint[];
    memory: MetricPoint[];
    network: NetworkMetrics;
    disk: DiskMetrics;
    uptime: number;
    restarts: number;
    errorRate: number;
    responseTime: number;
  };
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface NetworkMetrics {
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  errorCount: number;
}

export interface DiskMetrics {
  readBytes: number;
  writeBytes: number;
  readOps: number;
  writeOps: number;
  usage: number; // percentage
}

export interface HistoricalMetrics {
  last24Hours: {
    cpu: MetricPoint[];
    memory: MetricPoint[];
    network: MetricPoint[];
    activeContainers: MetricPoint[];
  };
  last7Days: {
    avgCpu: MetricPoint[];
    avgMemory: MetricPoint[];
    uptime: MetricPoint[];
    incidents: MetricPoint[];
  };
  last30Days: {
    growth: {
      containers: number;
      clients: number;
      resources: number;
    };
    trends: {
      cpuTrend: "up" | "down" | "stable";
      memoryTrend: "up" | "down" | "stable";
      uptimeTrend: "up" | "down" | "stable";
    };
  };
}

export interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  containerId?: string;
  containerName?: string;
  timestamp: string;
  resolved: boolean;
}

export interface PerformanceMetrics {
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  throughput: number;
  availability: number;
  slowestContainers: {
    containerId: string;
    name: string;
    avgResponseTime: number;
  }[];
  topResourceUsers: {
    containerId: string;
    name: string;
    cpuUsage: number;
    memoryUsage: number;
  }[];
}

// Mock data generator
const generateMockMetricPoints = (
  count: number,
  baseValue: number,
  variance: number
): MetricPoint[] => {
  const points: MetricPoint[] = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000); // 5 minutes intervals
    const value = Math.max(0, baseValue + (Math.random() - 0.5) * variance);
    points.push({
      timestamp: timestamp.toISOString(),
      value: Math.round(value * 100) / 100,
    });
  }

  return points;
};

// Mock data
const mockAdvancedMetrics: AdvancedMetrics = {
  system: {
    totalContainers: 6,
    activeContainers: 4,
    inactiveContainers: 2,
    activeClients: 4,
    avgCpu: 28.5,
    totalMemory: 8192,
    networkTraffic: 125.6,
    avgResponseTime: 245,
    systemUptime: 99.8,
  },
  containers: [
    {
      containerId: "cont_001",
      name: "techcorp-frontend",
      clientName: "TechCorp Ltda",
      metrics: {
        cpu: generateMockMetricPoints(24, 25, 20),
        memory: generateMockMetricPoints(24, 512, 100),
        network: {
          bytesIn: 1250000,
          bytesOut: 950000,
          packetsIn: 8500,
          packetsOut: 6200,
          errorCount: 2,
        },
        disk: {
          readBytes: 450000,
          writeBytes: 320000,
          readOps: 125,
          writeOps: 89,
          usage: 35.5,
        },
        uptime: 86400,
        restarts: 0,
        errorRate: 0.02,
        responseTime: 180,
      },
    },
    {
      containerId: "cont_002",
      name: "techcorp-backend",
      clientName: "TechCorp Ltda",
      metrics: {
        cpu: generateMockMetricPoints(24, 35, 25),
        memory: generateMockMetricPoints(24, 1024, 200),
        network: {
          bytesIn: 2800000,
          bytesOut: 1950000,
          packetsIn: 15200,
          packetsOut: 11800,
          errorCount: 5,
        },
        disk: {
          readBytes: 1250000,
          writeBytes: 890000,
          readOps: 380,
          writeOps: 245,
          usage: 58.2,
        },
        uptime: 86400,
        restarts: 1,
        errorRate: 0.05,
        responseTime: 320,
      },
    },
  ],
  historicalData: {
    last24Hours: {
      cpu: generateMockMetricPoints(24, 30, 15),
      memory: generateMockMetricPoints(24, 4096, 1000),
      network: generateMockMetricPoints(24, 100, 50),
      activeContainers: generateMockMetricPoints(24, 4, 1),
    },
    last7Days: {
      avgCpu: generateMockMetricPoints(7, 28, 10),
      avgMemory: generateMockMetricPoints(7, 4200, 500),
      uptime: generateMockMetricPoints(7, 99.5, 0.5),
      incidents: generateMockMetricPoints(7, 2, 2),
    },
    last30Days: {
      growth: {
        containers: 15.5,
        clients: 8.2,
        resources: 22.1,
      },
      trends: {
        cpuTrend: "up",
        memoryTrend: "stable",
        uptimeTrend: "up",
      },
    },
  },
  alerts: [
    {
      id: "alert_001",
      type: "warning",
      title: "Alto uso de CPU",
      message:
        "Container techcorp-backend está usando mais de 80% da CPU nos últimos 15 minutos",
      containerId: "cont_002",
      containerName: "techcorp-backend",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      resolved: false,
    },
    {
      id: "alert_002",
      type: "info",
      title: "Container reiniciado",
      message: "Container innovatech-backend foi reiniciado com sucesso",
      containerId: "cont_004",
      containerName: "innovatech-backend",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      resolved: true,
    },
    {
      id: "alert_003",
      type: "critical",
      title: "Container parado",
      message: "Container innovatech-frontend parou inesperadamente",
      containerId: "cont_003",
      containerName: "innovatech-frontend",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      resolved: false,
    },
  ],
  performance: {
    totalRequests: 125489,
    avgResponseTime: 245,
    errorRate: 0.03,
    throughput: 1250,
    availability: 99.8,
    slowestContainers: [
      {
        containerId: "cont_002",
        name: "techcorp-backend",
        avgResponseTime: 320,
      },
      {
        containerId: "cont_006",
        name: "cloudtech-backend",
        avgResponseTime: 285,
      },
    ],
    topResourceUsers: [
      {
        containerId: "cont_006",
        name: "cloudtech-backend",
        cpuUsage: 35.4,
        memoryUsage: 2048,
      },
      {
        containerId: "cont_002",
        name: "techcorp-backend",
        cpuUsage: 25.7,
        memoryUsage: 1024,
      },
    ],
  },
};

// Simulação de delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const metricsApi = {
  // Buscar métricas avançadas
  async getAdvancedMetrics(): Promise<AdvancedMetrics> {
    await delay(800);
    return mockAdvancedMetrics;
  },

  // Buscar métricas de um container específico
  async getContainerMetrics(
    containerId: string
  ): Promise<ContainerDetailedMetrics | null> {
    await delay(500);
    return (
      mockAdvancedMetrics.containers.find(
        (c) => c.containerId === containerId
      ) || null
    );
  },

  // Buscar alertas ativos
  async getActiveAlerts(): Promise<Alert[]> {
    await delay(300);
    return mockAdvancedMetrics.alerts.filter((alert) => !alert.resolved);
  },

  // Marcar alerta como resolvido
  async resolveAlert(alertId: string): Promise<{ success: boolean }> {
    await delay(400);
    const alert = mockAdvancedMetrics.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      return { success: true };
    }
    return { success: false };
  },

  // Buscar dados históricos
  async getHistoricalData(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _period: "24h" | "7d" | "30d" // TODO: implementar filtro por período
  ): Promise<HistoricalMetrics> {
    await delay(600);
    return mockAdvancedMetrics.historicalData;
  },

  // Buscar métricas de performance
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    await delay(400);
    return mockAdvancedMetrics.performance;
  },
};
