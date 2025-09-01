import { clientsApi } from "@/api/clients";
import type { Client } from "@/types/client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface CreateClientRequest {
  nome: string;
  dominio?: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Carregar clientes
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clientsApi.getClients();
      setClients(data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar cliente por ID
  const getClientById = useCallback(
    async (id: string): Promise<Client | null> => {
      try {
        return await clientsApi.getClientById(id);
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        return null;
      }
    },
    []
  );

  // Criar cliente
  const createClient = useCallback(async (data: CreateClientRequest) => {
    try {
      setActionLoading("creating");
      const newClient = await clientsApi.createClient(data);
      setClients((prev) => [...prev, newClient]);
      toast.success("Cliente criado com sucesso");
      return newClient;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      toast.error("Erro ao criar cliente");
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, []);

  // Atualizar cliente
  const updateClient = useCallback(
    async (id: string, data: Partial<Client>) => {
      try {
        setActionLoading(id);
        const updatedClient = await clientsApi.updateClient(id, data);
        setClients((prev) =>
          prev.map((c) => (c.id === id ? updatedClient : c))
        );
        toast.success("Cliente atualizado com sucesso");
        return updatedClient;
      } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        toast.error("Erro ao atualizar cliente");
        throw error;
      } finally {
        setActionLoading(null);
      }
    },
    []
  );

  // Deletar cliente
  const deleteClient = useCallback(async (id: string) => {
    try {
      setActionLoading(id);
      await clientsApi.deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast.success("Cliente removido com sucesso");
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      toast.error("Erro ao deletar cliente");
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, []);

  // Alternar status do cliente
  const toggleClientStatus = useCallback(
    async (id: string) => {
      try {
        const client = clients.find((c) => c.id === id);
        if (!client) return;

        const newStatus = client.status === "active" ? "inactive" : "active";
        await updateClient(id, { status: newStatus });
      } catch (error) {
        console.error("Erro ao alterar status:", error);
      }
    },
    [clients, updateClient]
  );

  // Carregar clientes ao montar o componente
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Estatísticas calculadas
  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "active").length,
    inactive: clients.filter((c) => c.status === "inactive").length,
    withContainers: clients.filter((c) => c.containers.length > 0).length,
  };

  return {
    clients,
    loading,
    actionLoading,
    stats,
    fetchClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    toggleClientStatus,
  };
};
