/**
 * Shared context between promises.
 *
 * @class PromiseContext
 * @typedef {PromiseContext}
 * @template OkType
 * @template FailType
 */
declare class PromiseContext<OkType, FailType> {
    status: 'pending' | 'resolved' | 'rejected' | 'cancelled';
    thenValue: any;
    catchCallback: Function | null;
    thenError: any;
    okCallback: Function;
    value: OkType;
    failCallback: Function;
    error: FailType;
    finallyCallback: Function;
    cancelledCallback: Function | null;
    isAwaited: boolean;
    /**
     * Calls the function passed with all the parameters
     * expect to a `finally` call.
     *
     * @param {Function} func
     */
    callAsFinally: (func: Function) => void;
    /**
     * Call the catch callback, throws if not found, else returns the
     * value returned from the catch
     *
     * @param {*} error
     * @return {any}
     */
    callCatchCallbackOrPropagate: (error: any) => any;
}
declare class BaseTypedPromise<OkType, FailType> {
    protected context: PromiseContext<OkType, FailType>;
    constructor(context: PromiseContext<OkType, FailType>);
    /**
     * Function to call on resolved
     * @param callback callback on success
     * @param rejected callback on fail. Is preferred to use a following call to catch.
     * This argument is needed enable await support.
     */
    ok(callback: (val: OkType) => OkType | void): TypedPromise<OkType, FailType>;
    /**
     * Fail is called only when the promise is rejected.
     * This method isn't called if `ok` or `finally` throws.
     *
     * @public
     * @param {(v: FailType) => any} callback
     */
    fail(callback: (v: FailType) => any): TypedPromise<OkType, FailType>;
    /**
     * Catch will be called if `then` or `ok` throws.
     *
     * @public
     * @param {Function} callback
     */
    catch(callback: Function): TypedPromise<OkType, FailType>;
    /**
     * Sets a listener to cancelled
     *
     * @public
     * @param callback
     */
    cancelled(callback: () => any): TypedPromise<OkType, FailType>;
    /**
     * If succeed, finally is called after the last catch/then, ok if there are no then registered.
     * If failed it's called after fail.
     *
     * Callback it's expected to have 2 parameters.
     *
     * - The first is the same as `ok` if the promise was resolved, if there are `then` callbacks
     *   it would be the same as the last value returned from those calls. Else if the promise was
     *   rejected it's undefined.
     *
     * - The second parameter is the error returned by the last catch call to `catch` if the promise
     *   was resolved and a throw happened, else if the promise was rejected, is the same as the
     *   value passed to `fail`.
     *
     * @public
     * @param {(lastOkResult: any, lastError: any) => any} callback
     */
    finally(callback: (lastOkResult: any, lastError: any) => any): TypedPromise<OkType, FailType>;
    /**
     * Sets the promise as cancelled, when it resolves cancelled will be called
     */
    cancel(): void;
}
/**
 * This class represents a promise, used mainly to fullfil the need of a
 * typed reject from the current js Promise implementation.
 *
 * It defers in Promise in two thing:
 * - Ok function
 * - Fail function
 * - Doesn't allow chained then/catch, it breaks the types.
 *
 * Ok function is the equivalent to the first `then` in a normal Promise. The type
 * of the callback argument is `OkType`.
 *
 * Fail function is the equivalent to the first catch in a normal Promise. The callback
 * expects an argument of type `FailType`.
 *
 * An additional catch function is provided to catch exceptions thrown in the `ok` listener.
 *
 * If the promise is cancelled it doesn't care if it was resolved or rejected, it will call
 * to `cancelled` once it was resolved/rejected. But, if it's used with await it will throw
 * {cancelled: true} so you can catch it in a try{}catch{}, there is an example in the tests.
 *
 * @export
 * @class ServiceRequestPromise
 * @typedef {TypedPromise}
 * @template OkType
 * @template FailType
 */
export default class TypedPromise<OkType, FailType> extends BaseTypedPromise<OkType, FailType> {
    constructor(action: (okCallback: (val: OkType) => OkType | void, failCallback: (val: FailType) => any) => void);
    /**
     * Function added to support await
     * @param callback on success. Await registers its "success" callback here.
     * @param rejected on error. Await registers its "catch" callback here that
     * it converts into an error catchable by a try{}catch{}.
     * @returns
     */
    protected then(callback: (val: OkType) => OkType | void, rejected?: (error: FailType) => any): void;
    private resolve;
    private reject;
}
export {};
