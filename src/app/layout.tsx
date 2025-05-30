import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import LayoutClientWrapper from "@/components/LayoutClientWrapper/LayoutClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taskoom",
  description:
    "Taskoom é um aplicativo de gerenciamento de tarefas moderno e eficiente, projetado para aumentar sua produtividade com recursos inteligentes e uma interface intuitiva.",
  keywords: [
    "Taskoom",
    "gerenciador de tarefas",
    "produtividade",
    "organização",
    "to-do list",
    "task manager",
    "tarefas inteligentes",
    "Next.js",
    "FastAPI",
  ],
  authors: [{ name: "Pappi Dev", url: "https://www.pappi.dev" }],
  openGraph: {
    title: "Taskoom - Gerencie suas tarefas com praticidade",
    description:
      "Organize, priorize e conclua suas tarefas com o Taskoom — um app inteligente feito com Next.js e FastAPI.",
    url: "https://www.taskoom.com",
    siteName: "Taskoom",    
    locale: "pt_BR",
    type: "website",
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors position="top-right" />
        <LayoutClientWrapper>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </LayoutClientWrapper>
      </body>
    </html>
  );
}
