import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import statusesReducer from "./slices/statusSlice";
import deliveryMediumsReducer from "./slices/deliveryMediumsSlice";
import poTypesReducer from "./slices/poTypesSlice";
import partyReducer from "./slices/partySlice";
import itemsReducer from "./slices/itemsSlice";
import ordersReducer from "./slices/ordersSlice";
import orderPaymentTCsReducer from "./slices/orderPaymentTCsSlice";
import orderMaterialsReducer from "./slices/orderMaterialsSlice";
import orderMatDispatchesReducer from "./slices/orderMatDispatchesSlice";
import orderServicesReducer from "./slices/orderServicesSlice";
import headerReducer from "./slices/headerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    statuses: statusesReducer,
    deliveryMediums: deliveryMediumsReducer,
    poTypes: poTypesReducer,
    parties: partyReducer,
    items: itemsReducer,
    orders: ordersReducer,
    orderPaymentTCs: orderPaymentTCsReducer,
    orderMaterials: orderMaterialsReducer,
    orderMatDispatches: orderMatDispatchesReducer,
    orderServices: orderServicesReducer,
    header: headerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
