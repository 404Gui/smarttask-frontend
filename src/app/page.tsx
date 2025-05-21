import { Bell, Github, Linkedin, ListTodo, Moon } from "lucide-react";
import styles from "./Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.glow}></div>
      <header className={styles.header}>
        <h1 className={styles.logo}>Taskoom</h1>
        <nav>
          <Link href="/login" className={styles.navLink}>
            Entrar
          </Link>
          <Link href="/register" className={styles.navLink}>
            Criar Conta
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Organize sua vida com elegância</h2>
        <p className={styles.subtitle}>
          Um gerenciador de tarefas refinado para quem valoriza foco e
          simplicidade.
        </p>

        <div className={styles.actions}>
          <Link href="/register">
            <button className={styles.primary}>Começar agora</button>
          </Link>
          <Link href="/login">
            <button className={styles.secondary}>Já tenho conta</button>
          </Link>
        </div>

        <section className={styles.features}>
          <div>
            <div className={styles.iconWrapper}>
              <ListTodo size={24} strokeWidth={1.5} />
            </div>
            <h3>Listas inteligentes</h3>
            <p>
              Organize tarefas por prioridades, prazos e deixe a IA te ajudar a
              criar uma lista.
            </p>
          </div>
          <div>
            <div className={styles.iconWrapper}>
              <Moon size={24} strokeWidth={1.5} />
            </div>
            <h3>Interface clean</h3>
            <p>Visual escuro, suave e sem distrações para sua rotina.</p>
          </div>
          <div>
            <div className={styles.iconWrapper}>
              <Bell size={24} strokeWidth={1.5} />
            </div>
            <h3>Lembretes eficazes (em breve)</h3>
            <p>Receba alertas para não esquecer o que realmente importa.</p>
          </div>
        </section>
        <footer className={styles.footer}>
          <p>
            Desenvolvido por <strong>Guilherme Pappi</strong>
          </p>
          <div className={styles.social}>
            <a
              href="https://www.linkedin.com/in/guilherme-pappi/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} strokeWidth={1.5} />
            </a>
            <a
              href="https://github.com/404Gui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github size={20} strokeWidth={1.5} />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
