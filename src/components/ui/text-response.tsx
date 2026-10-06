"use client"

import styles from "./text-response.module.css";
import type { ReactNode } from "react";

export function TextResponse({ children }: { children?: ReactNode }) {
  return <div className={styles.prose}>{children}</div>;
}
