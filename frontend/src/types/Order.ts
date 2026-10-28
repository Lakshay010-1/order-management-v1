import type { Material, NewMaterial } from "./Material.js";
import type { NewOrderService, OrderService } from "./OrderService.js";
import type { NewOrderPaymentTC, PaymentTC } from "./PaymentTC.js";

export interface Order_a {
  id: number;
  po_number: number;
  po_date: Date;
  po_type?: string;
  po_type_id: number;
  total_services: number;
  hardware_installation_date: Date;
  hardware_installation_expected_date: Date;
  hardware_installation_status: string;
  hardware_installation_status_id: number;
  software_installation_date: Date;
  software_installation_expected_date: Date;
  software_installation_status: string;
  software_installation_status_id: number;
  status?: string;
  status_id: number;
  party?: string;
  party_id: number;
}

export interface Order extends Order_a {
  materials: Array<Material>;
  payment_tcs: Array<PaymentTC>;
  services?: Array<OrderService>;
  created_at: Date;
}

export interface NewOrder_a {
  po_date: Date;
  po_number: number;
  po_type_id: number;
  total_services?: number;
  hardware_installation_date?: Date;
  software_installation_date?: Date;
  hardware_installation_expected_date: Date;
  software_installation_expected_date: Date;
  software_installation_status_id: number;
  hardware_installation_status_id: number;
  status_id: number;
  party_id: number;
}

export interface NewOrder_b extends NewOrder_a {
  materials: Array<NewMaterial>;
  payment_tcs: Array<NewOrderPaymentTC>;
  services?: Array<NewOrderService>;
}
