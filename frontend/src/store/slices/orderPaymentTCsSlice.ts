import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { PaymentTC } from "../../types/PaymentTC";
import {
  addOrderPaymentTC,
  deleteOrderPaymentTC,
  getOrderPaymentTCs,
  putOrderPaymentTC,
} from "../../api/OrderPaymentTCsApi";
import type { NewOrderPaymentTC } from "../../types/NewOrderPaymentTC";
import { addData, deleteData, updateData } from "../../utils/handleArrayData";

interface orderPaymentTCsState {
  orderPaymentTCs: Array<PaymentTC>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const orderPaymentTCsInitialState: orderPaymentTCsState = {
  orderPaymentTCs: [],
  loading: false,
  error: null,
  initialized: false,
};

export const fetchorderPaymentTCs = createAsyncThunk(
  "orderPaymentTCs/fetchorderPaymentTCs",
  async (order_id: number) => {
    return await getOrderPaymentTCs(order_id);
  },
);

export const insertOrderPaymentTC = createAsyncThunk(
  "orderPaymentTCs/insertOrderPaymentTC",
  async ({
    order_id,
    details,
  }: {
    order_id: number;
    details: NewOrderPaymentTC;
  }) => {
    return await addOrderPaymentTC(order_id, details);
  },
);

export const updateOrderPaymentTC = createAsyncThunk(
  "orderPaymentTCs/updateOrderPaymentTC",
  async ({
    order_id,
    payment_tc_id,
    details,
  }: {
    order_id: number;
    payment_tc_id: number;
    details: NewOrderPaymentTC;
  }) => {
    return await putOrderPaymentTC(order_id, payment_tc_id, details);
  },
);

export const removeOrderPaymentTC = createAsyncThunk(
  "orderPaymentTCs/removeOrderPaymentTC",
  async ({
    order_id,
    payment_tc_id,
  }: {
    order_id: number;
    payment_tc_id: number;
  }) => {
    return await deleteOrderPaymentTC(order_id, payment_tc_id);
  },
);

const orderPaymentTCsSlice = createSlice({
  name: "orderPaymentTCs",
  initialState: orderPaymentTCsInitialState,
  reducers: {
    setOrderPaymentTCSInitializer: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Orders
      .addCase(fetchorderPaymentTCs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchorderPaymentTCs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orderPaymentTCs = action.payload;
        state.initialized = true;
      })
      .addCase(fetchorderPaymentTCs.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Fetching order payment T&Cs";
        state.loading = false;
        state.orderPaymentTCs = [];
      })

      // Add Order
      .addCase(insertOrderPaymentTC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertOrderPaymentTC.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.orderPaymentTCs = addData(action.payload, state.orderPaymentTCs);
      })
      .addCase(insertOrderPaymentTC.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Adding order payment T&C";
        state.loading = false;
      })

      // Update Order
      .addCase(updateOrderPaymentTC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderPaymentTC.fulfilled, (state, action) => {
        const { payment_tc_id, details } = action.meta.arg;
        state.error = null;
        state.loading = false;
        state.orderPaymentTCs = updateData(
          payment_tc_id,
          details,
          state.orderPaymentTCs,
        );
      })
      .addCase(updateOrderPaymentTC.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Updating order payment T&C";
        state.loading = false;
      })

      // Delete Order
      .addCase(removeOrderPaymentTC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeOrderPaymentTC.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.orderPaymentTCs = deleteData(
          action.meta.arg.payment_tc_id,
          state.orderPaymentTCs,
        );
      })
      .addCase(removeOrderPaymentTC.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Deleting order payment T&C";
        state.loading = false;
      });
  },
});

export const { setOrderPaymentTCSInitializer } = orderPaymentTCsSlice.actions;

export default orderPaymentTCsSlice.reducer;
