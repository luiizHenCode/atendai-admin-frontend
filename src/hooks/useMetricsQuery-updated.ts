import { metricsApi, type MetricsTimeRange } from "@/lib/api/metrics";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const metricsQueryKeys = {
  all: ["metrics"] as const,
  system: () => [...metricsQueryKeys.all, "system"] as const,
  clients: () => [...metricsQueryKeys.all, "clients"] as const,
  containers: () => [...metricsQueryKeys.all, "containers"] as const,
  summary: () => [...metricsQueryKeys.all, "summary"] as const,
  timeSeries: (metric: string, timeRange: MetricsTimeRange) =>
    [...metricsQueryKeys.all, "timeseries", metric, timeRange] as const,
  containerTimeSeries: (
    containerId: string,
    metric: string,
    timeRange: MetricsTimeRange
  ) =>
    [
      ...metricsQueryKeys.all,
      "container",
      containerId,
      "timeseries",
      metric,
      timeRange,
    ] as const,
};

// Hook para métricas do sistema
export function useSystemMetrics() {
  return useQuery({
    queryKey: metricsQueryKeys.system(),
    queryFn: metricsApi.getSystemMetrics,
    staleTime: 10 * 1000, // 10 segundos
    gcTime: 30 * 1000, // 30 segundos
    refetchInterval: 15 * 1000, // Refetch a cada 15 segundos para dados em tempo real
    retry: 3,
    retryDelay: 1000,
  });
}

// Hook para métricas dos clientes
export function useClientsMetrics() {
  return useQuery({
    queryKey: metricsQueryKeys.clients(),
    queryFn: metricsApi.getClientsMetrics,
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 30 * 1000, // Refetch a cada 30 segundos
    retry: 3,
    retryDelay: 1000,
  });
}

// Hook para métricas dos containers
export function useContainersMetrics() {
  return useQuery({
    queryKey: metricsQueryKeys.containers(),
    queryFn: metricsApi.getContainersMetrics,
    staleTime: 15 * 1000, // 15 segundos
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 20 * 1000, // Refetch a cada 20 segundos
    retry: 3,
    retryDelay: 1000,
  });
}

// Hook para resumo das métricas
export function useMetricsSummary() {
  return useQuery({
    queryKey: metricsQueryKeys.summary(),
    queryFn: metricsApi.getSummary,
    staleTime: 20 * 1000, // 20 segundos
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 30 * 1000, // Refetch a cada 30 segundos
    retry: 3,
    retryDelay: 1000,
  });
}

// Hook para série temporal de CPU
export function useCpuTimeSeries(timeRange: MetricsTimeRange) {
  return useQuery({
    queryKey: metricsQueryKeys.timeSeries("cpu", timeRange),
    queryFn: () => metricsApi.getCpuTimeSeries(timeRange),
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 60 * 1000, // Refetch a cada minuto
    retry: 2,
    retryDelay: 1000,
  });
}

// Hook para série temporal de memória
export function useMemoryTimeSeries(timeRange: MetricsTimeRange) {
  return useQuery({
    queryKey: metricsQueryKeys.timeSeries("memory", timeRange),
    queryFn: () => metricsApi.getMemoryTimeSeries(timeRange),
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 60 * 1000, // Refetch a cada minuto
    retry: 2,
    retryDelay: 1000,
  });
}

// Hook para série temporal de rede
export function useNetworkTimeSeries(timeRange: MetricsTimeRange) {
  return useQuery({
    queryKey: metricsQueryKeys.timeSeries("network", timeRange),
    queryFn: () => metricsApi.getNetworkTimeSeries(timeRange),
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 60 * 1000, // Refetch a cada minuto
    retry: 2,
    retryDelay: 1000,
  });
}

// Hook para série temporal de um container específico
export function useContainerTimeSeries(
  containerId: string,
  metric: "cpu" | "memory" | "network",
  timeRange: MetricsTimeRange
) {
  return useQuery({
    queryKey: metricsQueryKeys.containerTimeSeries(
      containerId,
      metric,
      timeRange
    ),
    queryFn: () =>
      metricsApi.getContainerTimeSeries(containerId, metric, timeRange),
    enabled: !!containerId,
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 60 * 1000, // Refetch a cada minuto
    retry: 2,
    retryDelay: 1000,
  });
}
