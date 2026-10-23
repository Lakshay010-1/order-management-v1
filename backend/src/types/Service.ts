export interface OrderService {
  id: number;
  description: string;
  date: Date;
}

export interface NewOrderService {
  description: string;
  date: Date;
}
