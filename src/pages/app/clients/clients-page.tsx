import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, Clock, Filter, Search, Users, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { ClientCard } from "@/components/custom/client-card";
import { CreateClientDialog } from "@/components/custom/create-client-dialog";
import { LoadingScreen } from "@/components/custom/loading-screen";

import { getClients } from "@/api/clients/get-clients";
import type { Client } from "@/types/client";
import { toast } from "sonner";

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Client["status"]>(
    "all"
  );

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const response = await getClients();
      setClients(response.clients);
      setFilteredClients(response.clients);
    } catch {
      toast.error("Erro ao carregar clientes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    let filtered = clients;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.dominio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter((client) => client.status === statusFilter);
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, statusFilter]);

  const handleStatusChange = (
    clientId: string,
    newStatus: Client["status"]
  ) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId
          ? {
              ...client,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : client
      )
    );
    toast.success(`Status do cliente alterado para ${newStatus}`);
  };

  const handleDelete = (clientId: string) => {
    setClients((prev) => prev.filter((client) => client.id !== clientId));
    toast.success("Cliente removido com sucesso");
  };

  const getStatusCount = (status: Client["status"]) => {
    return clients.filter((client) => client.status === status).length;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-100 dark:from-slate-950 dark:via-emerald-950 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Gestão de Clientes
              </h1>
              <p className="text-muted-foreground">
                Gerencie clientes e seus containers dedicados
              </p>
            </div>
          </div>
          <CreateClientDialog onClientCreated={loadClients} />
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total de Clientes
              </CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {clients.length}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Clientes cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-950 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Clientes Ativos
              </CardTitle>
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                {getStatusCount("active")}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                {((getStatusCount("active") / clients.length) * 100).toFixed(1)}
                % do total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Clientes Inativos
              </CardTitle>
              <div className="p-2 bg-orange-500 rounded-lg">
                <XCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                {getStatusCount("inactive")}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Necessitam atenção
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Pendentes
              </CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {getStatusCount("pending")}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Aguardando configuração
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: string) =>
              setStatusFilter(value as typeof statusFilter)
            }>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de clientes */}
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Nenhum cliente encontrado com os filtros aplicados."
                : "Nenhum cliente cadastrado ainda."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <CreateClientDialog onClientCreated={loadClients} />
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
