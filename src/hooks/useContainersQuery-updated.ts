import {
  containersApi,
  type Container,
  type ContainerCreateData,
} from "@/lib/api/containers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query Keys
export const containersQueryKeys = {
  all: ["containers"] as const,
  lists: () => [...containersQueryKeys.all, "list"] as const,
  list: (filters: string) =>
    [...containersQueryKeys.lists(), { filters }] as const,
  details: () => [...containersQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...containersQueryKeys.details(), id] as const,
  logs: (id: string) => [...containersQueryKeys.detail(id), "logs"] as const,
  stats: (id: string) => [...containersQueryKeys.detail(id), "stats"] as const,
};

// Hook para listar containers
export function useContainers() {
  return useQuery({
    queryKey: containersQueryKeys.lists(),
    queryFn: containersApi.getAll,
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 10 * 1000, // Refetch a cada 10 segundos para dados em tempo real
  });
}

// Hook para buscar container específico
export function useContainer(id: string) {
  return useQuery({
    queryKey: containersQueryKeys.detail(id),
    queryFn: () => containersApi.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchInterval: 5 * 1000, // Atualizar mais frequentemente para dados individuais
  });
}

// Hook para buscar logs do container
export function useContainerLogs(id: string) {
  return useQuery({
    queryKey: containersQueryKeys.logs(id),
    queryFn: () => containersApi.getLogs(id),
    enabled: !!id,
    staleTime: 10 * 1000, // 10 segundos
    refetchInterval: 5 * 1000, // Logs mudam frequentemente
  });
}

// Hook para buscar estatísticas do container
export function useContainerStats(id: string) {
  return useQuery({
    queryKey: containersQueryKeys.stats(id),
    queryFn: () => containersApi.getStats(id),
    enabled: !!id,
    staleTime: 5 * 1000, // 5 segundos
    refetchInterval: 2 * 1000, // Stats precisam ser muito atualizadas
  });
}

// Hook para criar container
export function useCreateContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContainerCreateData) => containersApi.create(data),
    onSuccess: (newContainer) => {
      // Invalidar a lista de containers
      queryClient.invalidateQueries({ queryKey: containersQueryKeys.lists() });

      // Adicionar o novo container ao cache otimisticamente
      queryClient.setQueryData<Container[]>(
        containersQueryKeys.lists(),
        (old) => {
          return old ? [...old, newContainer] : [newContainer];
        }
      );

      toast.success(`Container "${newContainer.name}" criado com sucesso!`);
    },
    onError: (error) => {
      console.error("Erro ao criar container:", error);
      toast.error("Erro ao criar container. Tente novamente.");
    },
  });
}

// Hook para iniciar container
export function useStartContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => containersApi.start(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: containersQueryKeys.lists(),
      });

      const previousContainers = queryClient.getQueryData<Container[]>(
        containersQueryKeys.lists()
      );

      // Update otimista
      queryClient.setQueryData<Container[]>(
        containersQueryKeys.lists(),
        (old) => {
          return (
            old?.map((container) =>
              container.id === id
                ? { ...container, status: "starting" as const }
                : container
            ) || []
          );
        }
      );

      return { previousContainers };
    },
    onError: (error, _id, context) => {
      if (context?.previousContainers) {
        queryClient.setQueryData(
          containersQueryKeys.lists(),
          context.previousContainers
        );
      }
      console.error("Erro ao iniciar container:", error);
      toast.error("Erro ao iniciar container.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: containersQueryKeys.lists() });
    },
    onSuccess: (updatedContainer) => {
      toast.success(
        `Container "${updatedContainer.name}" iniciado com sucesso!`
      );
    },
  });
}

// Hook para parar container
export function useStopContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => containersApi.stop(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: containersQueryKeys.lists(),
      });

      const previousContainers = queryClient.getQueryData<Container[]>(
        containersQueryKeys.lists()
      );

      // Update otimista
      queryClient.setQueryData<Container[]>(
        containersQueryKeys.lists(),
        (old) => {
          return (
            old?.map((container) =>
              container.id === id
                ? { ...container, status: "stopping" as const }
                : container
            ) || []
          );
        }
      );

      return { previousContainers };
    },
    onError: (error, _id, context) => {
      if (context?.previousContainers) {
        queryClient.setQueryData(
          containersQueryKeys.lists(),
          context.previousContainers
        );
      }
      console.error("Erro ao parar container:", error);
      toast.error("Erro ao parar container.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: containersQueryKeys.lists() });
    },
    onSuccess: (updatedContainer) => {
      toast.success(`Container "${updatedContainer.name}" parado com sucesso!`);
    },
  });
}

// Hook para reiniciar container
export function useRestartContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => containersApi.restart(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: containersQueryKeys.lists(),
      });

      const previousContainers = queryClient.getQueryData<Container[]>(
        containersQueryKeys.lists()
      );

      // Update otimista
      queryClient.setQueryData<Container[]>(
        containersQueryKeys.lists(),
        (old) => {
          return (
            old?.map((container) =>
              container.id === id
                ? { ...container, status: "stopping" as const }
                : container
            ) || []
          );
        }
      );

      return { previousContainers };
    },
    onError: (error, _id, context) => {
      if (context?.previousContainers) {
        queryClient.setQueryData(
          containersQueryKeys.lists(),
          context.previousContainers
        );
      }
      console.error("Erro ao reiniciar container:", error);
      toast.error("Erro ao reiniciar container.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: containersQueryKeys.lists() });
    },
    onSuccess: (updatedContainer) => {
      toast.success(
        `Container "${updatedContainer.name}" reiniciado com sucesso!`
      );
    },
  });
}

// Hook para deletar container
export function useDeleteContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => containersApi.delete(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: containersQueryKeys.lists(),
      });

      const previousContainers = queryClient.getQueryData<Container[]>(
        containersQueryKeys.lists()
      );
      const containerToDelete = previousContainers?.find((c) => c.id === id);

      // Update otimista - remover da lista
      queryClient.setQueryData<Container[]>(
        containersQueryKeys.lists(),
        (old) => {
          return old?.filter((container) => container.id !== id) || [];
        }
      );

      return { previousContainers, containerToDelete };
    },
    onError: (error, _id, context) => {
      if (context?.previousContainers) {
        queryClient.setQueryData(
          containersQueryKeys.lists(),
          context.previousContainers
        );
      }
      console.error("Erro ao deletar container:", error);
      toast.error("Erro ao deletar container.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: containersQueryKeys.lists() });
    },
    onSuccess: (_, _id, context) => {
      const containerName = context?.containerToDelete?.name || "Container";
      toast.success(`${containerName} deletado com sucesso!`);
    },
  });
}
