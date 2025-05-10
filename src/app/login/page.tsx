"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import LoginForm from "@/components/AuthForms/LoginForm/LoginForm";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return <LoadingOverlay show={loading} mensagem={"Autenticando usuário"} />;

  return (
    <AuthLayout title="Entrar">
      <LoginForm />
    </AuthLayout>
  );
}
