import type {
  AdvancedMetrics,
  Alert,
  ContainerDetailedMetrics,
  PerformanceMetrics,
} from "@/api/metrics";
import { metricsApi } from "@/api/metrics";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<AdvancedMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(
    null
  );

  // Carregar métricas avançadas
  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await metricsApi.getAdvancedMetrics();
      setMetrics(data);
    } catch (error) {
      console.error("Erro ao carregar métricas:", error);
      toast.error("Erro ao carregar métricas");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar alertas ativos
  const fetchAlerts = useCallback(async () => {
    try {
      const data = await metricsApi.getActiveAlerts();
      setAlerts(data);
    } catch (error) {
      console.error("Erro ao carregar alertas:", error);
    }
  }, []);

  // Carregar métricas de performance
  const fetchPerformance = useCallback(async () => {
    try {
      const data = await metricsApi.getPerformanceMetrics();
      setPerformance(data);
    } catch (error) {
      console.error("Erro ao carregar métricas de performance:", error);
    }
  }, []);

  // Buscar métricas de container específico
  const getContainerMetrics = useCallback(
    async (containerId: string): Promise<ContainerDetailedMetrics | null> => {
      try {
        return await metricsApi.getContainerMetrics(containerId);
      } catch (error) {
        console.error("Erro ao carregar métricas do container:", error);
        toast.error("Erro ao carregar métricas do container");
        return null;
      }
    },
    []
  );

  // Resolver alerta
  const resolveAlert = useCallback(async (alertId: string) => {
    try {
      const result = await metricsApi.resolveAlert(alertId);
      if (result.success) {
        setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
        toast.success("Alerta resolvido");
      } else {
        toast.error("Erro ao resolver alerta");
      }
    } catch (error) {
      console.error("Erro ao resolver alerta:", error);
      toast.error("Erro ao resolver alerta");
    }
  }, []);

  // Atualizar dados automaticamente
  const refreshAll = useCallback(async () => {
    await Promise.all([fetchMetrics(), fetchAlerts(), fetchPerformance()]);
  }, [fetchMetrics, fetchAlerts, fetchPerformance]);

  // Carregar dados iniciais
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAll();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshAll]);

  return {
    metrics,
    alerts,
    performance,
    loading,
    fetchMetrics,
    fetchAlerts,
    fetchPerformance,
    getContainerMetrics,
    resolveAlert,
    refreshAll,
  };
};
