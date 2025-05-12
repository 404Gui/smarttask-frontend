import { useState, useEffect } from "react";
import styles from "./ListSection.module.css";
import { getLists } from "@/services/lists";
import { List } from "@/types/list";
import Drawer from "./Drawer/Drawer";

export default function ListSection() {
  const [lists, setLists] = useState<List[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);

  const fetchLists = async () => {
    try {
      const data = await getLists();
      setLists(data);
    } catch (error) {
      console.error("Erro ao buscar listas", error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Suas Listas</h1>
        <button onClick={() => setShowDrawer(true)} className={styles.newButton}>
          + Nova Lista
        </button>
      </div>

      {lists.length === 0 ? (
        <p className={styles.empty}>Você ainda não criou nenhuma lista.</p>
      ) : (
        <div className={styles.grid}>
          {lists.map((list) => (
            <div key={list.id} className={styles.card}>
              <h2>{list.title}</h2>
              <p>{list.items.length} itens</p>
              <button>Ver Lista</button>
            </div>
          ))}
        </div>
      )}

      {showDrawer && (
        <Drawer
          onClose={() => setShowDrawer(false)}
          onCreated={fetchLists}
        />
      )}
    </section>
  );
}
