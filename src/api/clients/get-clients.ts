import type { Client } from "@/types/client";

export interface GetClientsResponse {
  clients: Client[];
  total: number;
}

export async function getClients(): Promise<GetClientsResponse> {
  // Mock de dados
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockClients: Client[] = [
    {
      id: "1",
      nome: "Empresa ABC Ltda",
      slug: "empresa-abc-ltda",
      dominio: "abc.com.br",
      status: "active",
      containers: [],
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T14:45:00Z",
    },
    {
      id: "2",
      nome: "TechCorp Solutions",
      slug: "techcorp-solutions",
      dominio: "techcorp.io",
      status: "active",
      containers: [],
      createdAt: "2024-01-10T09:15:00Z",
      updatedAt: "2024-01-18T16:20:00Z",
    },
    {
      id: "3",
      nome: "StartupXYZ",
      slug: "startup-xyz",
      status: "pending",
      containers: [],
      createdAt: "2024-01-25T11:00:00Z",
      updatedAt: "2024-01-25T11:00:00Z",
    },
    {
      id: "4",
      nome: "Digital Agency Pro",
      slug: "digital-agency-pro",
      dominio: "dagency.com",
      status: "inactive",
      containers: [],
      createdAt: "2023-12-20T15:30:00Z",
      updatedAt: "2024-01-05T10:15:00Z",
    },
  ];

  return {
    clients: mockClients,
    total: mockClients.length,
  };
}
