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
  const [ordersSortConfig, setOrdersSortConfig] = useState({
    key: "id",
    order: "asc",
  });
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
    } else if (type == "Time") {
      const timeInfo = value.split("-");
      const filterByYear = Number(timeInfo[0]),
        filterByMonth = Number(timeInfo[1]);
      let filteredOrdres = orders;
      if (filterByMonth != 0) {
        filteredOrdres = filteredOrdres.filter((o) => {
          const orderMonth = new Date(o.po_date).getUTCMonth() + 1;
          return orderMonth == filterByMonth;
        });
      }
      filteredOrdres = filteredOrdres.filter((o) => {
        const orderYear = new Date(o.po_date).getUTCFullYear();
        return orderYear == filterByYear;
      });
      setSortedOrders(filteredOrdres);
      setMessage(
        filteredOrdres.length == 0
          ? `No orders found from ${filterByMonth == 0 ? "year " : `${new Date(2000, filterByMonth - 1).toLocaleString("en-US", { month: "long" })}, `}${filterByYear}`
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

  function handleOrdersSort(key: string) {
    const { key: ordersSortKey, order: ordersSortOrder } = ordersSortConfig;
    const direction =
      ordersSortKey == key && ordersSortOrder == "asc" ? "desc" : "asc";
    setOrdersSortConfig({ key, order: direction });

    setSortedOrders((prev) => {
      const sortedOs = [...prev].sort((a, b) => {
        // return a[key] - b[key];
        const aVal = a[key],
          bVal = b[key];
        const result = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return direction == "asc" ? result : -result;
      });
      return sortedOs;
    });
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
            <DataTable
              orders={sortedOrders}
              handleOrdersSort={handleOrdersSort}
              handleDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
}
