import IProblemJson from './IProblemJson';
import TypedPromise from '../TypedPromise';

/**
 * Handles the first interaction with a promise from the backend response.
 *
 * It tries to be a failsafe middleware to get the status and body of the
 * response, in which if the status is not in the range of 200 - 299 it
 * returns a Promise.reject with the response body.
 *
 * As defined in the backend, this body might contain a title, status
 * and traceId.
 *
 * @protected
 * @template T
 * @param {Promise<Response>} promise
 * @return {Promise<T>}
 */
export default function processPromise<T, Problem extends IProblemJson>(
    promise: Promise<Response>,
): TypedPromise<T, Problem> {
    return new TypedPromise<T, Problem>((ok, fail) => {
        promise
            .then(async r => ({
                status: r.status,
                headers: r.headers,
                ok: r.ok, // r oks if status is in [200-299]
                body: await r.text(),
            }))
            .then(r => {
                if (!r.ok) {
                    let rejectedJSON: any = { status: r.status || -1 };

                    if (
                        r.headers.has('Content-Type') &&
                        r.headers.get('Content-Type') ==
                        'application/problem+json'
                    ) {
                        try {
                            rejectedJSON = JSON.parse(r.body);
                        } catch (e) {
                            console.warn(
                                'Error parsing json on failed response',
                                e,
                            );
                        }
                    } else {
                        console.warn(
                            'Api server is misbehaving!' +
                            "didn't respond with a problem+json",
                        );
                    }

                    if (!rejectedJSON.status) rejectedJSON.status = r.status;

                    fail(rejectedJSON);
                } else {
                    let json: any = {};

                    try {
                        json = JSON.parse(r.body);
                    } catch (e) {
                        console.warn(
                            'Error parsing json on successful response, returning raw data',
                            e,
                        );
                        return ok(r.body as T);
                    }

                    return ok(json);
                }
            })
            .catch(e => {
                fail({
                    title: 'Network error',
                    detail: e.message,
                    status: 0,
                } as Problem);
            });
    });
}

export function processPromiseAsArrayBuffer<Problem extends IProblemJson>(
    promise: Promise<Response>,
): TypedPromise<{ buffer: ArrayBuffer; contentType: string }, Problem> {
    return new TypedPromise<
        { buffer: ArrayBuffer; contentType: string },
        Problem
    >((ok, fail) => {
        promise
            .then(async r => ({
                status: r.status,
                headers: r.headers,
                ok: r.ok, // r oks if status is in [200-299]
                body: await r.arrayBuffer(),
            }))
            .then(r => {
                if (!r.ok) {
                    let rejectedJSON: any = { status: -1 };

                    if (
                        r.headers.has('Content-Type') &&
                        r.headers.get('Content-Type') ==
                        'application/problem+json'
                    ) {
                        try {
                            const decoder = new TextDecoder('utf-8');

                            const text = decoder.decode(r.body);

                            rejectedJSON = JSON.parse(text);
                        } catch (e) {
                            console.warn(
                                'Error parsing json on failed response',
                                e,
                            );
                        }
                    } else {
                        console.warn(
                            'Api server is misbehaving!' +
                            "didn't respond with a problem+json",
                        );
                    }

                    fail(rejectedJSON);
                } else {
                    return ok({
                        buffer: r.body,
                        contentType: r.headers.get('Content-Type') || '',
                    });
                }
            });
    });
}