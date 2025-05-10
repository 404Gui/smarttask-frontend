"use client";
import { z } from "zod";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import RegisterForm from "@/components/AuthForms/RegisterForm/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout title="Registrar">
      <RegisterForm />
    </AuthLayout>
  );
}
