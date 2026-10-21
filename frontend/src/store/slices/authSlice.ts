import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser, checkUser } from "../../api/AuthApi";

interface authState {
  is_verified: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  username: string;
}

const authInitialState: authState = {
  is_verified: false,
  loading: false,
  error: null,
  initialized: false,
  username: "",
};

export const validateUser = createAsyncThunk("auth/validateUser", async () => {
  return await checkUser();
});

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ username, password }: { username: string; password: string }) => {
    const response = await loginUser(username, password);
    return response;
  },
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  return await logoutUser();
});

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.is_verified = true;
        state.username = action.meta.arg.username;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.is_verified = false;
        state.error = action.error.message ?? "Something went wrong signing in";
        state.loading = false;
      })

      // Sign Out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.is_verified = false;
        state.error = null;
        state.initialized = false;
        state.username = "";
      })
      .addCase(signOut.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong signing out";
        state.loading = false;
      })

      // Validate User
      .addCase(validateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.is_verified = true;
        state.initialized = true;
        state.username = action.payload.username;
      })
      .addCase(validateUser.rejected, (state, action) => {
        state.error =
          action.error.message ?? "Something went wrong: validating out";
        state.loading = false;
        state.initialized = true;
        state.is_verified = false;
      });
  },
});

export default authSlice.reducer;
