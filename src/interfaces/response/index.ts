import { PollInterface } from 'interfaces/poll';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ResponseInterface {
  id?: string;
  answer: string;
  poll_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  poll?: PollInterface;
  user?: UserInterface;
  _count?: {};
}

export interface ResponseGetQueryInterface extends GetQueryInterface {
  id?: string;
  answer?: string;
  poll_id?: string;
  user_id?: string;
}
