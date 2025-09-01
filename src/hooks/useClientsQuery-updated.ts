import { clientsApi } from "@/lib/api/clients";
import type { Client } from "@/types/container";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query Keys
export const clientsQueryKeys = {
  all: ["clients"] as const,
  lists: () => [...clientsQueryKeys.all, "list"] as const,
  list: (filters: string) =>
    [...clientsQueryKeys.lists(), { filters }] as const,
  details: () => [...clientsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...clientsQueryKeys.details(), id] as const,
  containers: (id: string) =>
    [...clientsQueryKeys.detail(id), "containers"] as const,
};

// Hook para listar clientes
export function useClients() {
  return useQuery({
    queryKey: clientsQueryKeys.lists(),
    queryFn: clientsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para buscar cliente específico
export function useClient(id: string) {
  return useQuery({
    queryKey: clientsQueryKeys.detail(id),
    queryFn: () => clientsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para buscar containers de um cliente
export function useClientContainers(clientId: string) {
  return useQuery({
    queryKey: clientsQueryKeys.containers(clientId),
    queryFn: () => clientsApi.getContainers(clientId),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para criar cliente
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Client, "id" | "createdAt" | "updatedAt">) =>
      clientsApi.create(data),
    onSuccess: (newClient) => {
      // Invalidar a lista de clientes para refetch
      queryClient.invalidateQueries({ queryKey: clientsQueryKeys.lists() });

      // Adicionar o novo cliente ao cache otimisticamente
      queryClient.setQueryData<Client[]>(clientsQueryKeys.lists(), (old) => {
        return old ? [...old, newClient] : [newClient];
      });

      toast.success(`Cliente "${newClient.name}" criado com sucesso!`);
    },
    onError: (error) => {
      console.error("Erro ao criar cliente:", error);
      toast.error("Erro ao criar cliente. Tente novamente.");
    },
  });
}

// Hook para atualizar cliente
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Client, "id" | "createdAt">>;
    }) => clientsApi.update(id, data),
    onSuccess: (updatedClient) => {
      // Atualizar o cache da lista
      queryClient.setQueryData<Client[]>(clientsQueryKeys.lists(), (old) => {
        return (
          old?.map((client) =>
            client.id === updatedClient.id ? updatedClient : client
          ) || []
        );
      });

      // Atualizar o cache do cliente específico
      queryClient.setQueryData(
        clientsQueryKeys.detail(updatedClient.id),
        updatedClient
      );

      toast.success(`Cliente "${updatedClient.name}" atualizado com sucesso!`);
    },
    onError: (error) => {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar cliente. Tente novamente.");
    },
  });
}

// Hook para alternar status do cliente (ativar/desativar)
export function useToggleClientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      clientsApi.update(id, { isActive }),
    onMutate: async ({ id, isActive }) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: clientsQueryKeys.lists() });

      // Snapshot do estado anterior
      const previousClients = queryClient.getQueryData<Client[]>(
        clientsQueryKeys.lists()
      );

      // Update otimista
      queryClient.setQueryData<Client[]>(clientsQueryKeys.lists(), (old) => {
        return (
          old?.map((client) =>
            client.id === id ? { ...client, isActive } : client
          ) || []
        );
      });

      return { previousClients };
    },
    onError: (error, _variables, context) => {
      // Reverter em caso de erro
      if (context?.previousClients) {
        queryClient.setQueryData(
          clientsQueryKeys.lists(),
          context.previousClients
        );
      }
      console.error("Erro ao alterar status do cliente:", error);
      toast.error("Erro ao alterar status do cliente.");
    },
    onSettled: () => {
      // Sempre refetch no final
      queryClient.invalidateQueries({ queryKey: clientsQueryKeys.lists() });
    },
    onSuccess: (updatedClient) => {
      const status = updatedClient.isActive ? "ativado" : "desativado";
      toast.success(`Cliente "${updatedClient.name}" ${status} com sucesso!`);
    },
  });
}

// Hook para deletar cliente
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsApi.delete(id),
    onMutate: async (id: string) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: clientsQueryKeys.lists() });

      // Snapshot do estado anterior
      const previousClients = queryClient.getQueryData<Client[]>(
        clientsQueryKeys.lists()
      );

      // Encontrar o cliente que será deletado para mostrar o nome
      const clientToDelete = previousClients?.find((c) => c.id === id);

      // Update otimista - remover da lista
      queryClient.setQueryData<Client[]>(clientsQueryKeys.lists(), (old) => {
        return old?.filter((client) => client.id !== id) || [];
      });

      return { previousClients, clientToDelete };
    },
    onError: (error, _id, context) => {
      // Reverter em caso de erro
      if (context?.previousClients) {
        queryClient.setQueryData(
          clientsQueryKeys.lists(),
          context.previousClients
        );
      }
      console.error("Erro ao deletar cliente:", error);
      toast.error("Erro ao deletar cliente.");
    },
    onSettled: () => {
      // Sempre refetch no final
      queryClient.invalidateQueries({ queryKey: clientsQueryKeys.lists() });
    },
    onSuccess: (_, _id, context) => {
      const clientName = context?.clientToDelete?.name || "Cliente";
      toast.success(`${clientName} deletado com sucesso!`);
    },
  });
}
