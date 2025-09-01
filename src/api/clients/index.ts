import type { Client } from "@/types/client";

// Mock data para clientes
const mockClients: Client[] = [
  {
    id: "client_001",
    nome: "TechCorp Ltda",
    slug: "techcorp",
    dominio: "techcorp.atendai.com",
    status: "active",
    containers: [],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "client_002",
    nome: "InnovaTech Solutions",
    slug: "innovatech",
    dominio: "innovatech.atendai.com",
    status: "active",
    containers: [],
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "client_003",
    nome: "DigitalSys Inc",
    slug: "digitalsys",
    status: "pending",
    containers: [],
    createdAt: "2024-01-21T08:00:00Z",
    updatedAt: "2024-01-21T08:00:00Z",
  },
  {
    id: "client_004",
    nome: "CloudTech Pro",
    slug: "cloudtech",
    dominio: "cloudtech.atendai.com",
    status: "active",
    containers: [],
    createdAt: "2024-01-18T12:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z",
  },
];

// Simulação de delay para requisições
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const clientsApi = {
  // Listar todos os clientes
  async getClients(): Promise<Client[]> {
    await delay(500);
    return [...mockClients];
  },

  // Buscar cliente por ID
  async getClientById(id: string): Promise<Client | null> {
    await delay(300);
    return mockClients.find((client) => client.id === id) || null;
  },

  // Criar novo cliente
  async createClient(data: {
    nome: string;
    dominio?: string;
  }): Promise<Client> {
    await delay(800);

    // Gerar slug baseado no nome
    const slug = data.nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^a-z0-9\s]/g, "") // Remove caracteres especiais
      .replace(/\s+/g, "-") // Substitui espaços por hífens
      .replace(/-+/g, "-") // Remove hífens duplicados
      .replace(/^-|-$/g, ""); // Remove hífens do início e fim

    const newClient: Client = {
      id: `client_${Date.now()}`,
      nome: data.nome,
      slug,
      dominio: data.dominio,
      status: "pending",
      containers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockClients.push(newClient);
    return newClient;
  },

  // Atualizar cliente
  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    await delay(600);

    const clientIndex = mockClients.findIndex((c) => c.id === id);
    if (clientIndex === -1) {
      throw new Error("Cliente não encontrado");
    }

    const updatedClient = {
      ...mockClients[clientIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockClients[clientIndex] = updatedClient;
    return updatedClient;
  },

  // Deletar cliente
  async deleteClient(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    await delay(500);

    const clientIndex = mockClients.findIndex((c) => c.id === id);
    if (clientIndex === -1) {
      return { success: false, message: "Cliente não encontrado" };
    }

    // Verificar se o cliente tem containers
    const client = mockClients[clientIndex];
    if (client.containers.length > 0) {
      return {
        success: false,
        message: "Não é possível remover cliente com containers ativos",
      };
    }

    mockClients.splice(clientIndex, 1);
    return { success: true, message: "Cliente removido com sucesso" };
  },

  // Buscar clientes por status
  async getClientsByStatus(status: Client["status"]): Promise<Client[]> {
    await delay(400);
    return mockClients.filter((client) => client.status === status);
  },

  // Buscar estatísticas de clientes
  async getClientStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
    withContainers: number;
  }> {
    await delay(300);

    return {
      total: mockClients.length,
      active: mockClients.filter((c) => c.status === "active").length,
      inactive: mockClients.filter((c) => c.status === "inactive").length,
      pending: mockClients.filter((c) => c.status === "pending").length,
      withContainers: mockClients.filter((c) => c.containers.length > 0).length,
    };
  },
};
