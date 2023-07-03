import { PollInterface } from 'interfaces/poll';
import { PresentationInterface } from 'interfaces/presentation';
import { GetQueryInterface } from 'interfaces';

export interface SlideInterface {
  id?: string;
  content: string;
  presentation_id?: string;
  created_at?: any;
  updated_at?: any;
  poll?: PollInterface[];
  presentation?: PresentationInterface;
  _count?: {
    poll?: number;
  };
}

export interface SlideGetQueryInterface extends GetQueryInterface {
  id?: string;
  content?: string;
  presentation_id?: string;
}
