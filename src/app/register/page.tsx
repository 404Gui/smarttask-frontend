// app/register/page.tsx
"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import RegisterForm from "@/components/AuthForms/LoginForm/RegisterForm/RegisterForm";

const registerSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post("/register", data);
      alert("Usuário registrado com sucesso!");
      router.push("/login");
    } catch (err: any) {
      console.error(err, "Erro do lado");
      alert(err.response?.data?.detail || "Erro no registro");
    }
  };

  return (
    <AuthLayout title="Registrar">
      <RegisterForm />
    </AuthLayout>
  );
}
