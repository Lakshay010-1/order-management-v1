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
import AlertDialog from "../components/AlertDialog.tsx";

export default function Items() {
  const fields = ["id", "item", "created_at"];
  const [itemsMsg, setItemsMsg] = useState("");
  const [orderDeleteId, setOrderDeleteId] = React.useState(-1);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogTitle, setdialogTitle] = React.useState("");
  const [dialogMsg, setdialogMsg] = React.useState("");
  const {
    items,
    loading: itemsLoading,
    error: itemsError,
    initialized: itemsInitialized,
  } = useAppSelector((state) => state.items);
  const dispatch = useAppDispatch();

  function handleAdd(newItemData: Item) {
    dispatch(insertItem(newItemData.item));
  }

  function handleUpdate(id: number, updatedData: Item) {
    dispatch(updateItem({ id, item: updatedData.item }));
  }

  function handleDecision(decision: boolean) {
    if (decision) {
      dispatch(removeItem(orderDeleteId));
    }
    setOpenDialog(false);
  }

  function handleDelete(id: number) {
    setOpenDialog(true);
    setOrderDeleteId(id);
    setdialogMsg(
      `Click \n 'DELETE' to proceed to delete item:${id}\nOR\n'CANCEL' to cancel the operation`,
    );
    setdialogTitle(`Delete Item:${id}`);
  }

  useEffect(() => {
    dispatch(setHeaderContent("Items"));
  }, []);

  useEffect(() => {
    if (!itemsLoading) {
      if (itemsError) {
        setItemsMsg(itemsError);
      } else if (!itemsInitialized) {
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
    <>
      <BasicTable
        fields={fields}
        data={items}
        requiredFields={{ item: true }}
        intialState={{
          item: "",
        }}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        handleAdd={handleAdd}
      />

      <AlertDialog
        open={openDialog}
        setDecision={handleDecision}
        message={dialogMsg}
        title={dialogTitle}
      />
    </>
  );
}
