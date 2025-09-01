import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createClient,
  type CreateClientProps,
} from "@/api/clients/create-client";
import { toast } from "sonner";

const createClientSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  dominio: z.string().optional(),
});

type CreateClientFormType = z.infer<typeof createClientSchema>;

interface CreateClientDialogProps {
  onClientCreated?: () => void;
}

export function CreateClientDialog({
  onClientCreated,
}: CreateClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateClientFormType>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      nome: "",
      dominio: "",
    },
  });

  const onSubmit = async (data: CreateClientFormType) => {
    try {
      setIsLoading(true);

      const payload: CreateClientProps = {
        nome: data.nome,
        ...(data.dominio && { dominio: data.dominio }),
      };

      const response = await createClient(payload);

      toast.success(response.message);
      setOpen(false);
      form.reset();
      onClientCreated?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao criar cliente";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Criar Novo Cliente</DialogTitle>
            <DialogDescription>
              Adicione um novo cliente ao sistema. Containers serão criados
              automaticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Empresa *</Label>
              <Input
                id="nome"
                placeholder="Ex: Empresa ABC Ltda"
                {...form.register("nome")}
              />
              {form.formState.errors.nome && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dominio">Domínio (opcional)</Label>
              <Input
                id="dominio"
                placeholder="Ex: empresa.com.br"
                {...form.register("dominio")}
              />
              {form.formState.errors.dominio && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.dominio.message}
                </p>
              )}
            </div>

            <div className="rounded-md bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                <strong>Criação automática:</strong>
                <br />
                • Container frontend (Nginx)
                <br />
                • Container backend (Node.js)
                <br />• Slug gerado automaticamente
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
