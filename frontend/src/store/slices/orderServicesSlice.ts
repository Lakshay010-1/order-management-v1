import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { NewOrderService, OrderService } from "../../types/OrderService";
import {
  addOrderService,
  deleteOrderService,
  getOrderServices,
  putOrderService,
} from "../../api/OrderServicesApi";
import { addData, deleteData, updateData } from "../../utils/handleArrayData";

interface ordersServiceState {
  orderServices: Array<OrderService>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const ordersServiceInitialState: ordersServiceState = {
  orderServices: [],
  loading: false,
  error: null,
  initialized: false,
};

export const fetchOrderServices = createAsyncThunk(
  "orderServices/fetchOrderServices",
  async (order_id: number) => {
    return await getOrderServices(order_id);
  },
);

export const updateOrderService = createAsyncThunk(
  "orderService/updateOrderService",
  async ({
    order_id,
    service_id,
    details,
  }: {
    order_id: number;
    service_id: number;
    details: NewOrderService;
  }) => {
    return await putOrderService(order_id, service_id, details);
  },
);

export const insertOrderService = createAsyncThunk(
  "orderService/insertOrderService",
  async ({
    order_id,
    details,
  }: {
    order_id: number;
    details: NewOrderService;
  }) => {
    return await addOrderService(order_id, details);
  },
);

export const removeOrderService = createAsyncThunk(
  "orderService/removeOrderService",
  async ({
    order_id,
    service_id,
  }: {
    order_id: number;
    service_id: number;
  }) => {
    return await deleteOrderService(order_id, service_id);
  },
);

const orderServicesSlice = createSlice({
  name: "orderServices",
  initialState: ordersServiceInitialState,
  reducers: {
    setOrderServicessInitializer: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch order services
      .addCase(fetchOrderServices.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderServices.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orderServices = action.payload;
        state.initialized = true;
      })
      .addCase(fetchOrderServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error fetching order services";
      })
      // update order services
      .addCase(updateOrderService.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderService.fulfilled, (state, action) => {
        const { service_id, details } = action.meta.arg;
        state.loading = false;
        state.error = null;
        state.orderServices = updateData(
          service_id,
          details,
          state.orderServices,
        );
        state.initialized = true;
      })
      .addCase(updateOrderService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error updating order service";
      })
      // delete order services
      .addCase(removeOrderService.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeOrderService.fulfilled, (state, action) => {
        const { service_id } = action.meta.arg;
        state.loading = false;
        state.error = null;
        state.orderServices = deleteData(service_id, state.orderServices);
        state.initialized = true;
      })
      .addCase(removeOrderService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error deleting order service";
      })
      // insert order services
      .addCase(insertOrderService.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertOrderService.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orderServices = addData(action.payload, state.orderServices);
        state.initialized = true;
      })
      .addCase(insertOrderService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error inserting order service";
      });
  },
});

export const {setOrderServicessInitializer} = orderServicesSlice.actions;

export default orderServicesSlice.reducer;
