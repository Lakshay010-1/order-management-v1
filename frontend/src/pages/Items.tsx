import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { Item } from "../types/Item.ts";
import {
  fetchItems,
  insertItem,
  removeItem,
  updateItem,
} from "../store/slices/itemsSlice";
import Loader from "../components/Loader";
import BasicTable from "../components/ItemsDatatable";
import { setHeaderContent } from "../store/slices/headerSlice";

export default function Items() {
  const fields = ["id", "item", "created_at"];
  const [itemsMsg, setItemsMsg] = useState("");
  const {
    items,
    loading: itemsLoading,
    error: itemsError,
  } = useAppSelector((state) => state.items);
  const dispatch = useAppDispatch();

  function handleAdd(newItemData: Item) {
    dispatch(insertItem(newItemData.item));
  }

  function handleUpdate(id: number, updatedData: Item) {
    dispatch(updateItem({ id, item: updatedData.item }));
  }

  function handleDelete(id: number) {
    dispatch(removeItem(id));
  }

  useEffect(() => {
    dispatch(setHeaderContent("Items"));
  }, []);

  useEffect(() => {
    if (!itemsLoading) {
      if (itemsError) {
        setItemsMsg(itemsError);
      } else if (items.length == 0) {
        setItemsMsg("Fetching Items");
        dispatch(fetchItems());
      }
    }
  }, [items, itemsLoading]);

  return itemsError ? (
    <h1>{itemsError}</h1>
  ) : itemsLoading ? (
    <Loader message={itemsMsg} />
  ) : (
    <BasicTable
      fields={fields}
      data={items}
      intialState={{
        item: "",
      }}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
      handleAdd={handleAdd}
    />
  );
}
