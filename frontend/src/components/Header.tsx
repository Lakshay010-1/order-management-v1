import React from "react";
import styles from "./styles/OrderHeader.module.css";
import Profile from "./Profile";
import BackupTableTwoToneIcon from "@mui/icons-material/BackupTableTwoTone";
import BarcodeReaderIcon from "@mui/icons-material/BarcodeReader";
import BusinessIcon from "@mui/icons-material/Business";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import logo from "../assets/images/logo.png";

export default function Header() {
  const { headerContent } = useAppSelector((state) => state.header);

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <img src={logo} alt="Logo Image" className={styles.companyLogo} />
        <div className={styles.headerContentContainer}>
          {headerContent == "Orders" ||
          headerContent == "Parties" ||
          headerContent == "Items" ? (
            <h1>{headerContent}</h1>
          ) : (
            <>{headerContent}</>
          )}
        </div>
      </div>
      <div className={styles.headerPages}>
        <NavLink to="/orders">
          <div className={styles.headerPage}>
            <BackupTableTwoToneIcon />
            <h3>Orders</h3>
          </div>
        </NavLink>
        <NavLink to="/parties">
          <div className={styles.headerPage}>
            <BusinessIcon />
            <h3>Parties</h3>
          </div>
        </NavLink>
        <NavLink to="/items">
          <div className={styles.headerPage}>
            <BarcodeReaderIcon />
            <h3>Items</h3>
          </div>
        </NavLink>
        <Profile />
      </div>
    </header>
  );
}
