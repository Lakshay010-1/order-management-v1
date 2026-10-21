import React from "react";
import Footer from "../components/Footer";
import styles from "./styles/MainLayout.module.css";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div>
      <div className={styles.container}>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
