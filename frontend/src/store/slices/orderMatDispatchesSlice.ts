import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { MaterialDispatch } from "../../types/Material";
import {
  addOrderMaterialDispatch,
  deleteOrderMaterialDispatch,
  getOrderMaterialDispatches,
  putOrderMaterialDispatch,
} from "../../api/OrderMaterialDispatchApi";
import type { NewOrderMaterial } from "../../types/NewOrderMaterial";
import { addData, deleteData, updateData } from "../../utils/handleArrayData";

interface orderMaterialDispatchesState {
  orderMaterialDispatches: Array<MaterialDispatch>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const orderMaterialDispatchesInitialState: orderMaterialDispatchesState = {
  orderMaterialDispatches: [],
  loading: false,
  error: null,
  initialized: false,
};

export const fetchorderMaterialDispatches = createAsyncThunk(
  "orderMaterialDispatches/fetchorderMaterialDispatches",
  async ({
    order_id,
    material_id,
  }: {
    order_id: number;
    material_id: number;
  }) => {
    return await getOrderMaterialDispatches(order_id, material_id);
  },
);

export const insertOrderMaterialDispatch = createAsyncThunk(
  "orderMaterialDispatches/insertOrderMaterialDispatch",
  async ({
    order_id,
    material_id,
    details,
  }: {
    order_id: number;
    material_id: number;
    details: NewOrderMaterial;
  }) => {
    return await addOrderMaterialDispatch(order_id, material_id, details);
  },
);

export const updateOrderMaterialDispatch = createAsyncThunk(
  "orderMaterialDispatches/updateOrderMaterialDispatch",
  async ({
    order_id,
    material_id,
    material_dispatch_id,
    details,
  }: {
    order_id: number;
    material_id: number;
    material_dispatch_id: number;
    details: { quantity: number; date: Date };
  }) => {
    return await putOrderMaterialDispatch(
      order_id,
      material_id,
      material_dispatch_id,
      details,
    );
  },
);

export const removeOrderMaterialDispatch = createAsyncThunk(
  "orderMaterialDispatches/removeOrderMaterialDispatch",
  async ({
    order_id,
    material_id,
    material_dispatch_id,
  }: {
    order_id: number;
    material_id: number;
    material_dispatch_id: number;
  }) => {
    return await deleteOrderMaterialDispatch(
      order_id,
      material_id,
      material_dispatch_id,
    );
  },
);

const orderMaterialDispatchesSlice = createSlice({
  name: "orderMaterialDispatches",
  initialState: orderMaterialDispatchesInitialState,
  reducers: {
    setOrderMaterialDispatchesInitializer: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.initialized = action.payload;
    },
    setOrderMaterialDispatchesGlobal: (
      state,
      action: PayloadAction<Array<MaterialDispatch>>,
    ) => {
      state.orderMaterialDispatches = [
        ...state.orderMaterialDispatches,
        ...action.payload,
      ];
    },
    clearOrderMaterialDispatchesGlobal: (state) => {
      state.orderMaterialDispatches = [];
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Orders
      .addCase(fetchorderMaterialDispatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchorderMaterialDispatches.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orderMaterialDispatches = [
          ...state.orderMaterialDispatches,
          ...action.payload,
        ];
      })
      .addCase(fetchorderMaterialDispatches.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Fetching order material dispatches";
        state.loading = false;
        state.orderMaterialDispatches = [];
      })

      // Add Order
      .addCase(insertOrderMaterialDispatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertOrderMaterialDispatch.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.orderMaterialDispatches = addData(
          action.payload,
          state.orderMaterialDispatches,
        );
      })
      .addCase(insertOrderMaterialDispatch.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Adding order material dispatch";
        state.loading = false;
      })

      // Update Order
      .addCase(updateOrderMaterialDispatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderMaterialDispatch.fulfilled, (state, action) => {
        const { material_dispatch_id, details } = action.meta.arg;
        state.error = null;
        state.loading = false;
        state.orderMaterialDispatches = updateData(
          material_dispatch_id,
          details,
          state.orderMaterialDispatches,
        );
      })
      .addCase(updateOrderMaterialDispatch.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Updating order material dispatch";
        state.loading = false;
      })

      // Delete Order
      .addCase(removeOrderMaterialDispatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeOrderMaterialDispatch.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.orderMaterialDispatches = deleteData(
          action.meta.arg.material_dispatch_id,
          state.orderMaterialDispatches,
        );
      })
      .addCase(removeOrderMaterialDispatch.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Deleting order material dispatch";
        state.loading = false;
      });
  },
});

export const {
  setOrderMaterialDispatchesInitializer,
  setOrderMaterialDispatchesGlobal,
  clearOrderMaterialDispatchesGlobal,
} = orderMaterialDispatchesSlice.actions;

export default orderMaterialDispatchesSlice.reducer;
