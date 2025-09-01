// Mock API service - substituir por implementação real
import type {
  Client,
  ContainerApp,
  CreateClientRequest,
  SystemMetrics,
} from "@/types/container";

// Simulação de delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data - será substituído por chamadas reais
const mockClients: Client[] = [
  {
    id: "1",
    name: "Empresa Alpha",
    slug: "empresa-alpha",
    domain: "alpha.com",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    isActive: true,
  },
  {
    id: "2",
    name: "Beta Solutions",
    slug: "beta-solutions",
    domain: "beta.solutions",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    isActive: true,
  },
];

const mockContainers: ContainerApp[] = [
  {
    id: "c1",
    name: "empresa-alpha-frontend",
    description: "Frontend da Empresa Alpha",
    image: "nginx",
    tag: "latest",
    status: "running",
    port: 3001,
    environment: {},
    volumes: [],
    networks: ["default"],
    clientSlug: "empresa-alpha",
    clientName: "Empresa Alpha",
    containerType: "frontend",
    healthStatus: "healthy",
    cpuUsage: 2.5,
    memoryUsage: 128,
    restartCount: 0,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "c2",
    name: "empresa-alpha-backend",
    description: "Backend da Empresa Alpha",
    image: "node",
    tag: "18",
    status: "running",
    port: 4001,
    environment: {},
    volumes: [],
    networks: ["default"],
    clientSlug: "empresa-alpha",
    clientName: "Empresa Alpha",
    containerType: "backend",
    healthStatus: "healthy",
    cpuUsage: 15.2,
    memoryUsage: 256,
    restartCount: 1,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
];

// API de Clientes
export const clientsApi = {
  // GET - Listar clientes
  getClients: async (): Promise<Client[]> => {
    await delay(500);
    return [...mockClients];
  },

  // GET - Buscar cliente por ID
  getClient: async (id: string): Promise<Client> => {
    await delay(300);
    const client = mockClients.find((c) => c.id === id);
    if (!client) {
      throw new Error("Cliente não encontrado");
    }
    return client;
  },

  // POST - Criar cliente
  createClient: async (data: CreateClientRequest): Promise<Client> => {
    await delay(800);
    const newClient: Client = {
      id: Date.now().toString(),
      name: data.name,
      slug: data.slug,
      domain: data.domain,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    mockClients.push(newClient);
    return newClient;
  },

  // PUT - Atualizar status do cliente
  toggleClientStatus: async (id: string): Promise<Client> => {
    await delay(400);
    const clientIndex = mockClients.findIndex((c) => c.id === id);
    if (clientIndex === -1) {
      throw new Error("Cliente não encontrado");
    }

    mockClients[clientIndex].isActive = !mockClients[clientIndex].isActive;
    mockClients[clientIndex].updatedAt = new Date();

    return mockClients[clientIndex];
  },

  // DELETE - Deletar cliente
  deleteClient: async (id: string): Promise<void> => {
    await delay(600);
    const clientIndex = mockClients.findIndex((c) => c.id === id);
    if (clientIndex === -1) {
      throw new Error("Cliente não encontrado");
    }

    mockClients.splice(clientIndex, 1);
  },
};

// API de Containers
export const containersApi = {
  // GET - Listar containers
  getContainers: async (): Promise<ContainerApp[]> => {
    await delay(400);
    return [...mockContainers];
  },

  // POST - Iniciar container
  startContainer: async (id: string): Promise<ContainerApp> => {
    await delay(1000);
    const containerIndex = mockContainers.findIndex((c) => c.id === id);
    if (containerIndex === -1) {
      throw new Error("Container não encontrado");
    }

    mockContainers[containerIndex].status = "running";
    mockContainers[containerIndex].healthStatus = "healthy";
    mockContainers[containerIndex].updatedAt = new Date();

    return mockContainers[containerIndex];
  },

  // POST - Parar container
  stopContainer: async (id: string): Promise<ContainerApp> => {
    await delay(800);
    const containerIndex = mockContainers.findIndex((c) => c.id === id);
    if (containerIndex === -1) {
      throw new Error("Container não encontrado");
    }

    mockContainers[containerIndex].status = "stopped";
    mockContainers[containerIndex].healthStatus = "unknown";
    mockContainers[containerIndex].updatedAt = new Date();

    return mockContainers[containerIndex];
  },

  // POST - Reiniciar container
  restartContainer: async (id: string): Promise<ContainerApp> => {
    await delay(1200);
    const containerIndex = mockContainers.findIndex((c) => c.id === id);
    if (containerIndex === -1) {
      throw new Error("Container não encontrado");
    }

    mockContainers[containerIndex].status = "running";
    mockContainers[containerIndex].healthStatus = "healthy";
    mockContainers[containerIndex].restartCount =
      (mockContainers[containerIndex].restartCount || 0) + 1;
    mockContainers[containerIndex].updatedAt = new Date();

    return mockContainers[containerIndex];
  },

  // DELETE - Deletar container
  deleteContainer: async (id: string): Promise<void> => {
    await delay(600);
    const containerIndex = mockContainers.findIndex((c) => c.id === id);
    if (containerIndex === -1) {
      throw new Error("Container não encontrado");
    }

    mockContainers.splice(containerIndex, 1);
  },
};

// API de Métricas
export const metricsApi = {
  // GET - Métricas do sistema
  getSystemMetrics: async (): Promise<SystemMetrics> => {
    await delay(200);

    const totalContainers = mockContainers.length;
    const runningContainers = mockContainers.filter(
      (c) => c.status === "running"
    ).length;
    const totalClients = mockClients.length;

    return {
      totalClients,
      totalContainers,
      runningContainers,
      totalCpuUsage:
        mockContainers.reduce((acc, c) => acc + (c.cpuUsage || 0), 0) /
          totalContainers || 0,
      totalMemoryUsage: mockContainers.reduce(
        (acc, c) => acc + (c.memoryUsage || 0),
        0
      ),
      totalNetworkTraffic: Math.random() * 1000,
      averageResponseTime: 120 + Math.random() * 50,
      systemUptime: 99.9,
    };
  },
};
