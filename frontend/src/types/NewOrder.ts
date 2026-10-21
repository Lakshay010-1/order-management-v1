export interface NewOrder {
  po_date: Date;
  hardware_installation_date: Date;
  software_installation_date: Date;
  software_installation_status_id: number;
  hardware_installation_status_id: number;
  status_id: number;
  party_id: number;
  materials: Array<{ item_id: number; quantity: number; date: Date }>;
  items: Array<{ item_id: number; quantity: number; date: Date }>;
  payment_tcs: Array<{ term: string; fulfilled: boolean }>;
}
