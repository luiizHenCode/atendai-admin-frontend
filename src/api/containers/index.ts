import type {
  Container,
  ContainerAction,
  ContainerLogs,
  CreateContainerRequest,
} from "@/types/container";

// Mock data para containers
const mockContainers: Container[] = [
  {
    id: "cont_001",
    name: "techcorp-frontend",
    clientId: "client_001",
    clientName: "TechCorp Ltda",
    type: "frontend",
    status: "running",
    health: "healthy",
    cpu: 15.2,
    memory: 512,
    network: 2.1,
    uptime: 86400,
    restarts: 0,
    port: 3001,
    internalPort: 80,
    image: "nginx",
    tag: "latest",
    domain: "techcorp.atendai.com",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    lastStarted: "2024-01-15T10:00:00Z",
    environment: {
      NODE_ENV: "production",
      PORT: "3000",
    },
  },
  {
    id: "cont_002",
    name: "techcorp-backend",
    clientId: "client_001",
    clientName: "TechCorp Ltda",
    type: "backend",
    status: "running",
    health: "healthy",
    cpu: 25.7,
    memory: 1024,
    network: 1.8,
    uptime: 86400,
    restarts: 1,
    port: 3002,
    internalPort: 3000,
    image: "node",
    tag: "18-alpine",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    lastStarted: "2024-01-15T10:00:00Z",
    environment: {
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://localhost:5432/techcorp",
    },
  },
  {
    id: "cont_003",
    name: "innovatech-frontend",
    clientId: "client_002",
    clientName: "InnovaTech Solutions",
    type: "frontend",
    status: "stopped",
    health: "unknown",
    cpu: 0,
    memory: 0,
    network: 0,
    uptime: 0,
    restarts: 2,
    port: 3003,
    internalPort: 80,
    image: "nginx",
    tag: "alpine",
    domain: "innovatech.atendai.com",
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
    environment: {
      NODE_ENV: "production",
    },
  },
  {
    id: "cont_004",
    name: "innovatech-backend",
    clientId: "client_002",
    clientName: "InnovaTech Solutions",
    type: "backend",
    status: "error",
    health: "unhealthy",
    cpu: 0,
    memory: 0,
    network: 0,
    uptime: 0,
    restarts: 5,
    port: 3004,
    internalPort: 8000,
    image: "python",
    tag: "3.11-slim",
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
    environment: {
      PYTHONPATH: "/app",
      DATABASE_URL: "postgresql://localhost:5432/innovatech",
    },
  },
  {
    id: "cont_005",
    name: "digitalsys-frontend",
    clientId: "client_003",
    clientName: "DigitalSys Inc",
    type: "frontend",
    status: "pending",
    health: "unknown",
    cpu: 0,
    memory: 0,
    network: 0,
    uptime: 0,
    restarts: 0,
    port: 3005,
    internalPort: 80,
    image: "nginx",
    tag: "latest",
    domain: "digitalsys.atendai.com",
    createdAt: "2024-01-21T08:00:00Z",
    updatedAt: "2024-01-21T08:00:00Z",
  },
  {
    id: "cont_006",
    name: "cloudtech-backend",
    clientId: "client_004",
    clientName: "CloudTech Pro",
    type: "backend",
    status: "running",
    health: "healthy",
    cpu: 35.4,
    memory: 2048,
    network: 3.2,
    uptime: 43200,
    restarts: 0,
    port: 3006,
    internalPort: 8080,
    image: "openjdk",
    tag: "11-jre-slim",
    createdAt: "2024-01-18T12:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z",
    lastStarted: "2024-01-20T06:00:00Z",
    environment: {
      JAVA_OPTS: "-Xmx2048m",
      SPRING_PROFILES_ACTIVE: "production",
    },
  },
];

// Simulação de delay para requisições
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const containersApi = {
  // Listar todos os containers
  async getContainers(): Promise<Container[]> {
    await delay(500);
    return mockContainers;
  },

  // Buscar container por ID
  async getContainerById(id: string): Promise<Container | null> {
    await delay(300);
    return mockContainers.find((container) => container.id === id) || null;
  },

  // Buscar containers por cliente
  async getContainersByClient(clientId: string): Promise<Container[]> {
    await delay(400);
    return mockContainers.filter(
      (container) => container.clientId === clientId
    );
  },

  // Criar novo container
  async createContainer(data: CreateContainerRequest): Promise<Container> {
    await delay(1000);

    const newContainer: Container = {
      id: `cont_${Date.now()}`,
      name: data.name,
      clientId: data.clientId,
      clientName: "Cliente Exemplo", // Em uma API real, buscaríamos pelo clientId
      type: data.type,
      status: "pending",
      health: "unknown",
      cpu: 0,
      memory: 0,
      network: 0,
      uptime: 0,
      restarts: 0,
      port: data.port,
      internalPort: data.type === "frontend" ? 80 : 3000,
      image: data.image,
      tag: data.tag || "latest",
      domain: data.domain,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      environment: data.environment,
    };

    mockContainers.push(newContainer);
    return newContainer;
  },

  // Executar ação no container (start, stop, restart, delete)
  async executeAction(
    action: ContainerAction
  ): Promise<{ success: boolean; message: string }> {
    await delay(800);

    const containerIndex = mockContainers.findIndex(
      (c) => c.id === action.containerId
    );
    if (containerIndex === -1) {
      return { success: false, message: "Container não encontrado" };
    }

    const container = mockContainers[containerIndex];

    switch (action.action) {
      case "start":
        if (container.status === "running") {
          return { success: false, message: "Container já está em execução" };
        }
        container.status = "running";
        container.health = "healthy";
        container.lastStarted = new Date().toISOString();
        container.uptime = 0;
        break;

      case "stop":
        if (container.status === "stopped") {
          return { success: false, message: "Container já está parado" };
        }
        container.status = "stopped";
        container.health = "unknown";
        container.cpu = 0;
        container.memory = 0;
        container.network = 0;
        container.uptime = 0;
        break;

      case "restart":
        container.status = "running";
        container.health = "healthy";
        container.restarts += 1;
        container.lastStarted = new Date().toISOString();
        container.uptime = 0;
        break;

      case "delete":
        mockContainers.splice(containerIndex, 1);
        return { success: true, message: "Container removido com sucesso" };
    }

    container.updatedAt = new Date().toISOString();
    return {
      success: true,
      message: `Container ${
        action.action === "restart"
          ? "reiniciado"
          : action.action === "start"
          ? "iniciado"
          : "parado"
      } com sucesso`,
    };
  },

  // Buscar logs do container
  async getContainerLogs(containerId: string): Promise<ContainerLogs> {
    await delay(600);

    const mockLogs = [
      "[INFO] Container started successfully",
      "[INFO] Application listening on port 3000",
      "[INFO] Database connection established",
      "[WARN] High memory usage detected",
      "[INFO] Processing request from user",
      "[ERROR] Temporary connection timeout",
      "[INFO] Connection restored",
      "[INFO] Backup completed successfully",
      "[DEBUG] Processing background tasks",
      "[INFO] System health check passed",
    ];

    return {
      containerId,
      logs: mockLogs,
      lastFetched: new Date().toISOString(),
    };
  },

  // Buscar estatísticas detalhadas do container
  async getContainerStats(containerId: string): Promise<Container | null> {
    await delay(400);

    const container = mockContainers.find((c) => c.id === containerId);
    if (!container) return null;

    // Simular atualizações em tempo real das métricas
    if (container.status === "running") {
      container.cpu = Math.random() * 50 + 10;
      container.memory = Math.random() * 1000 + 200;
      container.network = Math.random() * 5 + 0.5;
      container.uptime += 60; // Simular 1 minuto adicional
    }

    return container;
  },
};
