'use client';
import { useState } from 'react';
import styles from './AddTaskForm.module.css';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
    onSubmit: (data: {
        title: string;
        description: string;
        priority: string
        ; due_date: string | null
    }) => void;
};

export default function AddTaskForm({ onSubmit }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('alta');
    const [dueDate, setDueDate] = useState<Date | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!title.trim() || !description.trim()) return;
    
        try {
            await onSubmit({
                title,
                description,
                priority,
                due_date: dueDate ? dueDate.toISOString() : null
            });
            setTitle('');
            setDescription('');
            setPriority('média');
            setIsOpen(false);
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
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

                    <div style={{ marginTop: '10px' }}>
                        <label style={{ fontWeight: 500 }}>Data de vencimento:</label>
                        <DatePicker
                            selected={dueDate}
                            onChange={date => setDueDate(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Selecione uma data"
                            className={styles.datePicker}
                            minDate={new Date()}
                            isClearable
                        />
                    </div>
                    
                    <div className={styles.buttons}>
                        <button type="submit">Adicionar</button>
                        <button type="button" onClick={() => setIsOpen(false)}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>

    );
}
