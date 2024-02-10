"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
class Observer {
    constructor(handlers) {
        this.handlers = handlers;
        this.isUnsubscribed = false;
    }
    next(value) {
        if (this.handlers.next && !this.isUnsubscribed)
            this.handlers.next(value);
    }
    error(error) {
        if (!this.isUnsubscribed) {
            if (this.handlers.error)
                this.handlers.error(error);
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
    constructor(_subscribe) {
        this._subscribe = _subscribe;
    }
    static from(values) {
        return new Observable((observer) => {
            values.forEach((value) => observer.next(value));
            observer.complete();
            return () => {
                console.log('unsubscribed');
            };
        });
    }
    subscribe(obs) {
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
const requestsMock = [
    {
        method: enums_1.HTTPMethods.HTTP_POST_METHOD,
        host: 'service.example',
        path: 'user',
        body: userMock,
        params: {},
    },
    {
        method: enums_1.HTTPMethods.HTTP_GET_METHOD,
        host: 'service.example',
        path: 'user',
        params: {
            id: '3f5h67s4s',
        },
    },
];
const handleRequest = (request) => {
    // handling of request
    console.log(request);
    return { status: enums_1.HTTPStatuses.HTTP_STATUS_OK };
};
const handleError = (error) => {
    // handling of error
    console.error(error);
    return { status: enums_1.HTTPStatuses.HTTP_STATUS_INTERNAL_SERVER_ERROR };
};
const handleComplete = () => console.log('complete');
const requests$ = Observable.from(requestsMock);
const subscription = requests$.subscribe({
    next: handleRequest,
    error: handleError,
    complete: handleComplete,
});
subscription.unsubscribe();
