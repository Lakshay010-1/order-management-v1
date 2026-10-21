import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface headerState {
  headerContent: any;
}

const headerInitialSlice: headerState = {
  headerContent: null,
};

const headerSlice = createSlice({
  name: "header",
  initialState: headerInitialSlice,
  reducers: {
    setHeaderContent: (state, action: PayloadAction<any>) => {
      state.headerContent = action.payload;
    },
  },
});

export const { setHeaderContent } = headerSlice.actions;

export default headerSlice.reducer;
