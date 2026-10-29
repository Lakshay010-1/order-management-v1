import type { Material, NewMaterial } from "./Material.js";
import type { PaymentTC } from "./PaymentTC.js";
import type { NewOrderService, OrderService } from "./Service.js";

export interface Order {
  id: number;
  po_number: number;
  po_date: Date;
  po_type: string;
  total_services: number;
  hardware_installation_date: Date;
  hardware_installation_expected_date: Date;
  hardware_installation_status: string;
  software_installation_date: Date;
  software_installation_expected_date: Date;
  software_installation_status: string;
  status: string;
  created_at: Date;
  party: string;
  materials: Array<Material>;
  payment_tcs: Array<PaymentTC>;
  services?: Array<OrderService>;
}

export interface NewOrder {
  po_number: number;
  po_date: Date;
  po_type_id: number;
  total_services: number | undefined;
  hardware_installation_date: Date | undefined;
  hardware_installation_expected_date: Date;
  hardware_installation_status_id: number;
  software_installation_date: Date | undefined;
  software_installation_expected_date: Date;
  software_installation_status_id: number;
  status_id: number;
  party_id: number;
  materials: Array<NewMaterial>;
  payment_tcs: Array<PaymentTC>;
  services?: Array<NewOrderService>;
}
