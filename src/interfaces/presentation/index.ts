import { SlideInterface } from 'interfaces/slide';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface PresentationInterface {
  id?: string;
  title: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  slide?: SlideInterface[];
  organization?: OrganizationInterface;
  _count?: {
    slide?: number;
  };
}

export interface PresentationGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  organization_id?: string;
}
