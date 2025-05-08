'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const { user, loading, setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await api.post('/login', data);
      const { access_token } = res.data;

      if (!access_token) throw new Error('Token não retornado');

      Cookies.set('token', access_token);

      const me = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      router.push('/dashboard');
    } catch (err) {
      alert('Login inválido');
      console.error(err);
    }
  };

  if (loading || user) return <LoadingSpinner/>;

  return (
    <main className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Entrar</h2>
        <input {...register('username')} placeholder="Usuário" className="input mb-2 w-full" />
        <input {...register('password')} type="password" placeholder="Senha" className="input mb-4 w-full" />
        <button type="submit" className="btn w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </main>
  );
}
