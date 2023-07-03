import axios from 'axios';
import queryString from 'query-string';
import { SlideInterface, SlideGetQueryInterface } from 'interfaces/slide';
import { GetQueryInterface } from '../../interfaces';

export const getSlides = async (query?: SlideGetQueryInterface) => {
  const response = await axios.get(`/api/slides${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSlide = async (slide: SlideInterface) => {
  const response = await axios.post('/api/slides', slide);
  return response.data;
};

export const updateSlideById = async (id: string, slide: SlideInterface) => {
  const response = await axios.put(`/api/slides/${id}`, slide);
  return response.data;
};

export const getSlideById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/slides/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSlideById = async (id: string) => {
  const response = await axios.delete(`/api/slides/${id}`);
  return response.data;
};
