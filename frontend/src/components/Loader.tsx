import React from "react";
import styles from "./styles/Loader.module.css";

export default function Loader({ message }: { message?: string }) {
  return (
    <div className={styles.container}>
      <section className={styles.dotsContainer}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </section>
      {message && <h2> {message}...</h2>}
    </div>
  );
}
