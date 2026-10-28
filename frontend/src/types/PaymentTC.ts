export interface PaymentTC {
  id: number;
  term: string;
  fulfilled: boolean;
  created_at: Date;
}

export interface NewOrderPaymentTC {
  term: string;
  fulfilled: boolean;
}
