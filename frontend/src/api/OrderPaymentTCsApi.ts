import type { NewOrderPaymentTC } from "../types/PaymentTC";
import type { PaymentTC } from "../types/PaymentTC";
import { API_LINK } from "./URLs";
import { deleteMethodCall } from "./method_calls/DeleteCall";
import { getMethodCall } from "./method_calls/GetCall";
import { postMethodCall } from "./method_calls/PostCall";
import { putMethodCall } from "./method_calls/PutCall";

const ORDER_PAYMENT_TCs_API_LINK = (
  order_id: number,
  order_payment_tc_id?: number,
): string => {
  return `${API_LINK}/orders/${order_id}/payment_tcs${!order_payment_tc_id ? "" : "/" + order_payment_tc_id}`;
};

const addOrderPaymentTC: (
  order_id: number,
  details: NewOrderPaymentTC,
) => Promise<PaymentTC> = (order_id, details) => {
  return postMethodCall<PaymentTC>(
    ORDER_PAYMENT_TCs_API_LINK(order_id),
    details,
  );
};

const getOrderPaymentTCs: (order_id: number) => Promise<Array<PaymentTC>> = (
  order_id,
) => {
  return getMethodCall<Array<PaymentTC>>(ORDER_PAYMENT_TCs_API_LINK(order_id));
};

const putOrderPaymentTC: (
  order_id: number,
  order_payment_tc_id: number,
  details: NewOrderPaymentTC,
) => Promise<boolean> = (order_id, order_payment_tc_id, details) => {
  return putMethodCall(
    ORDER_PAYMENT_TCs_API_LINK(order_id, order_payment_tc_id),
    details,
  );
};

const deleteOrderPaymentTC: (
  order_id: number,
  order_payment_tc_id: number,
) => Promise<boolean> = (order_id, order_payment_tc_id) => {
  return deleteMethodCall(
    ORDER_PAYMENT_TCs_API_LINK(order_id, order_payment_tc_id),
  );
};

export {
  addOrderPaymentTC,
  getOrderPaymentTCs,
  putOrderPaymentTC,
  deleteOrderPaymentTC,
};
