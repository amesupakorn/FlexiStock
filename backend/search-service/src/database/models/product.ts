import { Decimal } from "@prisma/client/runtime/library";

export interface products {
  id: string;
  name: string;
  description: string | null;
  price: string; 
  createdAt: Date;
}