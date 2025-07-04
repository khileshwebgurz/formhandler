import Image from "next/image";
import styles from "./page.module.css";
import MyForm from "./myform/page";

export default function Home() {
  return (
    <div className={styles.page}>
      <MyForm />
    </div>
  );
}
