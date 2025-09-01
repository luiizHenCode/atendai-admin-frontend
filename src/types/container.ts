export type ContainerStatus = "running" | "stopped" | "error" | "pending";
export type ContainerHealth = "healthy" | "unhealthy" | "unknown";

export interface Container {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  type: "frontend" | "backend";
  status: ContainerStatus;
  health: ContainerHealth;
  cpu: number; // percentage
  memory: number; // MB
  network: number; // MB/s
  uptime: number; // seconds
  restarts: number;
  port: number;
  internalPort: number;
  image: string;
  tag: string;
  domain?: string;
  createdAt: string;
  updatedAt: string;
  lastStarted?: string;
  environment?: Record<string, string>;
}

export interface ContainerMetrics {
  cpu: number;
  memory: number;
  network: number;
  uptime: number;
  timestamp: string;
}

export interface SystemMetrics {
  totalContainers: number;
  activeContainers: number;
  inactiveContainers: number;
  activeClients: number;
  avgCpu: number;
  totalMemory: number;
  networkTraffic: number;
  avgResponseTime: number;
  systemUptime: number;
}

export interface CreateContainerRequest {
  name: string;
  clientId: string;
  type: "frontend" | "backend";
  port: number;
  image: string;
  tag?: string;
  domain?: string;
  environment?: Record<string, string>;
}

export interface ContainerAction {
  action: "start" | "stop" | "restart" | "delete";
  containerId: string;
}

export interface ContainerLogs {
  containerId: string;
  logs: string[];
  lastFetched: string;
}
