import type { Container } from "./container";

export interface Client {
  id: string;
  nome: string;
  slug: string;
  dominio?: string;
  status: "active" | "inactive" | "pending";
  containers: Container[];
  createdAt: string;
  updatedAt: string;
}
