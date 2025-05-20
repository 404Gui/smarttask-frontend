"use client";

import React, { useEffect, useState } from "react";
import styles from "./settings.module.css";
import api from "@/services/api";
import { Toaster, toast } from "sonner";
import Header from "@/components/Header/Header";
import { ArrowLeft, Pencil, X } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
  } | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [newUserName, setNewUsername] = useState("");

  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);

  useEffect(() => {
    api
      .get("/me")
      .then((res) => setUser(res.data))
      .catch(() => toast.error("Erro ao carregar informações do usuário."));
  }, []);

  const handleEmailChange = async () => {
    try {
      await api.put("/change-email", { new_email: newEmail });
      toast.success("Solicitação de troca de e-mail enviada.");
      setNewEmail("");
      setEditingEmail(false);
    } catch (err) {
      console.log(err)
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
      setEditingPassword(false);
    } catch (err) {
      console.log(err)
      toast.error("Erro ao trocar a senha.");
    }
  };

  const handleUsernameChange = async () => {
    try {
      await api.put("/change-username", {
        new_username: newUserName,
      });
      toast.success("Usuário alterado!");
      setNewUsername("");
      setEditingUsername(false);
    } catch (err) {
      console.log(err)
      toast.error("Erro ao alterar usuário!.");
    }
  };

  return (
    <div className={styles.page}>
      <Header />

       <button
        className={styles.goBackBtn}
        onClick={() => (window.location.href = "/dashboard")}
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className={styles.settingsPage}>
        <h1 className={styles.title}>Configurações da Conta</h1>

        {user && (
          <div className={styles.card}>
            <div className={styles.row}>
              <span>
                <strong>Usuário:</strong>
              </span>
              {editingUsername ? (
                <div className={styles.editArea}>
                  <input
                    type="text"
                    placeholder="Novo nome de usuário"
                    value={newUserName}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className={styles.input}
                  />
                  <div className={styles.buttonRow}>
                    <button
                      className={styles.button}
                      onClick={handleUsernameChange}
                    >
                      Confirmar
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={() => {
                        setEditingUsername(false);
                        setNewUsername("");
                      }}
                    >
                      <X size={16} /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.displayRow}>
                  <span>{user.username}</span>
                  <button
                    className={styles.iconButton}
                    onClick={() => setEditingUsername(true)}
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className={styles.row}>
              <span>
                <strong>Email:</strong>
              </span>
              {editingEmail ? (
                <div className={styles.editArea}>
                  <input
                    type="email"
                    placeholder="Novo e-mail"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={styles.input}
                  />
                  <div className={styles.buttonRow}>
                    <button
                      className={styles.button}
                      onClick={handleEmailChange}
                    >
                      Confirmar
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={() => {
                        setEditingEmail(false);
                        setNewEmail("");
                      }}
                    >
                      <X size={16} /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.displayRow}>
                  <span>{user.email}</span>
                  <button
                    className={styles.iconButton}
                    onClick={() => setEditingEmail(true)}
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className={styles.row}>
              <span>
                <strong>Senha:</strong>
              </span>
              {editingPassword ? (
                <div className={styles.editArea}>
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
                  <div className={styles.buttonRow}>
                    <button
                      className={styles.button}
                      onClick={handlePasswordChange}
                    >
                      Alterar Senha
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={() => {
                        setEditingPassword(false);
                        setPasswords({ current: "", new: "" });
                      }}
                    >
                      <X size={16} /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.displayRow}>
                  <span>••••••••</span>
                  <button
                    className={styles.iconButton}
                    onClick={() => setEditingPassword(true)}
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
