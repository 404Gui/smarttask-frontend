'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

export default function GoogleCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params?.get('token');
  const { setUser } = useAuth();

  useEffect(() => {
    const handleLogin = async () => {
      if (token) {
        Cookies.set('token', token);

        try {
          const res = await api.get('/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
          router.push('/dashboard');
        } catch (err) {
          console.error('Erro ao buscar usuário', err);
          router.push('/login');
        }
      }
    };

    handleLogin();
  }, [token, setUser, router]);

  return <p className="text-center mt-10">Autenticando com Google...</p>;
}