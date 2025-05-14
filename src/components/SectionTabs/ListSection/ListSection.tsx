import { useState, useEffect } from "react";
import styles from "./ListSection.module.css";
import { getLists, deleteList } from "@/services/lists";
import { List } from "@/types/list";
import Drawer from "./Drawers/CreateListDrawer/CreateListDrawer";
import ViewListDrawer from "./Drawers/ViewListDrawer/ViewListDrawer";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog/DeleteConfirmDialog";
import { Trash2 } from "lucide-react";

type ListSectionProps = {
  initialLists: List[];
  refreshLists: () => void;
};

export default function ListSection({
  initialLists,
  refreshLists,
}: ListSectionProps) {
  const [lists, setLists] = useState<List[]>(initialLists);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<List | null>(null);

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

  const handleDeleteList = async () => {
    if (!listToDelete) return;
    try {
      await deleteList(listToDelete.id);
      setLists((prev) => prev.filter((l) => l.id !== listToDelete.id));
      await refreshLists();
    } catch (e) {
      console.error("Erro ao excluir", e);
    } finally {
      setConfirmOpen(false);
      setListToDelete(null);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Suas Listas</h1>
        <button
          onClick={() => setShowDrawer(true)}
          className={styles.newButton}
        >
          + Nova Lista
        </button>
      </div>

      {lists.length === 0 ? (
        <p className={styles.empty}>Você ainda não criou nenhuma lista.</p>
      ) : (
        <div className={styles.grid}>
          {lists.map((list) => (
            <div
              key={list.id}
              className={styles.card}
              onClick={() => setSelectedList(list)}
            >
              <div className={styles.cardContent}>
                <div
                  className={styles.cardText}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedList(list)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedList(list)}
                >
                  <h2 className={styles.cardTitle}>{list.title}</h2>
                  <p className={styles.cardItems}>
                    {list.items.length}{" "}
                    {list.items.length === 1 ? "item" : "itens"}
                  </p>
                </div>

                <button
                  className={styles.deleteButton}
                  title="Excluir lista"
                  onClick={(e) => {
                    e.stopPropagation();
                    setListToDelete(list);
                    setConfirmOpen(true);
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDrawer && (
        <Drawer onClose={() => setShowDrawer(false)} onCreated={fetchLists} />
      )}

      {selectedList && (
        <ViewListDrawer
          list={selectedList}
          onClose={() => setSelectedList(null)}
          onUpdated={fetchLists}
        />
      )}

      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Excluir lista "${listToDelete?.title}"?`}
        message="Essa ação não pode ser desfeita."
        onConfirm={handleDeleteList}
      />
    </section>
  );
}
