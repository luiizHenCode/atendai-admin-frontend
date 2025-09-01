import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Container } from "@/types/container";
import {
  Clock,
  Copy,
  Download,
  FileText,
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

interface ContainerLogsDialogProps {
  container: Container | null;
  logs: string[];
  isOpen: boolean;
  onClose: () => void;
  onRefresh: (containerId: string) => void;
}

export function ContainerLogsDialog({
  container,
  logs,
  isOpen,
  onClose,
  onRefresh,
}: ContainerLogsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [logLevelFilter, setLogLevelFilter] = useState<string>("all");

  // Filtrar logs baseado na busca e nível
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    // Filtro por texto
    if (searchTerm) {
      filtered = filtered.filter((log) =>
        log.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por nível
    if (logLevelFilter !== "all") {
      filtered = filtered.filter((log) =>
        log.includes(`[${logLevelFilter.toUpperCase()}]`)
      );
    }

    return filtered;
  }, [logs, searchTerm, logLevelFilter]);

  const logCounts = useMemo(() => {
    const counts = {
      error: logs.filter((log) => log.includes("[ERROR]")).length,
      warn: logs.filter((log) => log.includes("[WARN]")).length,
      info: logs.filter((log) => log.includes("[INFO]")).length,
      debug: logs.filter((log) => log.includes("[DEBUG]")).length,
    };
    return counts;
  }, [logs]);

  if (!isOpen || !container) return null;

  const getLogLevelColor = (log: string) => {
    if (log.includes("[ERROR]")) return "text-red-400";
    if (log.includes("[WARN]")) return "text-yellow-400";
    if (log.includes("[INFO]")) return "text-blue-400";
    if (log.includes("[DEBUG]")) return "text-purple-400";
    return "text-green-400";
  };

  const getLogLevelBadge = (log: string) => {
    if (log.includes("[ERROR]")) return { label: "ERROR", color: "bg-red-500" };
    if (log.includes("[WARN]"))
      return { label: "WARN", color: "bg-yellow-500" };
    if (log.includes("[INFO]")) return { label: "INFO", color: "bg-blue-500" };
    if (log.includes("[DEBUG]"))
      return { label: "DEBUG", color: "bg-purple-500" };
    return null;
  };

  const formatTimestamp = () => {
    return new Date().toLocaleString("pt-BR");
  };

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(filteredLogs.join("\n"));
  };

  const handleDownloadLogs = () => {
    const blob = new Blob([filteredLogs.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${container.name}-logs-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/50 via-slate-900/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl max-h-[95vh] shadow-2xl border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
        {/* Header Moderno */}
        <CardHeader className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 border-b border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-slate-600 to-gray-600 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  Logs do Container
                </CardTitle>
                <CardDescription className="text-lg text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <span className="font-semibold">{container.name}</span>
                  <span className="mx-2">•</span>
                  <span>{container.clientName}</span>
                  <span className="mx-2">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{formatTimestamp()}</span>
                  </div>
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-600 shadow-md">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    container.status === "running"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                  {container.status}
                </span>
              </div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-10 w-10 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-full transition-all duration-200">
                <span className="text-lg">✕</span>
              </Button>
            </div>
          </div>

          {/* Barra de Filtros e Controles */}
          <div className="flex items-center justify-between mt-6 gap-4">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Pesquisar nos logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                />
              </div>

              {/* Level Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <select
                  value={logLevelFilter}
                  onChange={(e) => setLogLevelFilter(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm">
                  <option value="all">Todos os níveis</option>
                  <option value="error">ERROR ({logCounts.error})</option>
                  <option value="warn">WARN ({logCounts.warn})</option>
                  <option value="info">INFO ({logCounts.info})</option>
                  <option value="debug">DEBUG ({logCounts.debug})</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLogs}
                className="gap-2">
                <Copy className="h-4 w-4" />
                Copiar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadLogs}
                className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Terminal Container */}
          <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black border-l-4 border-slate-600 m-6 rounded-xl overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-gradient-to-r from-slate-800 to-gray-800 px-6 py-3 border-b border-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg"></div>
                </div>
                <span className="text-slate-300 text-sm font-mono">
                  docker logs {container.name}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>
                  {filteredLogs.length} / {logs.length} linhas
                </span>
                {searchTerm && (
                  <>
                    <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                    <span>Filtrado: "{searchTerm}"</span>
                  </>
                )}
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                <span>Live</span>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent font-mono text-sm">
              {filteredLogs.length > 0 ? (
                <div className="space-y-1">
                  {filteredLogs.map((log, index) => {
                    const badge = getLogLevelBadge(log);
                    return (
                      <div
                        key={index}
                        className="group hover:bg-slate-800/30 px-3 py-2 rounded-md transition-all duration-200 flex items-start gap-3">
                        {/* Line Number */}
                        <span className="text-slate-500 text-xs leading-6 w-12 text-right shrink-0 group-hover:text-slate-400">
                          {String(logs.indexOf(log) + 1).padStart(3, "0")}
                        </span>

                        {/* Badge Level */}
                        {badge && (
                          <div
                            className={`${badge.color} text-white text-xs px-2 py-0.5 rounded-md font-bold shrink-0 mt-0.5`}>
                            {badge.label}
                          </div>
                        )}

                        {/* Log Content */}
                        <span
                          className={`leading-6 ${getLogLevelColor(
                            log
                          )} group-hover:brightness-110 flex-1`}>
                          {log}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">
                    {searchTerm || logLevelFilter !== "all"
                      ? "Nenhum log encontrado com os filtros aplicados"
                      : "Nenhum log disponível"}
                  </p>
                  <p className="text-sm opacity-70">
                    {searchTerm || logLevelFilter !== "all"
                      ? "Tente ajustar os filtros ou limpar a pesquisa"
                      : "O container não possui logs no momento"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer com Estatísticas e Controles */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-850 dark:to-gray-850 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-6">
              {/* Live Indicator */}
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="font-medium">Live</span>
                <span className="text-slate-400">•</span>
                <span>{logs.length} entradas</span>
              </div>

              {/* Log Level Statistics */}
              <div className="flex items-center gap-4 text-xs">
                {logCounts.error > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-slate-500">
                      {logCounts.error} ERROR
                    </span>
                  </div>
                )}
                {logCounts.warn > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-slate-500">
                      {logCounts.warn} WARN
                    </span>
                  </div>
                )}
                {logCounts.info > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-500">
                      {logCounts.info} INFO
                    </span>
                  </div>
                )}
                {logCounts.debug > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-500">
                      {logCounts.debug} DEBUG
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRefresh(container.id)}
                className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>

              <Button
                onClick={onClose}
                className="gap-2 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
                Fechar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
