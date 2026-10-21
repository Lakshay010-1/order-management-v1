import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { OrderItem } from "../../types/OrderItem";
import {
  addOrderItem,
  deleteOrderItem,
  getOrderItems,
  putOrderItem,
} from "../../api/OrderItemsApi";
import type { NewOrderItem } from "../../types/NewOrderItem";
import { addData, deleteData, updateData } from "../../utils/handleArrayData";

interface OrderItemsState {
  orderItems: Array<OrderItem>;
  loading: boolean;
  error: string | null;
  intialized: boolean;
}

const orderItemsInitialState: OrderItemsState = {
  orderItems: [],
  loading: false,
  error: null,
  intialized: false,
};

export const fetchOrderItems = createAsyncThunk(
  "orderItems/fetchOrderItems",
  async (order_id: number) => {
    return await getOrderItems(order_id);
  },
);

export const insertOrderItem = createAsyncThunk(
  "orderItems/insertOrderItem",
  async ({
    order_id,
    details,
  }: {
    order_id: number;
    details: NewOrderItem;
  }) => {
    return await addOrderItem(order_id, details);
  },
);

export const updateOrderItem = createAsyncThunk(
  "orderItems/updateOrderItem",
  async ({
    order_id,
    item_id,
    details,
  }: {
    order_id: number;
    item_id: number;
    details: { quantity: number; date: Date };
  }) => {
    return await putOrderItem(order_id, item_id, details);
  },
);

export const removeOrderItem = createAsyncThunk(
  "orderItems/removeOrderItem",
  async ({ order_id, item_id }: { order_id: number; item_id: number }) => {
    return await deleteOrderItem(order_id, item_id);
  },
);

const orderItemsSlice = createSlice({
  name: "orderItems",
  initialState: orderItemsInitialState,
  reducers: {
    setOrderItemsInitializer: (state, action: PayloadAction<boolean>) => {
      state.intialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Orders
      .addCase(fetchOrderItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.intialized = true;
        state.orderItems = action.payload;
      })
      .addCase(fetchOrderItems.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: Fetching order items";
        state.loading = false;
        state.orderItems = [];
      })

      // Add Order
      .addCase(insertOrderItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertOrderItem.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.orderItems = addData(action.payload, state.orderItems);
      })
      .addCase(insertOrderItem.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: Adding order item";
        state.loading = false;
      })

      // Update Order
      .addCase(updateOrderItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderItem.fulfilled, (state, action) => {
        const { item_id, details } = action.meta.arg;
        state.error = null;
        state.loading = false;
        state.orderItems = updateData(item_id, details, state.orderItems);
      })
      .addCase(updateOrderItem.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: Updating order item";
        state.loading = false;
      })

      // Delete Order
      .addCase(removeOrderItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeOrderItem.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.orderItems = deleteData(
          action.meta.arg.item_id,
          state.orderItems,
        );
      })
      .addCase(removeOrderItem.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: Deleting order item";
        state.loading = false;
      });
  },
});

export const { setOrderItemsInitializer } = orderItemsSlice.actions;

export default orderItemsSlice.reducer;
