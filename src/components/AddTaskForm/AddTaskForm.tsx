'use client';
import { useState } from 'react';
import styles from './AddTaskForm.module.css';

type Props = {
    onSubmit: (data: { title: string; description: string; priority: string }) => void;
};

export default function AddTaskForm({ onSubmit }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('média');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;
        onSubmit({ title, description, priority });
        setTitle('');
        setDescription('');
        setPriority('média');
        setIsOpen(false);
    };

    return (
        <div className={styles.wrapper}>
            <button onClick={() => setIsOpen(prev => !prev)} className={styles.fab}>
                {isOpen ? 'Cancelar' : 'Adicionar'}
            </button>

            <div className={`${styles.formWrapper} ${isOpen ? styles.open : ''}`}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Título"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Descrição"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <select value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="baixa">Baixa</option>
                        <option value="média">Média</option>
                        <option value="alta">Alta</option>
                    </select>
                    <div className={styles.buttons}>
                        <button type="submit">Adicionar</button>
                        <button type="button" onClick={() => setIsOpen(false)}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>

    );
}
