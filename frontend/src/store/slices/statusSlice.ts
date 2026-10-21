import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addStatus,
  deleteStatus,
  getStatuses,
  putStatus,
} from "../../api/StatusesApi";
import type { Status } from "../../types/Status";
import { addData, deleteData, updateData } from "../../utils/handleArrayData";

interface statusState {
  statuses: Array<Status>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const statusesInitialState: statusState = {
  statuses: [],
  loading: false,
  error: null,
  initialized: false,
};

export const fetchStatuses = createAsyncThunk(
  "statuses/fetchStatuses",
  async () => {
    const response = await getStatuses();
    return response;
  },
);

export const insertStatus = createAsyncThunk(
  "statuses/insertStatus",
  async (details: string) => {
    return await addStatus(details);
  },
);

export const updateStatus = createAsyncThunk(
  "statuses/updateStatus",
  async ({ id, status }: { id: number; status: string }) => {
    return await putStatus(id, status);
  },
);

export const removeStatus = createAsyncThunk(
  "statuses/removeStatus",
  async (id: number) => {
    return await deleteStatus(id);
  },
);

const statusesSlice = createSlice({
  name: "statuses",
  initialState: statusesInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch statuses
      .addCase(fetchStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.statuses = action.payload;
        state.initialized = true;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      })

      //   insert Status
      .addCase(insertStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.statuses = addData(action.payload, state.statuses);
      })
      .addCase(insertStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Something went wrong inserting Status";
      })

      // update Status
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const { id, status } = action.meta.arg;
        state.error = null;
        state.loading = false;
        state.statuses = updateData(id, { status }, state.statuses);
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: Updating Status";
        state.loading = false;
      })

      //   delete Status
      .addCase(removeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.statuses = deleteData(action.meta.arg, state.statuses);
      })
      .addCase(removeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Something went wrong deleting Status";
      });
  },
});

export default statusesSlice.reducer;
