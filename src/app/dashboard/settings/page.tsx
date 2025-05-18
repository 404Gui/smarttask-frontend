"use client";

import React, { useEffect, useState } from "react";
import styles from "./settings.module.css";
import api from "@/services/api";
import { Toaster, toast } from "sonner";
import Header from "@/components/Header/Header";

export default function SettingsPage() {
  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
  } | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  useEffect(() => {
    api
      .get("/me")
      .then((res) => setUser(res.data))
      .catch(() => toast.error("Erro ao carregar informações do usuário."));
  }, []);

  const handleEmailChange = async () => {
    try {
      await api.put("/change-email", { new_email: newEmail });
      toast.success(
        "Solicitação de troca de e-mail enviada. Verifique sua caixa de entrada."
      );
      setNewEmail("");
    } catch (err) {
      toast.error("Erro ao solicitar troca de e-mail.");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await api.put("/change-password", {
        current_password: passwords.current,
        new_password: passwords.new,
      });
      toast.success("Senha alterada com sucesso.");
      setPasswords({ current: "", new: "" });
    } catch (err) {
      toast.error("Erro ao trocar a senha.");
    }
  };

  return (
    <>
      <Header />
      <div className={styles.settingsPage}>
        <h1>Configurações da Conta</h1>

        {user && (
          <>
            <div className={styles.section}>
              <h2>Informações do Usuário</h2>
              <p>
                <strong>Usuário:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>E-mail</h2>
                <button
                  className={styles.editButton}
                  onClick={() => setEditingEmail(!editingEmail)}
                >
                  {editingEmail ? "Cancelar" : "Editar"}
                </button>
              </div>

              {editingEmail ? (
                <>
                  <input
                    type="email"
                    placeholder="Novo e-mail"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={styles.input}
                  />
                  <button className={styles.button} onClick={handleEmailChange}>
                    Enviar solicitação
                  </button>
                </>
              ) : (
                <p>{user.email}</p>
              )}
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Senha</h2>
                <button
                  className={styles.editButton}
                  onClick={() => setEditingPassword(!editingPassword)}
                >
                  {editingPassword ? "Cancelar" : "Editar"}
                </button>
              </div>

              {editingPassword && (
                <>
                  <input
                    type="password"
                    placeholder="Senha atual"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                    className={styles.input}
                  />
                  <input
                    type="password"
                    placeholder="Nova senha"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                    className={styles.input}
                  />
                  <button
                    className={styles.button}
                    onClick={handlePasswordChange}
                  >
                    Alterar senha
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
