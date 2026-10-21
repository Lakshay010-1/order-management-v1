import React from "react";
import styles from "./styles/Footer.module.css";

function Footer() {
  return (
    <footer>
      <h1>&copy;{new Date().getFullYear()}</h1>
      <h1>
        <a target="_blank" href="https://lakshaygoyal-lg.vercel.app">
          Lakshay Goyal
        </a>
      </h1>
    </footer>
  );
}

export default Footer;
