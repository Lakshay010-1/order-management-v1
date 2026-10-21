import type { Item } from "./Item.js";

export interface OrderItem extends Item {
  quantity: number;
  date: Date;
}
