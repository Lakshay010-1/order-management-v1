export interface MaterialDispatch {
  id?: number;
  material_id?: number;
  quantity: number;
  dispatch_date: Date;
  confirmation_date?: Date | undefined;
  delivered_by: number;
}

export interface Material {
  id: number;
  item: string;
  quantity: number;
  order_date: Date;
  purchase_date: Date;
  deliver_date: Date;
  dispatch: Array<MaterialDispatch>;
  created_at: Date;
}

export interface NewMaterial {
  item_id: number;
  quantity: number;
  order_date: Date;
  purchase_date?: Date;
  deliver_date?: Date;
}
