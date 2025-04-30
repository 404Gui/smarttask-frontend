'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
    username: z.string().min(3, 'Mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
  });
  

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post('/register', data);
      alert('Usuário registrado com sucesso!');
      router.push('/login');
    } catch (err: any) {
        console.error(err, "Erro do lado")
      alert(err.response?.data?.detail || 'Erro no registro');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Registrar</h2>
        
        <input {...register('username')} placeholder="Usuário" className="input mb-2 w-full border rounded p-2" />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        <input {...register('email')} type="email" placeholder="Email" className="input mb-2 w-full border rounded p-2" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        
        <input {...register('password')} type="password" placeholder="Senha" className="input mb-2 w-full border rounded p-2" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button type="submit" className="btn w-full bg-blue-600 text-white py-2 rounded">Registrar</button>
      </form>
    </main>
  );
}
