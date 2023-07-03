import axios from 'axios';
import queryString from 'query-string';
import { PresentationInterface, PresentationGetQueryInterface } from 'interfaces/presentation';
import { GetQueryInterface } from '../../interfaces';

export const getPresentations = async (query?: PresentationGetQueryInterface) => {
  const response = await axios.get(`/api/presentations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPresentation = async (presentation: PresentationInterface) => {
  const response = await axios.post('/api/presentations', presentation);
  return response.data;
};

export const updatePresentationById = async (id: string, presentation: PresentationInterface) => {
  const response = await axios.put(`/api/presentations/${id}`, presentation);
  return response.data;
};

export const getPresentationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/presentations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePresentationById = async (id: string) => {
  const response = await axios.delete(`/api/presentations/${id}`);
  return response.data;
};
