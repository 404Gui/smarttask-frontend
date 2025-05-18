'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/services/api';
import styles from '@/app/dashboard/settings/settings.module.css';

export default function ChangePasswordForm() {
  const [passwords, setPasswords] = useState({ current: '', new: '' });

  const handlePasswordChange = async () => {
    try {
      await api.put('/change-password', {
        current_password: passwords.current,
        new_password: passwords.new,
      });
      toast.success('Senha alterada com sucesso.');
      setPasswords({ current: '', new: '' });
    } catch {
      toast.error('Erro ao trocar a senha.');
    }
  };

  return (
    <div className={styles.section}>
      <h2>Alterar Senha</h2>
      <div className={styles.inputsRow}>
        <input
          className={styles.input}
          type="password"
          placeholder="Senha atual"
          value={passwords.current}
          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Nova senha"
          value={passwords.new}
          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
        />
      </div>
      <button className={styles.button} onClick={handlePasswordChange}>
        Alterar senha
      </button>
    </div>
  );
}
