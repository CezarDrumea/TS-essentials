import { HTTPStatuses } from './enums';
import { ReqType } from './types';

export interface Handlers {
  next: (request: ReqType) => { status: HTTPStatuses.HTTP_STATUS_OK };
  error: (error: Error) => {
    status: HTTPStatuses.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  };
  complete: () => void;
}
