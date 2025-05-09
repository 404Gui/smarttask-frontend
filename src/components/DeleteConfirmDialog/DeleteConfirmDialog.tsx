'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DeleteConfirmDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          className="p-2 rounded hover:bg-[var(--hover-bg)]"
          title="Excluir tarefa"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 size={18} />
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />

        <AnimatePresence>
          <AlertDialog.Content forceMount>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                bg-[var(--card-bg)] text-[var(--foreground)] p-6 rounded-lg 
                shadow-lg w-[90%] max-w-md border border-[var(--divider)]"
            >
              <AlertDialog.Title className="text-lg font-medium">
                Confirmar exclusão
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-2 text-sm text-[var(--muted)]">
                Você tem certeza que deseja excluir esta tarefa? Essa ação não pode ser desfeita.
              </AlertDialog.Description>

              <div className="mt-6 flex justify-end gap-3">
                <AlertDialog.Cancel
                  className="px-4 py-2 rounded bg-transparent border border-[var(--divider)] 
                  text-[var(--input-text)] hover:bg-[var(--hover-bg)]"
                >
                  Cancelar
                </AlertDialog.Cancel>
                <AlertDialog.Action
                  asChild
                >
                  <button
                    onClick={onConfirm}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </AlertDialog.Action>
              </div>
            </motion.div>
          </AlertDialog.Content>
        </AnimatePresence>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
