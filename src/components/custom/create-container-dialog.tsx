import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/hooks/use-clients";
import type { Client } from "@/types/client";
import type { CreateContainerRequest } from "@/types/container";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code, Globe, Loader2, Server, Settings } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema de validação
const createContainerSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Nome deve conter apenas letras minúsculas, números e hífens"
    ),
  clientId: z.string().min(1, "Selecione um cliente"),
  type: z.enum(["frontend", "backend"]),
  technology: z.enum(["nginx", "nodejs", "python", "java", "go"]),
  port: z
    .number()
    .min(3000, "Porta deve ser maior que 3000")
    .max(65535, "Porta deve ser menor que 65535"),
  image: z.string().min(1, "Imagem é obrigatória"),
  tag: z.string().optional(),
  domain: z.string().optional(),
  environment: z.string().optional(),
});

type CreateContainerForm = z.infer<typeof createContainerSchema>;

interface CreateContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateContainerRequest) => Promise<void>;
  isLoading?: boolean;
}

// Templates predefinidos
interface ContainerTemplate {
  image: string;
  tag: string;
  internalPort: number;
  description: string;
}

const containerTemplates: {
  frontend: { nginx: ContainerTemplate };
  backend: {
    nodejs: ContainerTemplate;
    python: ContainerTemplate;
    java: ContainerTemplate;
    go: ContainerTemplate;
  };
} = {
  frontend: {
    nginx: {
      image: "nginx",
      tag: "alpine",
      internalPort: 80,
      description: "Servidor web Nginx otimizado",
    },
  },
  backend: {
    nodejs: {
      image: "node",
      tag: "18-alpine",
      internalPort: 3000,
      description: "Runtime Node.js moderno",
    },
    python: {
      image: "python",
      tag: "3.11-slim",
      internalPort: 8000,
      description: "Python com FastAPI/Django",
    },
    java: {
      image: "openjdk",
      tag: "11-jre-slim",
      internalPort: 8080,
      description: "Java Runtime Environment",
    },
    go: {
      image: "golang",
      tag: "alpine",
      internalPort: 8080,
      description: "Go runtime otimizado",
    },
  },
};

export const CreateContainerDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateContainerDialogProps) => {
  const { clients } = useClients();
  const [selectedTemplate, setSelectedTemplate] =
    useState<ContainerTemplate | null>(null);

  const form = useForm<CreateContainerForm>({
    resolver: zodResolver(createContainerSchema),
    defaultValues: {
      name: "",
      clientId: "",
      type: "frontend",
      technology: "nginx",
      port: 3000,
      image: "nginx",
      tag: "alpine",
      domain: "",
      environment: "",
    },
  });

  const watchedType = form.watch("type");
  const watchedClientId = form.watch("clientId");

  // Atualizar template quando tipo/tecnologia muda
  const handleTechnologyChange = (tech: CreateContainerForm["technology"]) => {
    form.setValue("technology", tech);

    let template: ContainerTemplate | null = null;

    if (watchedType === "frontend" && tech === "nginx") {
      template = containerTemplates.frontend.nginx;
    } else if (watchedType === "backend") {
      const backendTemplates = containerTemplates.backend;
      if (tech in backendTemplates) {
        template = backendTemplates[tech as keyof typeof backendTemplates];
      }
    }

    if (template) {
      setSelectedTemplate(template);
      form.setValue("image", template.image);
      form.setValue("tag", template.tag);

      // Auto-gerar nome baseado no cliente e tipo
      const client = clients.find((c: Client) => c.id === watchedClientId);
      if (client) {
        const baseName = `${client.slug}-${watchedType}`;
        form.setValue("name", baseName);
      }
    }
  };

  // Atualizar nome quando cliente muda
  const handleClientChange = (clientId: string) => {
    form.setValue("clientId", clientId);

    const client = clients.find((c: Client) => c.id === clientId);
    if (client) {
      const baseName = `${client.slug}-${watchedType}`;
      form.setValue("name", baseName);

      // Auto-gerar domínio se for frontend
      if (watchedType === "frontend") {
        form.setValue("domain", `${client.slug}.atendai.com`);
      }
    }
  };

  // Processar submissão
  const handleSubmit = async (data: CreateContainerForm) => {
    try {
      const environmentObj: Record<string, string> = {};

      // Processar variáveis de ambiente
      if (data.environment) {
        data.environment.split("\n").forEach((line) => {
          const [key, ...valueParts] = line.split("=");
          if (key && valueParts.length > 0) {
            environmentObj[key.trim()] = valueParts.join("=").trim();
          }
        });
      }

      const requestData: CreateContainerRequest = {
        name: data.name,
        clientId: data.clientId,
        type: data.type,
        port: data.port,
        image: data.image,
        tag: data.tag || "latest",
        domain: data.domain || undefined,
        environment:
          Object.keys(environmentObj).length > 0 ? environmentObj : undefined,
      };

      await onSubmit(requestData);

      // Resetar form
      form.reset();
      setSelectedTemplate(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao criar container:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Criar Novo Container
          </DialogTitle>
          <DialogDescription>
            Configure um novo container Docker para o cliente selecionado.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6">
            {/* Configuração Básica */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <h3 className="font-semibold">Configuração Básica</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={handleClientChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client: Client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Reset tecnologia quando tipo muda
                          const defaultTech =
                            value === "frontend" ? "nginx" : "nodejs";
                          handleTechnologyChange(defaultTech);
                        }}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="frontend">Frontend</SelectItem>
                          <SelectItem value="backend">Backend</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Container</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="cliente-frontend" />
                    </FormControl>
                    <FormDescription>
                      Apenas letras minúsculas, números e hífens
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Tecnologia */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <h3 className="font-semibold">Tecnologia</h3>
              </div>

              <FormField
                control={form.control}
                name="technology"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stack Tecnológico</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={handleTechnologyChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {watchedType === "frontend" ? (
                          <SelectItem value="nginx">Nginx</SelectItem>
                        ) : (
                          <>
                            <SelectItem value="nodejs">Node.js</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="go">Go</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Template Info */}
              {selectedTemplate && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Template</Badge>
                    <span className="text-sm font-medium">
                      {selectedTemplate.image}:{selectedTemplate.tag}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedTemplate.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem Docker</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="nginx" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="latest" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porta Externa</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Configuração de Rede */}
            {watchedType === "frontend" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <h3 className="font-semibold">Configuração de Rede</h3>
                </div>

                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domínio (Opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="cliente.atendai.com" />
                      </FormControl>
                      <FormDescription>
                        Domínio personalizado para acesso ao container
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Variáveis de Ambiente */}
            <div className="space-y-4">
              <h3 className="font-semibold">
                Variáveis de Ambiente (Opcional)
              </h3>

              <FormField
                control={form.control}
                name="environment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variáveis</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="NODE_ENV=production&#10;PORT=3000&#10;DATABASE_URL=postgresql://..."
                        className="min-h-[100px] font-mono text-sm"
                      />
                    </FormControl>
                    <FormDescription>
                      Uma variável por linha no formato: CHAVE=valor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Container
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
