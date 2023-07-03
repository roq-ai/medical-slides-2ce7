import axios from 'axios';
import queryString from 'query-string';
import { PollInterface, PollGetQueryInterface } from 'interfaces/poll';
import { GetQueryInterface } from '../../interfaces';

export const getPolls = async (query?: PollGetQueryInterface) => {
  const response = await axios.get(`/api/polls${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPoll = async (poll: PollInterface) => {
  const response = await axios.post('/api/polls', poll);
  return response.data;
};

export const updatePollById = async (id: string, poll: PollInterface) => {
  const response = await axios.put(`/api/polls/${id}`, poll);
  return response.data;
};

export const getPollById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/polls/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePollById = async (id: string) => {
  const response = await axios.delete(`/api/polls/${id}`);
  return response.data;
};
