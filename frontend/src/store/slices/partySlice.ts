import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addParty,
  deleteParty,
  getParties,
  patchParty,
} from "../../api/PartiesApi";
import type { Party } from "../../types/Party";
import { addData, deleteData, updateData } from "../../utils/handleArrayData";

interface partyState {
  parties: Array<Party>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const partyInitialState: partyState = {
  parties: [],
  loading: false,
  error: null,
  initialized: false,
};

export const fetchParties = createAsyncThunk(
  "parties/fetchParties",
  async () => {
    return await getParties();
  },
);

export const updateParty = createAsyncThunk(
  "parties/updateParty",
  async ({ id, details }: { id: number; details: Party }) => {
    return await patchParty(id, details);
  },
);

export const insertParty = createAsyncThunk(
  "parties/insertParty",
  async (partyData: Partial<Party>) => {
    return await addParty(partyData);
  },
);

export const removeParty = createAsyncThunk(
  "parties/removeParty",
  async (id: number) => {
    return await deleteParty(id);
  },
);

const partySlice = createSlice({
  name: "parties",
  initialState: partyInitialState,
  reducers: {
    // partyUpdate: (
    //   state,
    //   action: PayloadAction<{ id: number; details: Party }>,
    // ) => {
    //   state.loading = true;
    //   state.parties = state.parties.map((party) =>
    //     party.id === action.payload.id ? action.payload.details : party,
    //   );
    //   state.loading = false;
    // },
    // partyDelete: (state, action: PayloadAction<number>) => {
    //   state.loading = true;
    //   state.parties = state.parties.filter(
    //     (party) => party.id !== action.payload,
    //   );
    //   state.loading = false;
    // },
  },
  extraReducers: (builder) => {
    builder
      //   fetch parties
      .addCase(fetchParties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParties.fulfilled, (state, action) => {
        state.parties = action.payload;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      })
      .addCase(fetchParties.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Something went wrong fetching parties";
      })

      //   insert Party
      .addCase(insertParty.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(insertParty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.parties = addData(action.payload, state.parties);
      })
      .addCase(insertParty.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Something went wrong inserting Party";
      })

      // update party
      .addCase(updateParty.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(updateParty.fulfilled, (state, action) => {
        const { id, details } = action.meta.arg;
        state.error = null;
        state.loading = false;
        state.parties = updateData(id, details, state.parties);
      })
      .addCase(updateParty.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: Updating Party";
        state.loading = false;
      })

      //   delete party
      .addCase(removeParty.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(removeParty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.parties = deleteData(action.meta.arg, state.parties);
      })
      .addCase(removeParty.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Something went wrong deleting party";
      });
  },
});

// export const { partyDelete, partyUpdate } = partySlice.actions;

export default partySlice.reducer;
