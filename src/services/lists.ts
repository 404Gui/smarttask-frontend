import api from './api';
import { List, ListItem } from '../types/list';

export const getLists = async () => {
  const response = await api.get('/lists');
  return response.data;
};

export const createList = async (data: { title: string; items: ListItem[] }) => {
  const response = await api.post('/lists', data);
  return response.data;
};

export const addItemToList = async (listId: number, itemData: ListItem) => {
  const response = await api.post(`/lists/${listId}/items`, itemData);
  return response.data;
};
