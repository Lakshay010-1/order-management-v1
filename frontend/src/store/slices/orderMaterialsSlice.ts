import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Material } from "../../types/Material";
import {
  addOrderMaterial,
  deleteOrderMaterial,
  getOrderMaterials,
  putOrderMaterial,
} from "../../api/OrderMaterialApi";
import type { NewOrderMaterial } from "../../types/NewOrderMaterial";
import { addData, deleteData, updateData } from "../../utils/handleArrayData";

interface orderMaterialsState {
  orderMaterials: Array<Material>;
  loading: boolean;
  error: string | null;
  intialized: boolean;
}

const orderMaterialsInitialState: orderMaterialsState = {
  orderMaterials: [],
  loading: false,
  error: null,
  intialized: false,
};

export const fetchorderMaterials = createAsyncThunk(
  "orderMaterials/fetchorderMaterials",
  async (order_id: number) => {
    return await getOrderMaterials(order_id);
  },
);

export const insertOrderMaterial = createAsyncThunk(
  "orderMaterials/insertOrderMaterial",
  async ({
    order_id,
    details,
  }: {
    order_id: number;
    details: NewOrderMaterial;
  }) => {
    return await addOrderMaterial(order_id, details);
  },
);

export const updateOrderMaterial = createAsyncThunk(
  "orderMaterials/updateOrderMaterial",
  async ({
    order_id,
    material_id,
    details,
  }: {
    order_id: number;
    material_id: number;
    details: { quantity: number; date: Date };
  }) => {
    return await putOrderMaterial(order_id, material_id, details);
  },
);

export const removeOrderMaterial = createAsyncThunk(
  "orderMaterials/removeOrderMaterial",
  async ({
    order_id,
    material_id,
  }: {
    order_id: number;
    material_id: number;
  }) => {
    return await deleteOrderMaterial(order_id, material_id);
  },
);

const orderMaterialsSlice = createSlice({
  name: "orderMaterials",
  initialState: orderMaterialsInitialState,
  reducers: {
    setOrderMaterialsInitializer: (state, action: PayloadAction<boolean>) => {
      state.intialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Orders
      .addCase(fetchorderMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchorderMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orderMaterials = action.payload;
        state.intialized = true;
      })
      .addCase(fetchorderMaterials.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Fetching order materials";
        state.loading = false;
        state.orderMaterials = [];
      })

      // Add Order
      .addCase(insertOrderMaterial.pending, (state) => {
        state.error = null;
      })
      .addCase(insertOrderMaterial.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.orderMaterials = addData(action.payload, state.orderMaterials);
      })
      .addCase(insertOrderMaterial.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: Adding order material";
        state.loading = false;
      })

      // Update Order
      .addCase(updateOrderMaterial.pending, (state) => {
        state.error = null;
      })
      .addCase(updateOrderMaterial.fulfilled, (state, action) => {
        const { details, material_id } = action.meta.arg;
        state.error = null;
        state.loading = false;
        state.orderMaterials = updateData(
          material_id,
          details,
          state.orderMaterials,
        );
      })
      .addCase(updateOrderMaterial.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Updating order material";
        state.loading = false;
      })

      // Delete Order
      .addCase(removeOrderMaterial.pending, (state) => {
        state.error = null;
      })
      .addCase(removeOrderMaterial.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.orderMaterials = deleteData(
          action.meta.arg.material_id,
          state.orderMaterials,
        );
      })
      .addCase(removeOrderMaterial.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "Something went wrong: Deleting order material";
        state.loading = false;
      });
  },
});

export const {setOrderMaterialsInitializer} = orderMaterialsSlice.actions;

export default orderMaterialsSlice.reducer;
