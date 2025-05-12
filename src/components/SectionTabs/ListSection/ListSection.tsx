import styles from "./ListSection.module.css"

export default function ListSection() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Suas Listas</h1>
      <p className={styles.empty}>Você ainda não criou nenhuma lista.</p>
    </section>
  )
}
