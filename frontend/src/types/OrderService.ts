export interface OrderService {
  id: number;
  description: string;
  date: Date;
  created_at: Date;
}

export interface NewOrderService {
  description: string;
  date: Date;
}
