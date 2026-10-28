import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PoType } from "../../types/PoType";
import { getPoTypes } from "../../api/PoTypesApi";

interface poTypesState {
  poTypes: Array<PoType>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const poTypesInitialState: poTypesState = {
  poTypes: [],
  loading: false,
  error: null,
  initialized: false,
};

export const fetchPoTypes = createAsyncThunk(
  "poTypes/fetchPoTypes",
  async () => {
    return await getPoTypes();
  },
);

const poTypesSlice = createSlice({
  name: "poTypes",
  initialState: poTypesInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPoTypes.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPoTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.poTypes = action.payload;
        state.initialized = true;
      })
      .addCase(fetchPoTypes.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ??
          "Something went wrong fetching po types";
      });
  },
});

export default poTypesSlice.reducer;
