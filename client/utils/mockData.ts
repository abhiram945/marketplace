
import { User, Product, Order, NotificationSubscription } from '../types';

// Add passwords for mock authentication
export const mockUsers: User[] = [
  { id: '1', fullName: 'Alice Buyer', email: 'buyer@example.com', password: 'Password123', companyName: 'BuyCorp', role: 'buyer' },
  { id: '2', fullName: 'Bob Vendor', email: 'vendor@example.com', password: 'Password123', companyName: 'SellCo', role: 'vendor' },
];

const productDetails = `
Warranty: 1 year manufacturing warranty.
Packaging: Branded box.
Condition: New factory sealed.
ETA: 2 days.
`;

export const mockProducts: Product[] = Array.from({ length: 24 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Industrial Widget ${i + 1}`,
  brand: `Brand ${String.fromCharCode(65 + (i % 5))}`,
  category: ['Electronics', 'Machinery', 'Tools', 'Safety Gear'][i % 4],
  location: ['New York', 'Los Angeles', 'Chicago', 'Houston'][i % 4],
  price: parseFloat((100 + Math.random() * 900).toFixed(2)),
  condition: 'New, factory sealed',
  minOrderQty: (i % 5 + 1) * 10,
  maxOrderQty: (i % 5 + 1) * 100,
  stockQty: Math.floor(Math.random() * 1000),
  imageUrl: `https://picsum.photos/seed/${i+1}/400/300`,
  description: `A high-quality industrial widget designed for durability and performance. Made from premium materials, it ensures reliability in the most demanding environments.\n\n${productDetails}`,
  features: ['Durable Construction', 'High-Precision Engineering', 'Easy Installation', 'Corrosion Resistant'],
}));

export const mockOrders: Order[] = [
  { id: 'o1', productId: '1', productTitle: 'Industrial Widget 1', productImageUrl: 'https://picsum.photos/seed/1/100/100', quantity: 50, totalPrice: 50 * mockProducts[0].price, orderDate: '2023-10-26', status: 'Completed' },
  { id: 'o2', productId: '3', productTitle: 'Industrial Widget 3', productImageUrl: 'https://picsum.photos/seed/3/100/100', quantity: 20, totalPrice: 20 * mockProducts[2].price, orderDate: '2023-10-28', status: 'Shipped' },
  { id: 'o3', productId: '5', productTitle: 'Industrial Widget 5', productImageUrl: 'https://picsum.photos/seed/5/100/100', quantity: 100, totalPrice: 100 * mockProducts[4].price, orderDate: '2023-11-01', status: 'Pending' },
];

export const mockNotifications: NotificationSubscription[] = [
  { id: 'n1', productId: '2', productTitle: 'Industrial Widget 2', type: 'price', status: 'active' },
  { id: 'n2', productId: '4', productTitle: 'Industrial Widget 4', type: 'stock', status: 'active' },
];