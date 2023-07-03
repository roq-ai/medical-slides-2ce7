import { ResponseInterface } from 'interfaces/response';
import { SlideInterface } from 'interfaces/slide';
import { GetQueryInterface } from 'interfaces';

export interface PollInterface {
  id?: string;
  question: string;
  slide_id?: string;
  created_at?: any;
  updated_at?: any;
  response?: ResponseInterface[];
  slide?: SlideInterface;
  _count?: {
    response?: number;
  };
}

export interface PollGetQueryInterface extends GetQueryInterface {
  id?: string;
  question?: string;
  slide_id?: string;
}
