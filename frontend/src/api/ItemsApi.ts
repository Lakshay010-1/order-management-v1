import type { Item } from "../types/Item";
import { API_LINK } from "./URLs";
import { deleteMethodCall } from "./method_calls/DeleteCall";
import { getMethodCall } from "./method_calls/GetCall";
import { postMethodCall } from "./method_calls/PostCall";
import { putMethodCall } from "./method_calls/PutCall";

const ITEMS_API_LINK = API_LINK + "/items";

const getItems: () => Promise<Array<Item>> = async () => {
  return getMethodCall<Array<Item>>(ITEMS_API_LINK);
};

const addItem: (item: string) => Promise<Item> = async (item) => {
  return postMethodCall<Item>(ITEMS_API_LINK, { item });
};

const deleteItem: (id: number) => Promise<boolean> = async (id) => {
  return deleteMethodCall(ITEMS_API_LINK + `/${id}`);
};

const putItem: (id: number, item: string) => Promise<boolean> = async (
  id,
  item,
) => {
  return putMethodCall(ITEMS_API_LINK + `/${id}`, { item });
};

export { getItems, addItem, deleteItem, putItem };
