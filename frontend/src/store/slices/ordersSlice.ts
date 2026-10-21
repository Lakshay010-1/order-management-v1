import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import type { Order } from "../../types/Order";
import {
  addOrder,
  deleteOrder,
  getOrder,
  getOrders,
  putOrder,
} from "../../api/OrdersApi";
import type { NewOrder } from "../../types/NewOrder";
import type { OrderDetails } from "../../types/OrderDetails";
import { addData, deleteData, updateData } from "../../utils/handleArrayData";

interface OrdersState {
  orders: Array<Order>;
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const ordersInitialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  initialized: false,
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  return await getOrders();
});

export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (id: number) => {
    return await getOrder(id);
  },
);

export const insertOrder = createAsyncThunk(
  "orders/insertOrder",
  async (details: NewOrder) => {
    return await addOrder(details);
  },
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, details }: { id: number; details: OrderDetails }) => {
    return await putOrder(id, details);
  },
);

export const removeOrder = createAsyncThunk(
  "orders/removeOrder",
  async (id: number) => {
    return await deleteOrder(id);
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: ordersInitialState,
  reducers: {
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload;
        state.initialized = true;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: Fetching orders";
        state.loading = false;
        state.orders = [];
      })

      // Fetch Order
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        // state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: Fetching order";
        state.loading = false;
        // state.currentOrder = null;
      })

      // Add Order
      .addCase(insertOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertOrder.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.orders = addData(action.payload, state.orders);
        state.currentOrder = action.payload;
      })
      .addCase(insertOrder.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: Adding order";
        state.loading = false;
      })

      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const { id, details } = action.meta.arg;
        state.error = null;
        state.loading = false;
        state.orders = updateData(id, details, state.orders);
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: Updating order";
        state.loading = false;
      })

      // Delete Order
      .addCase(removeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeOrder.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.orders = deleteData(action.meta.arg, state.orders);
      })
      .addCase(removeOrder.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: Deleting order";
        state.loading = false;
      });
  },
});

export const { resetCurrentOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
