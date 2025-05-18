'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/services/api';
import styles from '@/app/dashboard/settings/settings.module.css';


export default function ChangeEmailForm() {
  const [newEmail, setNewEmail] = useState('');

  const handleEmailChange = async () => {
    try {
      await api.put('/change-email', { new_email: newEmail });
      toast.success('Solicitação de troca de e-mail enviada. Verifique sua caixa de entrada.');
      setNewEmail('');
    } catch {
      toast.error('Erro ao solicitar troca de e-mail.');
    }
  };

  return (
    <div className={styles.section}>
      <h2>Alterar E-mail</h2>
      <div className={styles.inputsRow}>
        <input
          className={styles.input}
          type="email"
          placeholder="Novo e-mail"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button className={styles.button} onClick={handleEmailChange}>
          Enviar solicitação
        </button>
      </div>
    </div>
  );
}
