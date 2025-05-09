"use client";
import styles from "./LoginForm.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import { useState } from "react";

const loginSchema = z.object({
  username: z.string(),
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
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <input {...register("username")} placeholder="Usuário" />
      <input {...register("password")} placeholder="Senha" type="password" />
      <button type="submit" onClick={() => {}}>
        Entrar
      </button>
      <LoadingOverlay show={loading} mensagem={"Autenticando usuário"} />
    </form>
  );
}
