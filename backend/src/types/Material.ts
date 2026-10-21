export interface MaterialDispatch {
  id: number;
  quantity: number;
  date: Date;
}

export interface Material {
  id: number;
  item: string;
  quantity: number;
  date: Date;
  dispatch: Array<MaterialDispatch>;
  created_at: Date;
}
