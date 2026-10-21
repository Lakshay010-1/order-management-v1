import React, { useEffect, useState } from "react";
import styles from "./styles/Dashboard.module.css";
import DataTable from "../components/OrdersTable";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchOrders, removeOrder } from "../store/slices/ordersSlice";
import NavBar from "../components/NavBar";
import type { Order } from "../types/Order";
import Loader from "../components/Loader";
import { setHeaderContent } from "../store/slices/headerSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const {
    orders,
    loading: ordersLoading,
    initialized: ordersInitialized,
    error,
  } = useAppSelector((state) => state.orders);
  const [sortedOrders, setSortedOrders] = useState<Array<Order>>([]);
  const [message, setMessage] = useState("");
  const [sortOrdersBy, setSortOrdersBy] = useState<{
    type: string;
    value: string;
  }>({ type: "", value: "" });

  useEffect(() => {
    if (!ordersLoading) {
      if (!ordersInitialized) {
        dispatch(fetchOrders());
      } else {
        setSortedOrders(orders);
      }
    }
  }, [orders, ordersLoading]);

  useEffect(() => {
    const { type, value } = sortOrdersBy;
    if (!type || !value) {
      return;
    }
    if (value == "All") {
      setMessage("");
      setSortedOrders(orders);
    } else if (type == "Party" || type == "Status") {
      const currentSortedOrders = orders.filter(
        (order) => order[type == "Party" ? "party" : "status"] == value,
      );
      setMessage("");
      setSortedOrders(currentSortedOrders);
      setMessage(
        currentSortedOrders.length == 0
          ? `No orders found with ${sortOrdersBy.type} = ${sortOrdersBy.value}`
          : "",
      );
    }
  }, [sortOrdersBy]);

  useEffect(() => {
    dispatch(setHeaderContent("Orders"));
  }, []);

  function handleDelete(id: number) {
    dispatch(removeOrder(id));
  }

  return (
    <div className={styles.container}>
      <NavBar setSortOrdersBy={setSortOrdersBy} />
      {ordersLoading ? (
        <Loader message="Loading Orders" />
      ) : (
        <>
          {message ? (
            <h1>{message}</h1>
          ) : (
            <DataTable orders={sortedOrders} handleDelete={handleDelete} />
          )}
        </>
      )}
    </div>
  );
}
