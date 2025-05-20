import styles from "./CreateListDrawer.module.css";
import { X, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { createList, generateListFromText } from "@/services/lists";
import { ListItem } from "@/types/list";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";

interface DrawerProps {
  onClose: () => void;
  onCreated: () => void;
  title?: string;
}

export default function Drawer({
  onClose,
  onCreated,
  title = "Nova Lista",
}: DrawerProps) {
  const [listTitle, setListTitle] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [iaMode, setIaMode] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const addItem = () => {
    const trimmed = itemInput.trim();
    if (trimmed) {
      const newItem: ListItem = {
        id: Date.now(),
        content: trimmed,
        checked: false,
      };
      setItems((prev) => [...prev, newItem]);
      setItemInput("");
    }
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
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

 const handleGenerateList = async () => {
  if (!inputVal.trim()) return;

  try {
    setLoading(true);
    const novaLista = await generateListFromText(inputVal);
    console.log("Lista gerada com IA:", novaLista);

    setListTitle(novaLista.title);
    setItems(novaLista.items.map((item: any) => ({
      id: Date.now() + Math.random(),
      content: item.content,
      checked: item.checked ?? false,
    })));
    setIaMode(false);
    setError("");
  } catch (error) {
    console.error("Erro ao gerar lista com IA:", error);
    setError("Erro ao gerar lista com IA.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </header>

        <section className={styles.iaSection}>
          {!iaMode ? (
            <>
              <p className={styles.iaPreviewText}>
                Deixe a IA te ajudar a criar uma lista personalizada.
              </p>
              <button
                type="button"
                className={styles.iaTryBtn}
                onClick={() => setIaMode(true)}
              >
                ✨ Experimentar IA
              </button>
            </>
          ) : (
            <div className={styles.iaInputArea}>
              <label htmlFor="iaInput" className={styles.iaLabel}>
                Descreva o que você precisa:
              </label>
              <textarea
                id="iaInput"
                className={styles.iaTextarea}
                placeholder="Ex: Crie uma lista de viagem com roupas, documentos, carregador..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />

              <button
                type="button"
                className={styles.iaSubmitBtn}
                onClick={handleGenerateList}
              >
                <Sparkles size={16} />
                Gerar com IA
              </button>
            </div>
          )}
        </section>

        <form className={styles.body} onSubmit={handleSubmit}>
          <section className={styles.formSection}>
            <label htmlFor="title" className={styles.label}>
              Título da lista
            </label>
            <input
              type="text"
              id="title"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              className={styles.input}
              placeholder="Ex: Compras do mês"
            />
          </section>

          <section className={styles.formSection}>
            <label htmlFor="item" className={styles.label}>
              Adicionar itens
            </label>
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
          </section>

          <section className={styles.itemListSection}>
            <label className={styles.label}>Itens adicionados</label>
            {items.length > 0 ? (
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
            ) : (
              <p className={styles.empty}>Nenhum item foi adicionado.</p>
            )}
          </section>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <LoadingOverlay show={loading} mensagem={"Gerando lista"} />
            ) : (
              "Criar Lista"
            )}
          </button>
        </form>
      </aside>
    </div>
  );
}
