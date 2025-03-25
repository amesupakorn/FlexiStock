export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    createdAt: string;  // DateTime converted to string (ISO format)
    inventories: Inventory[];
  }
  
  export interface Inventory {
    id: string;
    warehouseId: string;
    productId: string;
    stock: number;
    minStock: number;
    maxStock: number;
    lastUpdated: string;  // DateTime converted to string (ISO format)
    warehouse: Warehouse;
    product: Product;
  }
  
  export interface Warehouse {
    id: string;
    name: string;
    location: string;
    capacity: number;
    inventories: Inventory[];
  }
  
  export interface Order {
    id: string;
    customerId: string;
    totalPrice: number;
    status: OrderStatus;
    createdAt: string;  // DateTime converted to string (ISO format)
    orderItems: OrderItem[];
    tracking: Tracking[];
  }
  
  export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    subtotal: number;
    product: Product;
    warehouse: Warehouse;
  }
  
  export interface Tracking {
    id: string;
    orderId: string;
    status: TrackingStatus;
    location?: string;
    updatedAt: string;  // DateTime converted to string (ISO format)
  }
  
  export interface Customer {
    id: string;
    name: string;
    email: string;
    orders: Order[];
  }
  
  export interface Alert {
    id: string;
    productId: string;
    warehouseId: string;
    type: AlertType;
    message: string;
    createdAt: string;  // DateTime converted to string (ISO format)
  }
  
  export enum OrderStatus {
    Pending = "Pending",
    Processing = "Processing",
    Shipped = "Shipped",
    Delivered = "Delivered",
    Cancelled = "Cancelled"
  }
  
  export enum TrackingStatus {
    Processing = "Processing", // เตรียมสินค้า
    InTransit = "InTransit",   // ระหว่างส่ง
    Delivered = "Delivered",   // ส่งเสร็จแล้ว
    Delayed = "Delayed"        // ล่าช้า
  }
  
  export enum AlertType {
    LowStock = "LowStock",
    OutOfStock = "OutOfStock"
  }


  