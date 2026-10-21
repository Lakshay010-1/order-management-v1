import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Item } from "../../types/Item";
import { addItem, deleteItem, getItems, putItem } from "../../api/ItemsApi";
import { addData, deleteData, updateData } from "../../utils/handleArrayData";

interface itemsState {
  items: Array<Item>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const itemsInitialState: itemsState = {
  items: [],
  loading: false,
  error: null,
  initialized: false,
};

export const fetchItems = createAsyncThunk("items/fetchItems", async () => {
  return await getItems();
});

export const insertItem = createAsyncThunk(
  "items/insertItem",
  async (item: string) => {
    return await addItem(item);
  },
);

export const updateItem = createAsyncThunk(
  "items/updateItem",
  async ({ id, item }: { id: number; item: string }) => {
    return await putItem(id, item);
  },
);

export const removeItem = createAsyncThunk(
  "items/removeItem",
  async (id: number) => {
    return await deleteItem(id);
  },
);

const itemsSlice = createSlice({
  name: "items",
  initialState: itemsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.initialized = true;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong fetching items";
        state.loading = false;
      })
      // insert items
      .addCase(insertItem.pending, (state) => {
        state.error = null;
      })
      .addCase(insertItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = addData(action.payload, state.items);
      })
      .addCase(insertItem.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong inserting item";
        state.loading = false;
      })
      // update items
      .addCase(updateItem.pending, (state) => {
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = updateData(
          action.meta.arg.id,
          { item: action.meta.arg.item },
          state.items,
        );
        state.error = null;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong updating item";
        state.loading = false;
      })
      // delete items
      .addCase(removeItem.pending, (state) => {
        state.error = null;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = deleteData(action.meta.arg, state.items);
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong deleting item";
        state.loading = false;
      });
  },
});

export default itemsSlice.reducer;
