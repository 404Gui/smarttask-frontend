import styles from './ViewListDrawer.module.css';
import { X, Plus, CheckSquare, Square } from 'lucide-react';
import { useState } from 'react';
import { List, ListItem } from '@/types/list';
import { updateList } from '@/services/lists';

interface ViewListDrawerProps {
  list: List;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ViewListDrawer({ list, onClose, onUpdated }: ViewListDrawerProps) {
  const [items, setItems] = useState<ListItem[]>(list.items);
  const [newItemText, setNewItemText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleItem = (index: number) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    const trimmed = newItemText.trim();
    if (trimmed) {
      const newItem: ListItem = {
        id: Date.now(),
        content: trimmed,
        checked: false,
      };
      setItems(prev => [...prev, newItem]);
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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{list.title}</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <label htmlFor="item">Adicionar item</label>
          <div className={styles.itemInputGroup}>
            <input
              type="text"
              id="item"
              value={newItemText}
              onChange={e => setNewItemText(e.target.value)}
              className={styles.input}
              placeholder="Ex: Sabonete"
            />
            <button
              type="button"
              onClick={addItem}
              className={styles.addItemBtn}
              disabled={!newItemText.trim()}
            >
              <Plus size={16} />
            </button>
          </div>

          <ul className={styles.itemList}>
            {items.map((item, i) => (
              <li key={i} className={styles.item}>
                <button
                  type="button"
                  onClick={() => toggleItem(i)}
                  className={styles.checkBtn}
                >
                  {item.checked ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
                <span className={item.checked ? styles.checked : ""}>{item.content}</span>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className={styles.removeBtn}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </aside>
    </div>
  );
}
