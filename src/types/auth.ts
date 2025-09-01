export interface User {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  role: "admin" | "operator";
  lastLogin?: string;
  createdAt: string;
}
