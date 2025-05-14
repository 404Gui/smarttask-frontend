import { ListItem } from "@/types/list";

export function exportListItemsToCSV(items: ListItem[], listTitle: string) {
  if (!items || items.length === 0) return;

  const headers = ["Nome", "Marcado"];
  const rows = items.map(item => [
    `"${item.content}"`,
    item.checked ? "Sim" : "Nao",
  ]);

  const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${listTitle}.csv`);
  link.click();
}
