import { ReactNode } from "react";
import styles from "./SearchListInput.module.css";

type SearchListInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  children?: ReactNode;
};

export default function SearchListInput({
  value,
  onChange,
  placeholder,
  children,
}: SearchListInputProps) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
}
