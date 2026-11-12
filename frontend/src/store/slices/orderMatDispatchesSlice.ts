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
  getOrderMaterialsDispatches,
  putOrderMaterialDispatch,
} from "../../api/OrderMaterialDispatchApi";
import { addData, updateData } from "../../utils/handleArrayData";

interface orderMaterialDispatchesState {
  orderMaterialsDispatches: Array<MaterialDispatch>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const orderMaterialDispatchesInitialState: orderMaterialDispatchesState = {
  orderMaterialsDispatches: [],
  loading: false,
  error: null,
  initialized: false,
};

export const fetchorderMaterialsDispatches = createAsyncThunk(
  "orderMaterialDispatches/fetchorderMaterialsDispatches",
  async (order_id: number) => {
    return await getOrderMaterialsDispatches(order_id);
  },
);

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
    details: MaterialDispatch;
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
    details: MaterialDispatch;
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
      state.orderMaterialsDispatches = [
        ...state.orderMaterialsDispatches,
        ...action.payload,
      ];
    },
    clearOrderMaterialDispatchesGlobal: (state) => {
      state.orderMaterialsDispatches = [];
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch particualr material dispatches
      .addCase(fetchorderMaterialDispatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchorderMaterialDispatches.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orderMaterialsDispatches = action.payload;
      })
      .addCase(fetchorderMaterialDispatches.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Fetching order material dispatches";
        state.loading = false;
        state.orderMaterialsDispatches = [];
      })

      // Fetch all dispatches
      .addCase(fetchorderMaterialsDispatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchorderMaterialsDispatches.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.initialized = true;
        state.orderMaterialsDispatches = action.payload;
      })
      .addCase(fetchorderMaterialsDispatches.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Fetching order materials dispatches";
        state.loading = false;
        state.orderMaterialsDispatches = [];
      })

      // Add Order
      .addCase(insertOrderMaterialDispatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertOrderMaterialDispatch.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.orderMaterialsDispatches = addData(
          action.payload,
          state.orderMaterialsDispatches,
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
        state.orderMaterialsDispatches = updateData(
          material_dispatch_id,
          details,
          state.orderMaterialsDispatches,
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
        state.orderMaterialsDispatches = state.orderMaterialsDispatches.filter(
          (dispatch) => dispatch.id !== action.meta.arg.material_dispatch_id,
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
