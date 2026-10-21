import { type Item } from "./Item.js";
import type { Material } from "./Material.js";
import type { Party } from "./Party.js";
import type { PaymentTC } from "./PaymentTC.js";

export interface Order {
  id: number;
  po_date: Date;
  hardware_installation_date: Date;
  hardware_installation_status: string;
  software_installation_date: Date;
  software_installation_status: string;
  status: string;
  created_at: Date;
  party: Party;
  items: Array<Item>;
  materials: Array<Material>;
  payment_tc: Array<PaymentTC>;
}
