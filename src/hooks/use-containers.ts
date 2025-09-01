import { containersApi } from "@/api/containers";
import type {
  Container,
  ContainerAction,
  ContainerLogs,
  CreateContainerRequest,
} from "@/types/container";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useContainers = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Carregar containers
  const fetchContainers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await containersApi.getContainers();
      setContainers(data);
    } catch (error) {
      console.error("Erro ao carregar containers:", error);
      toast.error("Erro ao carregar containers");
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar containers por cliente
  const fetchContainersByClient = useCallback(async (clientId: string) => {
    try {
      setLoading(true);
      const data = await containersApi.getContainersByClient(clientId);
      setContainers(data);
    } catch (error) {
      console.error("Erro ao carregar containers do cliente:", error);
      toast.error("Erro ao carregar containers do cliente");
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar container
  const createContainer = useCallback(async (data: CreateContainerRequest) => {
    try {
      setActionLoading("creating");
      const newContainer = await containersApi.createContainer(data);
      setContainers((prev) => [...prev, newContainer]);
      toast.success("Container criado com sucesso");
      return newContainer;
    } catch (error) {
      console.error("Erro ao criar container:", error);
      toast.error("Erro ao criar container");
      throw error;
    } finally {
      setActionLoading(null);
    }
  }, []);

  // Executar ação no container
  const executeAction = useCallback(
    async (action: ContainerAction) => {
      try {
        setActionLoading(action.containerId);
        const result = await containersApi.executeAction(action);

        if (result.success) {
          if (action.action === "delete") {
            setContainers((prev) =>
              prev.filter((c) => c.id !== action.containerId)
            );
          } else {
            // Atualizar o container na lista
            await fetchContainers();
          }
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }

        return result;
      } catch (error) {
        console.error("Erro ao executar ação:", error);
        toast.error("Erro ao executar ação no container");
        throw error;
      } finally {
        setActionLoading(null);
      }
    },
    [fetchContainers]
  );

  // Buscar logs do container
  const getContainerLogs = useCallback(
    async (containerId: string): Promise<ContainerLogs | null> => {
      try {
        return await containersApi.getContainerLogs(containerId);
      } catch (error) {
        console.error("Erro ao buscar logs:", error);
        toast.error("Erro ao buscar logs do container");
        return null;
      }
    },
    []
  );

  // Atualizar estatísticas do container
  const refreshContainerStats = useCallback(async (containerId: string) => {
    try {
      const updatedContainer = await containersApi.getContainerStats(
        containerId
      );
      if (updatedContainer) {
        setContainers((prev) =>
          prev.map((c) => (c.id === containerId ? updatedContainer : c))
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar estatísticas:", error);
    }
  }, []);

  // Carregar containers ao montar o componente
  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  // Estatísticas calculadas
  const stats = {
    total: containers.length,
    running: containers.filter((c) => c.status === "running").length,
    stopped: containers.filter((c) => c.status === "stopped").length,
    error: containers.filter((c) => c.status === "error").length,
    pending: containers.filter((c) => c.status === "pending").length,
    healthy: containers.filter((c) => c.health === "healthy").length,
    unhealthy: containers.filter((c) => c.health === "unhealthy").length,
    avgCpu:
      containers.length > 0
        ? containers.reduce((acc, c) => acc + c.cpu, 0) / containers.length
        : 0,
    totalMemory: containers.reduce((acc, c) => acc + c.memory, 0),
    totalRestarts: containers.reduce((acc, c) => acc + c.restarts, 0),
  };

  return {
    containers,
    loading,
    actionLoading,
    stats,
    fetchContainers,
    fetchContainersByClient,
    createContainer,
    executeAction,
    getContainerLogs,
    refreshContainerStats,
  };
};
