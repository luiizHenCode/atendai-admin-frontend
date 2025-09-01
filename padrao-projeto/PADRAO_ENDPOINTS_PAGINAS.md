# 🔄 Padrão de Uso de Endpoints nas Páginas

## Integração de APIs com React Query e Formulários

Esta documentação apresenta os padrões utilizados para integrar endpoints de API nas páginas da aplicação, utilizando TanStack Query (React Query) e React Hook Form.

---

## 📋 **Stack Tecnológica**

```typescript
// Principais bibliotecas utilizadas
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
```

---

## 📖 **Padrões por Tipo de Operação**

### **1. GET - Buscar Dados (useQuery)**

#### **Template Base**
```typescript
import { useQuery } from "@tanstack/react-query";
import { getResource } from "@/api/module/get-resource";

export function ResourcePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["resource"], // Chave única para cache
    queryFn: getResource,   // Função do endpoint
  });

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <div>
      {/* Renderizar dados */}
      {data?.items.map(item => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
}
```

#### **Exemplo Real - Lista de Filiais**
```typescript
// pages/app/branches/branches-page.tsx
import { useQuery } from "@tanstack/react-query";
import { getCompany } from "@/api/companies/get-company";

export function BranchesPage() {
  const fetch = useQuery({
    queryKey: ["get-branches"],
    queryFn: getCompany,
  });

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-4">
        {fetch.data?.filiais.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            onClick={() => navigate(`${branch.id}`)}
          />
        ))}
      </div>
    </PageWrapper>
  );
}
```

#### **Exemplo Real - Informações de Perfil**
```typescript
// pages/app/settings/profile/profile-info.tsx
import { useQuery } from "@tanstack/react-query";
import { getCompany } from "@/api/companies/get-company";

export function ProfileInfo() {
  const { data: companyData, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: getCompany,
  });

  if (isLoading) {
    return <SkeletonComponent />;
  }

  return (
    <div className="space-y-6">
      <h3>Nome: {companyData?.empresa.nome}</h3>
      <p>WhatsApp: {companyData?.empresa.whatsapp}</p>
    </div>
  );
}
```

---

### **2. POST/PUT/DELETE - Operações com Dados (useMutation)**

#### **Template Base**
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createResource } from "@/api/module/create-resource";

// 1. Schema de validação
const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

type FormType = z.infer<typeof formSchema>;

export function CreateResourceForm() {
  const queryClient = useQueryClient();

  // 2. Configuração do formulário
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
    },
  });

  // 3. Configuração da mutation
  const createMutation = useMutation({
    mutationFn: createResource,
    onSuccess: (response) => {
      // 4. Invalidar cache para atualizar listas
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      // 5. Feedback de sucesso
      console.log("Recurso criado com sucesso!");
      form.reset();
    },
    onError: (error) => {
      // 6. Tratamento de erro
      console.error("Erro ao criar recurso:", error);
      form.setError("root", { message: "Erro ao criar recurso." });
    },
  });

  // 7. Handler de submit
  const onSubmit = form.handleSubmit((data) => {
    createMutation.mutate(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        {/* Campos do formulário */}
        <Button 
          type="submit" 
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
```

#### **Exemplo Real - Login de Usuário**
```typescript
// pages/auth/sign-in/sign-in-form.tsx
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/api/auth/sign-in";

const signInForm = z.object({
  email: z.string().email("O e-mail deve ser válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type SignInFormType = z.infer<typeof signInForm>;

export function SignInForm() {
  const { onSignIn } = useAuth();

  const form = useForm<SignInFormType>({
    resolver: zodResolver(signInForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({ 
    mutationFn: signIn 
  });

  const onSubmit = form.handleSubmit((data) => {
    signInMutation.mutate(
      {
        usuario: data.email,
        senha: data.password,
      },
      {
        onSuccess: (response) => {
          onSignIn(response.token);
        },
        onError: (error) => {
          console.error("Erro ao fazer login:", error);
          form.setError("root", { message: "E-mail ou senha inválidos." });
        },
      }
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        {/* Campos do formulário */}
        <Button 
          type="submit" 
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? "Fazendo login..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
```

#### **Exemplo Real - Atualizar Perfil**
```typescript
// pages/app/settings/profile/update-profile-modal.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCompany } from "@/api/companies/update-company";

const profileFormSchema = z.object({
  companyName: z.string().min(1, "Nome da empresa é obrigatório"),
  whatsapp: z.string().min(1, "WhatsApp é obrigatório"),
});

type ProfileFormType = z.infer<typeof profileFormSchema>;

export function UpdateProfileModal() {
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      companyName: "",
      whatsapp: "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormType) => {
      return await updateCompany({
        nome: data.companyName,
        whatsapp: data.whatsapp,
      });
    },
    onSuccess: () => {
      console.log("Perfil atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["company"] });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Erro ao atualizar perfil:", error);
      form.setError("root", {
        message: "Erro ao atualizar perfil. Tente novamente.",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updateProfileMutation.mutate(data);
  });
}
```

---

## 🔧 **Padrões de Implementação**

### **1. Estrutura de um Componente com API**

```typescript
// Imports organizados por categoria
// 1. React e hooks principais
import { useState } from "react";

// 2. Bibliotecas de formulário e validação
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 3. React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// 4. APIs do projeto
import { getResource, updateResource } from "@/api/module";

// 5. Componentes UI
import { Button, Form, Input } from "@/components/ui";

// 6. Contextos e hooks customizados
import { useAuth } from "@/contexts/auth";

// Schema de validação
const schema = z.object({ /* campos */ });
type FormType = z.infer<typeof schema>;

export function ComponentName() {
  // 1. Estados locais
  const [isOpen, setIsOpen] = useState(false);
  
  // 2. Hooks de contexto
  const { user } = useAuth();
  
  // 3. Query client para invalidação de cache
  const queryClient = useQueryClient();
  
  // 4. Configuração do formulário
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { /* valores */ },
  });
  
  // 5. Queries (buscar dados)
  const { data, isLoading } = useQuery({
    queryKey: ["resource"],
    queryFn: getResource,
  });
  
  // 6. Mutations (operações)
  const mutation = useMutation({
    mutationFn: updateResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource"] });
    },
    onError: (error) => {
      form.setError("root", { message: "Erro na operação" });
    },
  });
  
  // 7. Handlers
  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });
  
  // 8. Renderização
  return (/* JSX */);
}
```

---

### **2. Gerenciamento de Estados de Loading**

#### **Para Queries (buscar dados)**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["resource"],
  queryFn: getResource,
});

// Loading
if (isLoading) {
  return (
    <div className="space-y-4">
      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
      <div className="h-5 w-40 bg-muted animate-pulse rounded" />
    </div>
  );
}

// Error
if (error) {
  return (
    <div className="text-red-500">
      Erro ao carregar dados: {error.message}
    </div>
  );
}

// Sucesso
return <div>{data?.content}</div>;
```

#### **Para Mutations (operações)**
```typescript
const mutation = useMutation({
  mutationFn: createResource,
});

return (
  <Button 
    type="submit" 
    disabled={mutation.isPending}
  >
    {mutation.isPending ? "Salvando..." : "Salvar"}
  </Button>
);
```

---

### **3. Invalidação de Cache**

#### **Invalidar consultas específicas**
```typescript
// Invalidar uma query específica
queryClient.invalidateQueries({ queryKey: ["company"] });

// Invalidar múltiplas queries relacionadas
queryClient.invalidateQueries({ 
  queryKey: ["branches"], 
  exact: false // Invalida todas as queries que começam com "branches"
});
```

#### **Atualizar cache diretamente**
```typescript
// Atualizar dados no cache sem nova requisição
mutation.mutate(data, {
  onSuccess: (response) => {
    queryClient.setQueryData(["company"], response);
  },
});
```

---

### **4. Tratamento de Erros**

#### **Erros em Formulários**
```typescript
const mutation = useMutation({
  mutationFn: updateResource,
  onError: (error) => {
    // Erro específico do campo
    if (error.field === "email") {
      form.setError("email", { message: "Email já existe" });
    } else {
      // Erro geral
      form.setError("root", { 
        message: "Erro ao salvar. Tente novamente." 
      });
    }
  },
});

// Exibir erro no JSX
{form.formState.errors.root && (
  <div className="text-red-500 text-sm">
    {form.formState.errors.root.message}
  </div>
)}
```

#### **Erros em Queries**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["resource"],
  queryFn: getResource,
  retry: 3, // Tentar novamente 3 vezes
  retryDelay: 1000, // Aguardar 1s entre tentativas
});

if (error) {
  return (
    <div className="p-4 border border-red-200 rounded-lg">
      <h3 className="text-red-600 font-medium">Erro ao carregar</h3>
      <p className="text-red-500 text-sm">{error.message}</p>
      <Button 
        onClick={() => queryClient.invalidateQueries({ queryKey: ["resource"] })}
        variant="outline"
        size="sm"
        className="mt-2"
      >
        Tentar novamente
      </Button>
    </div>
  );
}
```

---

### **5. Otimizações e Boas Práticas**

#### **Query Keys Organizadas**
```typescript
// Criar constantes para query keys
export const QUERY_KEYS = {
  COMPANY: ["company"],
  BRANCHES: ["branches"],
  BRANCH: (id: string) => ["branch", id],
  TEMPLATES: ["templates"],
  TEMPLATE: (id: string) => ["template", id],
} as const;

// Usar nas queries
const { data } = useQuery({
  queryKey: QUERY_KEYS.COMPANY,
  queryFn: getCompany,
});
```

#### **Queries Dependentes**
```typescript
// Query que depende de outra
const { data: user } = useQuery({
  queryKey: ["user"],
  queryFn: getUser,
});

const { data: permissions } = useQuery({
  queryKey: ["permissions", user?.id],
  queryFn: () => getPermissions(user.id),
  enabled: !!user?.id, // Só executa se tiver user.id
});
```

#### **Mutations Otimistas**
```typescript
const mutation = useMutation({
  mutationFn: updateResource,
  onMutate: async (newData) => {
    // Cancelar queries em andamento
    await queryClient.cancelQueries({ queryKey: ["resource"] });
    
    // Salvar estado anterior
    const previousData = queryClient.getQueryData(["resource"]);
    
    // Atualizar cache otimisticamente
    queryClient.setQueryData(["resource"], newData);
    
    return { previousData };
  },
  onError: (error, variables, context) => {
    // Reverter em caso de erro
    if (context?.previousData) {
      queryClient.setQueryData(["resource"], context.previousData);
    }
  },
  onSettled: () => {
    // Sempre invalidar no final
    queryClient.invalidateQueries({ queryKey: ["resource"] });
  },
});
```

---

## 📋 **Checklist de Implementação**

### **Para Queries (GET)**
- [ ] Query key única e descritiva
- [ ] Função de query tipada
- [ ] Loading state implementado
- [ ] Error handling implementado
- [ ] Retry configurado se necessário

### **Para Mutations (POST/PUT/DELETE)**
- [ ] Mutation function tipada
- [ ] onSuccess com invalidação de cache
- [ ] onError com tratamento adequado
- [ ] Loading state no botão/UI
- [ ] Reset do formulário após sucesso

### **Para Formulários**
- [ ] Schema Zod definido
- [ ] Tipos TypeScript inferidos
- [ ] Valores padrão configurados
- [ ] Validação de campos
- [ ] Tratamento de erros específicos

### **Geral**
- [ ] Imports organizados
- [ ] Estados de loading consistentes
- [ ] Error boundaries quando necessário
- [ ] Nomenclatura consistente
- [ ] Comentários em lógica complexa

---

## 🎯 **Exemplo Completo - CRUD de Recurso**

```typescript
// pages/resources/resource-form.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createResource, getResource, updateResource } from "@/api/resources";
import { Button, Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Dialog } from "@/components/ui";

const resourceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
});

type ResourceFormType = z.infer<typeof resourceSchema>;

interface ResourceFormProps {
  resourceId?: string;
  onSuccess?: () => void;
}

export function ResourceForm({ resourceId, onSuccess }: ResourceFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const isEdit = !!resourceId;

  // Query para buscar dados existentes (modo edição)
  const { data: existingResource, isLoading: isLoadingResource } = useQuery({
    queryKey: ["resource", resourceId],
    queryFn: () => getResource({ id: resourceId! }),
    enabled: isEdit,
  });

  // Configuração do formulário
  const form = useForm<ResourceFormType>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      name: existingResource?.name || "",
      description: existingResource?.description || "",
      category: existingResource?.category || "",
    },
  });

  // Atualizar valores quando dados chegarem
  useEffect(() => {
    if (existingResource) {
      form.reset({
        name: existingResource.name,
        description: existingResource.description,
        category: existingResource.category,
      });
    }
  }, [existingResource, form]);

  // Mutation para criar/atualizar
  const saveMutation = useMutation({
    mutationFn: async (data: ResourceFormType) => {
      if (isEdit) {
        return updateResource({ id: resourceId, ...data });
      } else {
        return createResource(data);
      }
    },
    onSuccess: (response) => {
      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      if (isEdit) {
        queryClient.invalidateQueries({ queryKey: ["resource", resourceId] });
      }
      
      // Feedback e reset
      console.log(`Recurso ${isEdit ? 'atualizado' : 'criado'} com sucesso!`);
      form.reset();
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      console.error(`Erro ao ${isEdit ? 'atualizar' : 'criar'} recurso:`, error);
      form.setError("root", {
        message: `Erro ao ${isEdit ? 'atualizar' : 'criar'} recurso. Tente novamente.`,
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    saveMutation.mutate(data);
  });

  if (isEdit && isLoadingResource) {
    return <div>Carregando...</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={isEdit ? "outline" : "default"}>
          {isEdit ? "Editar" : "Criar Recurso"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a descrição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="text-red-500 text-sm">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending 
                  ? `${isEdit ? 'Atualizando' : 'Criando'}...` 
                  : isEdit ? 'Atualizar' : 'Criar'
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---

*Esta documentação padroniza o uso de endpoints nas páginas, garantindo consistência, performance e manutenibilidade da aplicação.*
