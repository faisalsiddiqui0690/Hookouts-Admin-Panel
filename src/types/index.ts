export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  rating?: number;
  status?: 'active' | 'banned' | 'inactive';
}

export interface Product {
  id: string;
  name: string;
  image?: string;
  rating?: number;
  orders?: number;
}

export interface Outlet {
  id: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  rating: number;
}

export interface Payment {
  id: string;
  date: string;
  paymentVia: string;
  status: 'Success' | 'Failed' | 'Pending';
  amount: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
}
