import { configureStore } from "@reduxjs/toolkit";
import statusesReducer from "./slices/statusSlice";
import partyReducer from "./slices/partySlice";
import ordersReducer from "./slices/ordersSlice";
import orderPaymentTCsReducer from "./slices/orderPaymentTCsSlice";
import orderMaterialsReducer from "./slices/orderMaterialsSlice";
import orderItemsReducer from "./slices/orderItemsSlice";
import itemsReducer from "./slices/itemsSlice";
import authReducer from "./slices/authSlice";
import orderMatDispatchesReducer from "./slices/orderMatDispatchesSlice";
import headerReducer from "./slices/headerSlice";

export const store = configureStore({
  reducer: {
    statuses: statusesReducer,
    orders: ordersReducer,
    parties: partyReducer,
    orderPaymentTCs: orderPaymentTCsReducer,
    orderMaterials: orderMaterialsReducer,
    orderItems: orderItemsReducer,
    items: itemsReducer,
    auth: authReducer,
    orderMatDispatches: orderMatDispatchesReducer,
    header: headerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
