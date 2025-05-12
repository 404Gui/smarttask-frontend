export type ListItem = {
  id: number;
  content: string;
  checked: boolean;
};

export type List = {
  id: number;
  title: string;
  items: ListItem[];
};
