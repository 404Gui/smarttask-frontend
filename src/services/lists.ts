import api from './api';
import {ListItem } from '../types/list';

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

export const updateList = async (
  listId: number,
  data: { title: string; items: ListItem[] }
) => {
  const response = await api.put(`/lists/${listId}`, data);
  return response.data;
};


export const deleteList = async (listId: number) => {
  await api.delete(`/lists/${listId}`);
};

export const generateListFromText = async (text: string) => {
  const response = await api.post('/lists/generate-from-text', { text });
  return response.data;
};