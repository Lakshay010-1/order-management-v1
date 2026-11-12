import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface headerState {
  headerContent: any;
  userAuthStatus: boolean;
  headerErrorMessage: string;
}

const headerInitialState: headerState = {
  headerContent: null,
  userAuthStatus: true,
  headerErrorMessage: "",
};

const headerSlice = createSlice({
  name: "header",
  initialState: headerInitialState,
  reducers: {
    resetHeaderState: (state) => {
      state = headerInitialState;
    },
    setUserAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.userAuthStatus = action.payload;
    },
    setHeaderContent: (state, action: PayloadAction<any>) => {
      state.headerContent = action.payload;
    },
    setHeaderErrorMsg: (state, action: PayloadAction<any>) => {
      state.headerErrorMessage = action.payload;
    },
  },
});

export const {
  setHeaderContent,
  setUserAuthStatus,
  resetHeaderState,
  setHeaderErrorMsg,
} = headerSlice.actions;

export default headerSlice.reducer;
