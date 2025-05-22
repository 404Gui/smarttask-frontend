"use client";
import styles from "./Header.module.css";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "./UserMenu/UserMenu";
import ThemeToggle from "./ThemeToggle/ThemeToggle";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import { useRouter } from 'next/navigation';


export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h2 className={styles.logo} onClick={() => router.push("/dashboard")}>
          Taskoom
        </h2>
      </div>
      <div className={styles.right}>
        <ThemeToggle />
        {loading ? (
          <LoadingOverlay show={loading} mensagem="Autenticando usuário" />
        ) : user ? (
          <UserMenu />
        ) : (
          <span className={styles.greeting}>Olá, Visitante!</span>
        )}
      </div>
    </header>
  );
}
