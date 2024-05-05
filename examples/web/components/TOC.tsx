import styles from "./TOC.module.css";

export function TOC({ children }: { children: React.ReactNode }) {
  return <div className={styles.toc}>{children}</div>;
}
