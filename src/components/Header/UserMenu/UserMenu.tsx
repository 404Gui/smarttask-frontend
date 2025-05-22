'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './UserMenu.module.css';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  if (!user) return null;

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.avatar} onClick={() => setMenuOpen(!menuOpen)}>
        <img
          src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
          alt="avatar"
          className={styles.avatarImg}
        />
        <span className={styles.username}>{user.username}</span>
      </div>
      {menuOpen && (
        <div className={styles.dropdownMenu}>
          <button onClick={() =>
            router.push('/dashboard/settings')}>
            Configurações</button>
          <button onClick={() => {
            logout();
            router.push('/')
          }}>Sair</button>
        </div>
      )}
    </div>
  );
}
