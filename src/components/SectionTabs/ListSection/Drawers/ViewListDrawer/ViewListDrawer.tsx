import styles from "./ViewListDrawer.module.css";
import {
  X,
  Plus,
  CheckSquare,
  Square,
  Download,
  ListChecks,
  Clock,
  CheckCircle,
  ListTodo,
  ClipboardCheck,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { List, ListItem } from "@/types/list";
import { updateList } from "@/services/lists";
import { exportListItemsToCSV } from "@/util/exportToCSV";

interface ViewListDrawerProps {
  list: List;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ViewListDrawer({
  list,
  onClose,
  onUpdated,
}: ViewListDrawerProps) {
  const [items, setItems] = useState<ListItem[]>(list.items);
  const [newItemText, setNewItemText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleItem = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    const trimmed = newItemText.trim();
    if (trimmed) {
      const newItem: ListItem = {
        id: Date.now(),
        content: trimmed,
        checked: false,
      };
      setItems((prev) => [...prev, newItem]);
      setNewItemText("");
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateList(list.id, { title: list.title, items });
      onUpdated();
      onClose();
    } catch (err) {
      setError("Erro ao atualizar a lista.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const total = items.length;
  const checkedCount = items.filter((i) => i.checked).length;
  const uncheckedItems = items.filter((i) => !i.checked);
  const checkedItems = items.filter((i) => i.checked);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>{list.title}</h2>
          <div className={styles.actions}>
            <button
              onClick={() => exportListItemsToCSV(items, list.title)}
              className={styles.exportBtn}
              title="Exportar como CSV"
            >
              <Download size={25} />
            </button>
            <button
              onClick={onClose}
              className={styles.closeBtn}
              aria-label="Fechar"
            >
              <X size={30} />
            </button>
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.statusBar}>
            <div
              className={styles.statusItem}
              style={{ backgroundColor: "#2d3e50" }}
            >
              <ListChecks size={18} color="#60a5fa" />
              <span>Total</span>
              <strong style={{ color: "#60a5fa" }}>{total}</strong>
            </div>
            <div
              className={styles.statusItem}
              style={{ backgroundColor: "#4b3f2f" }}
            >
              <Clock size={18} color="#facc15" />
              <span>Pendentes</span>
              <strong style={{ color: "#facc15" }}>
                {total - checkedCount}
              </strong>
            </div>
            <div
              className={styles.statusItem}
              style={{ backgroundColor: "#1e3a2f" }}
            >
              <CheckCircle size={18} color="#22c55e" />
              <span>Marcados</span>
              <strong style={{ color: "#22c55e" }}>{checkedCount}</strong>
            </div>
          </div>

          <label htmlFor="newItem" className={styles.label}>
            Adicionar item
          </label>
          <div className={styles.itemInputGroup}>
            <input
              type="text"
              id="newItem"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className={styles.input}
              placeholder="Digite algo"
            />
            <button
              type="button"
              onClick={addItem}
              className={styles.addItemBtn}
              disabled={!newItemText.trim()}
              title="Adicionar item"
            >
              <Plus size={18} />
            </button>
          </div>

          {uncheckedItems.length > 0 && (
            <>
              <h4 className={styles.sectionTitle}>
                <ClipboardList size={16} style={{ marginRight: 6 }} />
                Itens pendentes
              </h4>
              <ul className={styles.itemList}>
                {uncheckedItems.map((item, index) => (
                  <li key={item.id} className={styles.item}>
                    <button
                      type="button"
                      onClick={() => toggleItem(items.indexOf(item))}
                      className={styles.checkBtn}
                      aria-label="Marcar item"
                    >
                      <Square size={20} />
                    </button>
                    <span className={styles.content}>{item.content}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(items.indexOf(item))}
                      className={styles.removeBtn}
                      aria-label="Remover item"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {checkedItems.length > 0 && (
            <>
              <h4 className={styles.sectionTitle}>
                <ClipboardCheck size={16} style={{ marginRight: 6 }} />
                Itens marcados
              </h4>
              <ul className={styles.itemList}>
                {checkedItems.map((item, index) => (
                  <li key={item.id} className={styles.item}>
                    <button
                      type="button"
                      onClick={() => toggleItem(items.indexOf(item))}
                      className={styles.checkBtn}
                      aria-label="Desmarcar item"
                    >
                      <CheckSquare size={20} />
                    </button>
                    <span className={`${styles.content} ${styles.checked}`}>
                      {item.content}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(items.indexOf(item))}
                      className={styles.removeBtn}
                      aria-label="Remover item"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </aside>
    </div>
  );
}
