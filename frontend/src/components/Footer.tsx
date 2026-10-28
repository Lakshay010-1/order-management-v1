import React from "react";
import styles from "./styles/Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <h3>&copy;{new Date().getFullYear()}</h3>
      <h3>
        <a target="_blank" href="https://lakshaygoyal-lg.vercel.app">
          Lakshay Goyal
        </a>
      </h3>
    </footer>
  );
}

export default Footer;
