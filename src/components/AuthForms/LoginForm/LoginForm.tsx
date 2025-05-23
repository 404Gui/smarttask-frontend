"use client";
import styles from "./LoginForm.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { register, handleSubmit } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams?.get("token");

    const loginWithGoogle = async () => {
      if (!token) return;

      try {
        Cookies.set("token", token);
        const me = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(me.data);
        router.push("/dashboard");
      } catch (err) {
        alert("Erro ao autenticar com Google");
        console.error(err);
      }
    };

    loginWithGoogle();
  }, []);

  const onSubmit = async (data: LoginData) => {
    try {
      setLoading(true);
      const res = await api.post("/login", data);
      const token = res.data.access_token;

      if (!token) throw new Error("Token não retornado");
      Cookies.set("token", token);

      const me = await api.get("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(me.data);
      router.push("/dashboard");
    } catch {
      alert("Login inválido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input {...register("email")} placeholder="Digite seu e-mail" />
        <input {...register("password")} placeholder="Senha" type="password" />
        <button type="submit" onClick={() => {}}>
          Entrar
        </button>
        <button
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`;
          }}
          type="button"
          className={styles.googleBtn}
        >
          <Image
            src="https://auth-backend.smarttask.io/images/logo/google-icon.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Entrar com Google
        </button>

        <p className={styles.loginPrompt}>
          Não tem cadastro? <a href="/register">Faça o registro</a>
        </p>

      </form>
    </>
  );
}
