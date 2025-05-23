"use client";
import styles from "./RegisterForm.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const registerSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await api.post("/register", data);
      alert("Usuário registrado com sucesso!");
      router.push("/login");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { detail?: string } } };
        alert(axiosError.response?.data?.detail || "Erro no registro");
      } else {
        alert("Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input
          {...register("username")}
          placeholder="Usuário"
          className={styles.input}
        />
        {errors.username && (
          <p className={styles.error}>{errors.username.message}</p>
        )}

        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className={styles.input}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <input
          {...register("password")}
          type="password"
          placeholder="Senha"
          className={styles.input}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}

        <button type="submit" className={styles.submitButton}>
          Registrar
        </button>

        <p className={styles.loginPrompt}>
          Já tem uma conta? <a href="/login">Faça o login</a>
        </p>
      </form>
    </>
  );
}
