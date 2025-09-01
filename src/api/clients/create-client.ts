import type { Client } from "@/types/client";

export interface CreateClientProps {
  nome: string;
  dominio?: string;
}

export interface CreateClientResponse {
  id: string;
  message: string;
  client: Client;
}

function generateSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function createClient(
  data: CreateClientProps
): Promise<CreateClientResponse> {
  // Mock de criação
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newClient: Client = {
    id: Date.now().toString(),
    nome: data.nome,
    slug: generateSlug(data.nome),
    dominio: data.dominio,
    status: "pending",
    containers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    id: newClient.id,
    message: "Cliente criado com sucesso! Containers sendo provisionados...",
    client: newClient,
  };
}
