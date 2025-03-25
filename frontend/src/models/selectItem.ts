export interface Product {
    id: string;
    name: string;
  }
  
export interface SelectedItem {
    product: Product;
    quantity: number;
    total: number;
  }