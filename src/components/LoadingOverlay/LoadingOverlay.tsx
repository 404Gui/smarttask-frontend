import { FC } from "react";
import styles from "./LoadingOverlay.module.css";

interface LoadingOverlayProps {
  show: boolean;
  mensagem?: string;
}

const LoadingOverlay: FC<LoadingOverlayProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingOverlay;
