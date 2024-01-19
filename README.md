# @enzo418/typed-promise Library

This library provides a TypeScript implementation of Promises, with additional features such as cancellation and typed responses. It also includes an HTTP client that returns these typed promises.

## Installation

To install the library, use npm:

```sh
npm install @enzo418/typed-promise
```

## Usage
### TypedPromise
Import the TypedPromise class from the library:

```typescript
import { TypedPromise } from '@enzo418/typed-promise';
```

You can then create a new TypedPromise and use it like a standard Promise, with additional type safety:

```typescript
let promise = new TypedPromise<number, MyError>((resolve, reject) => {
    if (Math.random() > 0.5) {
        resolve(42);
    } else {
        reject(new MyError({ message: 'Something went wrong', code: 42 }));
    }
});
```

### HttpClient and ProcessPromise
The library also includes an HTTP client that returns Promises but, if you know the backend's error types, you can convert them to TypedPromises using the `process` method:

```typescript
interface ResponseDTO {
    name: string;
    age: number;
}

interface ResponseError extends IProblemJson {
    traceId: string;
}

const client = new HttpClient('myapiurl.com');

const parameters = {
    include: 'name,age',
};

const init: RequestInit = {
    headers: { // Example authorization header
        'Authorization': 'Bearer ' + 'mytoken',
    },
};

processPromise<ResponseDTO, ResponseError>(
    client.get('/users/1', parameters, init),
).ok((dto: ResponseDTO) => {
    // Success! status is in the range of 200 - 299.
    // handle success with dto
}).fail((error: ResponseError) => {
    // Error. status is not in the range of 200 - 299 or there was a network error.
    // handle error with error.traceId
});
```