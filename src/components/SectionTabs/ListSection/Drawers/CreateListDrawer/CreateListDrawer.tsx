import styles from './CreateListDrawer.module.css';
import { X, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { createList } from '@/services/lists';
import { ListItem } from '@/types/list'; 

interface DrawerProps {
  onClose: () => void;
  onCreated: () => void;
  title?: string;
}

export default function Drawer({ onClose, onCreated, title = "Nova Lista" }: DrawerProps) {
  const [listTitle, setListTitle] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [items, setItems] = useState<ListItem[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addItem = () => {
    const trimmed = itemInput.trim();
    if (trimmed) {
      const newItem: ListItem = {
        id: Date.now(), 
        content: trimmed,
        checked: false,
      };
      setItems(prev => [...prev, newItem]);
      setItemInput("");
    }
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listTitle.trim()) {
      setError("O título não pode ser vazio.");
      return;
    }
    if (items.length === 0) {
      setError("Adicione ao menos um item.");
      return;
    }

    try {
      setLoading(true);
      
      await createList({ title: listTitle, items });
      setListTitle("");
      setItems([]);
      setError("");
      onCreated();
      onClose();
    } catch (err) {
      setError("Erro ao criar lista.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>
        <button type="button" className={styles.iaBtn} >
          <Sparkles size={16} /> Gerar com ajuda da IA
        </button>

        <form className={styles.body} onSubmit={handleSubmit}>
          <label htmlFor="title">Título da lista</label>
          <input
            type="text"
            id="title"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            className={styles.input}
            placeholder="Ex: Compras do mês"
          />

          <label htmlFor="item">Itens</label>
          <div className={styles.itemInputGroup}>
            <input
              type="text"
              id="item"
              value={itemInput}
              onChange={(e) => setItemInput(e.target.value)}
              className={styles.input}
              placeholder="Ex: Arroz"
            />
            <button
              type="button"
              onClick={addItem}
              className={styles.addItemBtn}
              disabled={!itemInput.trim()}
            >
              <Plus size={16} />
            </button>
          </div>

          <ul className={styles.itemList}>
            {items.map((item, i) => (
              <li key={i} className={styles.item}>
                <span>{item.content}</span>
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

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Criando..." : "Criar Lista"}
          </button>
        </form>
      </aside>
    </div>
  );
}
