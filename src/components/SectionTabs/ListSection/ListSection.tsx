import { useState } from "react";
import styles from "./ListSection.module.css";
import { deleteList } from "@/services/lists";
import { List } from "@/types/list";
import Drawer from "./Drawers/CreateListDrawer/CreateListDrawer";
import ViewListDrawer from "./Drawers/ViewListDrawer/ViewListDrawer";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog/DeleteConfirmDialog";
import { Trash2 } from "lucide-react";
import SearchListInput from "@/components/SearchListInput/SearchListInput";

type ListSectionProps = {
  lists: List[];
  refreshLists: () => void;
};

export default function ListSection({ lists, refreshLists }: ListSectionProps) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<List | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLists = lists.filter((list) =>
    list.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreated = (newList: List) => {
    refreshLists();       
    setShowDrawer(false); 
    setSelectedList(newList);  
  };

  const handleDeleteList = async () => {
    if (!listToDelete) return;
    try {
      await deleteList(listToDelete.id);
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
      </div>

      <SearchListInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar listas..."
      >
        <button
          onClick={() => setShowDrawer(true)}
          className={styles.newButton}
        >
          + Nova Lista
        </button>
      </SearchListInput>

      {lists.length === 0 ? (
        <p className={styles.empty}>Você ainda não criou nenhuma lista.</p>
      ) : filteredLists.length === 0 ? (
        <p className={styles.empty}>Nenhuma lista encontrada.</p>
      ) : (
        <div className={styles.grid}>
          {filteredLists.map((list) => (
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
        <Drawer
          onClose={() => setShowDrawer(false)}
          onCreated={handleCreated}  
        />
      )}
      {selectedList && (
        <ViewListDrawer
          list={selectedList}
          onClose={() => setSelectedList(null)}
          onUpdated={refreshLists}
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
