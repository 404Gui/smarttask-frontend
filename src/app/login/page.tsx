'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),  
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await api.post('/login', data);
      Cookies.set('token', res.data.access_token);
      router.push('/dashboard');
    } catch (err) {
      alert('Login inválido');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Entrar</h2>
        <input {...register('username')} placeholder="Usuário" className="input mb-2 w-full" />
        
        <input {...register('password')} type="password" placeholder="Senha" className="input mb-4 w-full" />
        <button type="submit" className="btn w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </main>
  );
}
