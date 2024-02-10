import { HTTPMethods, HTTPStatuses } from './enums';

type ReqBodyType = {
  name?: string;
  age?: number;
  roles?: string[];
  createdAt?: Date;
  isDeleted?: boolean;
};

export type ReqType = {
  method: HTTPMethods.HTTP_GET_METHOD | HTTPMethods.HTTP_POST_METHOD;
  host: string;
  path: string;
  body?: ReqBodyType;
  params: {
    [param: string]: string;
  };
};
