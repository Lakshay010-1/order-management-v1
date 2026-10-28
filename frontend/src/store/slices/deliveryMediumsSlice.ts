import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { DeliveryMedium } from "../../types/DeliveryMedium";
import { getDeliveryMediums } from "../../api/DeliveryMediumsApi";

interface deliveryMediumsState {
  deliveryMediums: Array<DeliveryMedium>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const deliveryMediumsInitialState: deliveryMediumsState = {
  deliveryMediums: [],
  loading: false,
  error: null,
  initialized: false,
};

export const fetchDeliveryMediums = createAsyncThunk(
  "deliveryMediums/fetchDeliveryMediums",
  async () => {
    return await getDeliveryMediums();
  },
);

const deliveryMediumsSlice = createSlice({
  name: "deliveryMediums",
  initialState: deliveryMediumsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveryMediums.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryMediums.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.deliveryMediums=action.payload;
        state.initialized = true;

      })
      .addCase(fetchDeliveryMediums.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ??
          "Something went wrong fetching delivery mediums";
      });
  },
});

export default deliveryMediumsSlice.reducer;
