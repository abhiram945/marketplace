
export interface User {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  role: 'buyer' | 'vendor';
  password?: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  location: string;
  price: number;
  condition: string;
  minOrderQty: number;
  maxOrderQty: number;
  stockQty: number;
  imageUrl: string;
  description: string;
  features: string[];
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  productImageUrl: string;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  status: 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';
}

export interface NotificationSubscription {
  id: string;
  productId: string;
  productTitle: string;
  type: 'price' | 'stock';
  status: 'active' | 'inactive';
}

export interface CartItem extends Product {
    quantity: number;
}