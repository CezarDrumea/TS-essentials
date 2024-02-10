import { HTTPMethods, HTTPStatuses } from './enums';
import { Handlers } from './interfaces';
import { ReqType } from './types';

class Observer {
  _unsubscribe?: () => void;
  private isUnsubscribed: boolean = false;

  constructor(private handlers: Handlers) {}

  next(value: ReqType) {
    if (this.handlers.next && !this.isUnsubscribed) this.handlers.next(value);
  }

  error(error: Error) {
    if (!this.isUnsubscribed) {
      if (this.handlers.error) this.handlers.error(error);
      this.unsubscribe();
    }
  }

  complete() {
    if (!this.isUnsubscribed) {
      if (this.handlers.complete) {
        this.handlers.complete();
      }

      this.unsubscribe();
    }
  }

  unsubscribe() {
    this.isUnsubscribed = true;

    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}

class Observable {
  constructor(private _subscribe: (observer: Observer) => () => void) {}

  static from(values: ReqType[]) {
    return new Observable((observer: Observer) => {
      values.forEach((value) => observer.next(value));

      observer.complete();

      return () => {
        console.log('unsubscribed');
      };
    });
  }

  subscribe(obs: Handlers): { unsubscribe: () => void } {
    const observer = new Observer(obs);

    observer._unsubscribe = this._subscribe(observer);

    return {
      unsubscribe() {
        observer.unsubscribe();
      },
    };
  }
}

const userMock = {
  name: 'User Name',
  age: 26,
  roles: ['user', 'admin'],
  createdAt: new Date(),
  isDeleated: false,
};

const requestsMock: ReqType[] = [
  {
    method: HTTPMethods.HTTP_POST_METHOD,
    host: 'service.example',
    path: 'user',
    body: userMock,
    params: {},
  },
  {
    method: HTTPMethods.HTTP_GET_METHOD,
    host: 'service.example',
    path: 'user',
    params: {
      id: '3f5h67s4s',
    },
  },
];

const handleRequest = (
  request: ReqType
): { status: HTTPStatuses.HTTP_STATUS_OK } => {
  // handling of request
  console.log(request);
  return { status: HTTPStatuses.HTTP_STATUS_OK };
};
const handleError = (
  error: Error
): { status: HTTPStatuses.HTTP_STATUS_INTERNAL_SERVER_ERROR } => {
  // handling of error
  console.error(error);
  return { status: HTTPStatuses.HTTP_STATUS_INTERNAL_SERVER_ERROR };
};

const handleComplete = () => console.log('complete');

const requests$ = Observable.from(requestsMock);

const subscription = requests$.subscribe({
  next: handleRequest,
  error: handleError,
  complete: handleComplete,
});

subscription.unsubscribe();
