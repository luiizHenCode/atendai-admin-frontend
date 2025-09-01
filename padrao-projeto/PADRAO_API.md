# 🌐 Padrão de Organização da Pasta `/api`

## Estrutura e Convenções para Camada de Comunicação com APIs

Esta documentação define os padrões de organização da pasta `/api` e as convenções utilizadas para estruturar arquivos de comunicação com endpoints.

---

## 📁 **Estrutura de Organização**

### **Organização por Contexto Funcional**

```
src/api/
├── auth/                    # Autenticação e autorização
│   ├── sign-in.ts          # POST /login - Login do usuário
│   ├── sign-up.ts          # POST /register - Registro de usuário
│   ├── forgot-password.ts  # POST /forgot-password - Recuperação de senha
│   └── refresh-token.ts    # POST /refresh - Renovação de token
├── users/                   # Gestão de usuários
│   ├── get-profile.ts      # GET /user/profile - Buscar perfil
│   ├── update-profile.ts   # PUT /user/profile - Atualizar perfil
│   └── delete-account.ts   # DELETE /user/account - Excluir conta
├── companies/              # Gestão de empresas
│   ├── get-company.ts      # GET /company - Buscar empresa
│   ├── update-company.ts   # PUT /company - Atualizar empresa
│   └── create-company.ts   # POST /company - Criar empresa
├── products/               # Gestão de produtos/serviços
│   ├── get-products.ts     # GET /products - Listar produtos
│   ├── get-product.ts      # GET /products/:id - Buscar produto
│   ├── create-product.ts   # POST /products - Criar produto
│   ├── update-product.ts   # PUT /products/:id - Atualizar produto
│   └── delete-product.ts   # DELETE /products/:id - Excluir produto
└── helpers/                # Utilitários e endpoints auxiliares
    ├── get-address-by-cep.ts # GET /cep/:cep - Buscar endereço por CEP
    ├── upload-file.ts      # POST /upload - Upload de arquivos
    └── send-notification.ts # POST /notifications - Enviar notificação
```

---

## 📝 **Convenções de Nomenclatura**

### **Padrão de Nomes de Arquivos**

| Operação | Padrão | Exemplo |
|----------|--------|---------|
| **Buscar único** | `get-{resource}.ts` | `get-user.ts` |
| **Buscar lista** | `get-{resources}.ts` | `get-users.ts` |
| **Criar** | `create-{resource}.ts` | `create-user.ts` |
| **Atualizar** | `update-{resource}.ts` | `update-user.ts` |
| **Excluir** | `delete-{resource}.ts` | `delete-user.ts` |
| **Ações específicas** | `{action}-{resource}.ts` | `activate-user.ts` |

### **Padrão para Ações Específicas**

```
# Exemplos de ações específicas
redeem-ticket.ts        # Resgatar ticket
activate-account.ts     # Ativar conta
reset-password.ts       # Resetar senha
send-invitation.ts      # Enviar convite
approve-request.ts      # Aprovar solicitação
```

---

## 🏗️ **Estrutura Interna dos Arquivos**

### **Template Padrão**

```typescript
// 1. Imports
import { getAPI } from "@/utils/get-api";
import { clearString } from "@/utils/clear-string";

// 2. Interface de Props (dados de entrada)
export interface CreateUserProps {
  nome: string;
  email: string;
  telefone: string;
  documento?: string; // Opcional
}

// 3. Interface de Response (dados de retorno)
export interface CreateUserResponse {
  id: string;
  message: string;
  user: {
    nome: string;
    email: string;
  };
}

// 4. Função principal
export async function createUser(
  data: CreateUserProps
): Promise<CreateUserResponse> {
  // 5. Obter instância da API
  const { api } = getAPI();

  // 6. Tratamento de dados (se necessário)
  if (data.documento) {
    data.documento = clearString(data.documento);
  }

  // 7. Chamada HTTP
  const response = await api.post<CreateUserResponse>(
    "/users",
    data
  );

  // 8. Retorno dos dados
  return response.data;
}
```

---

## 🔧 **Padrões por Tipo de Operação**

### **1. GET - Buscar Dados**

```typescript
// get-users.ts
import { getAPI } from "@/utils/get-api";

export interface User {
  id: string;
  nome: string;
  email: string;
  status: "active" | "inactive";
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
}

export async function getUsers(): Promise<GetUsersResponse> {
  const { api } = getAPI();
  const response = await api.get<GetUsersResponse>("/users");
  return response.data;
}
```

### **2. GET com Parâmetros**

```typescript
// get-user.ts
import { getAPI } from "@/utils/get-api";

export interface GetUserProps {
  id: string;
}

export interface GetUserResponse {
  id: string;
  nome: string;
  email: string;
  createdAt: string;
}

export async function getUser({ id }: GetUserProps): Promise<GetUserResponse> {
  const { api } = getAPI();
  const response = await api.get<GetUserResponse>(`/users/${id}`);
  return response.data;
}
```

### **3. POST - Criar Dados**

```typescript
// create-user.ts
import { getAPI } from "@/utils/get-api";
import { clearString } from "@/utils/clear-string";

export interface CreateUserProps {
  nome: string;
  email: string;
  telefone: string;
  documento?: string;
}

export interface CreateUserResponse {
  id: string;
  message: string;
}

export async function createUser(
  data: CreateUserProps
): Promise<CreateUserResponse> {
  const { api } = getAPI();

  // Tratamento de dados
  if (data.documento) {
    data.documento = clearString(data.documento);
  }
  data.telefone = clearString(data.telefone);

  const response = await api.post<CreateUserResponse>("/users", data);
  return response.data;
}
```

### **4. PUT/PATCH - Atualizar Dados**

```typescript
// update-user.ts
import { getAPI } from "@/utils/get-api";

export interface UpdateUserProps {
  id: string;
  nome?: string;
  email?: string;
  telefone?: string;
}

export interface UpdateUserResponse {
  message: string;
  user: {
    id: string;
    nome: string;
    email: string;
  };
}

export async function updateUser(
  data: UpdateUserProps
): Promise<UpdateUserResponse> {
  const { api } = getAPI();
  
  const { id, ...updateData } = data;
  
  const response = await api.put<UpdateUserResponse>(
    `/users/${id}`,
    updateData
  );
  
  return response.data;
}
```

### **5. DELETE - Excluir Dados**

```typescript
// delete-user.ts
import { getAPI } from "@/utils/get-api";

export interface DeleteUserProps {
  id: string;
}

export interface DeleteUserResponse {
  message: string;
}

export async function deleteUser({
  id
}: DeleteUserProps): Promise<DeleteUserResponse> {
  const { api } = getAPI();
  const response = await api.delete<DeleteUserResponse>(`/users/${id}`);
  return response.data;
}
```

---

## 🎯 **Convenções de Interfaces**

### **Nomenclatura de Interfaces**

```typescript
// Props (dados de entrada)
export interface CreateUserProps { }
export interface UpdateUserProps { }
export interface GetUserProps { }

// Response (dados de retorno)
export interface CreateUserResponse { }
export interface UpdateUserResponse { }
export interface GetUserResponse { }

// Entidades (modelos de dados)
export interface User { }
export interface Product { }
export interface Order { }
```

### **Propriedades Opcionais**

```typescript
export interface UpdateUserProps {
  id: string;           // Obrigatório
  nome?: string;        // Opcional
  email?: string;       // Opcional
  telefone?: string;    // Opcional
}
```

---

## 🛠️ **Tratamento de Dados**

### **Limpeza de Strings**

```typescript
import { clearString } from "@/utils/clear-string";

// Antes de enviar
data.documento = clearString(data.documento); // Remove máscaras
data.telefone = clearString(data.telefone);   // Remove formatação
data.cep = clearString(data.cep);             // Remove hífen
```

### **Validação de Dados**

```typescript
// Validação básica antes do envio
if (!data.email || !data.nome) {
  throw new Error("Campos obrigatórios não preenchidos");
}

// Validação de formato
if (!data.email.includes("@")) {
  throw new Error("Email inválido");
}
```

---

## 🔐 **Autenticação e Headers**

### **Configuração Automática via getAPI**

```typescript
// utils/get-api.ts
export function getAPI() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  
  const api = axios.create({
    baseURL: "https://api.exemplo.com.br/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return { api };
}
```

### **Headers Customizados**

```typescript
// Para endpoints específicos
export async function uploadFile(file: File): Promise<UploadResponse> {
  const { api } = getAPI();
  
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadResponse>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
```

---

## 📊 **Padrões de Response**

### **Response de Sucesso**

```typescript
// Operações de criação
{
  "id": "uuid",
  "message": "Usuário criado com sucesso"
}

// Operações de listagem
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}

// Operações de atualização
{
  "message": "Usuário atualizado com sucesso",
  "data": { ... }
}
```

### **Tratamento de Errors**

```typescript
// Interceptador de erros (configurar no getAPI)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect para login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---

## ✅ **Checklist de Boas Práticas**

### **Arquivo API**
- [ ] Nome do arquivo segue convenção (verbo-recurso.ts)
- [ ] Interfaces exportadas com nomes padronizados
- [ ] Função principal exportada
- [ ] Tipagem completa (Props e Response)
- [ ] Tratamento de dados quando necessário
- [ ] Documentação de endpoint no comentário

### **Interfaces**
- [ ] Props para dados de entrada
- [ ] Response para dados de retorno
- [ ] Propriedades opcionais marcadas com `?`
- [ ] Tipos específicos (não `any`)

### **Função**
- [ ] Async/await para promises
- [ ] Tipagem do retorno
- [ ] Uso do getAPI() para autenticação
- [ ] Tratamento de dados antes do envio
- [ ] Retorno de response.data

---

## 📂 **Exemplo Completo**

```typescript
// src/api/products/create-product.ts
import { getAPI } from "@/utils/get-api";
import { clearString } from "@/utils/clear-string";

/**
 * Cria um novo produto no sistema
 * Endpoint: POST /products
 */

export interface CreateProductProps {
  nome: string;
  descricao: string;
  preco: number;
  categoria_id: string;
  codigo?: string; // Código opcional
}

export interface CreateProductResponse {
  id: string;
  message: string;
  product: {
    id: string;
    nome: string;
    codigo: string;
  };
}

export async function createProduct(
  data: CreateProductProps
): Promise<CreateProductResponse> {
  const { api } = getAPI();

  // Tratamento de dados
  if (data.codigo) {
    data.codigo = clearString(data.codigo);
  }

  // Validação básica
  if (!data.nome || !data.preco) {
    throw new Error("Nome e preço são obrigatórios");
  }

  const response = await api.post<CreateProductResponse>(
    "/products",
    data
  );

  return response.data;
}
```

---

*Esta estrutura garante consistência, manutenibilidade e facilita a evolução da camada de API do projeto.*
