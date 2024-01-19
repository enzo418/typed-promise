/**
 * Simple http client to make it easier to make request.
 *
 * It uses the Fetch API:
 * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 *
 * with its RequestInit parameters:
 * https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#syntax
 *
 * Each request returns a Promise that resolves to the Response
 * to that request.
 *
 * @export
 * @abstract
 * @class IHttpClient
 * @typedef {IHttpClient}
 */
export default abstract class IHttpClient {
    /**
     * Makes a http post request
     *
     * @abstract
     * @param {string} path
     * @param {object} body
     * @param {RequestInit} [init={}] optional request parameters
     * @returns {Promise<Response>}
     */
    abstract post(
        path: string,
        body: object,
        init: RequestInit,
    ): Promise<Response>;

    /**
     * Same function as above given for convenience
     *
     * @abstract
     * @param {string} path
     * @param {object} body
     * @returns {Promise<Response>}
     */
    abstract post(path: string, body: object): Promise<Response>;

    /**
     * Makes a http get request
     *
     * @abstract
     * @public
     * @param {string} path
     * @param {object} [parameters={}] query parameters
     * @param {RequestInit} [init={}] optinal request parameters
     * @return {Promise<Response>}
     */
    abstract get(
        path: string,
        parameters: object,
        init: RequestInit,
    ): Promise<Response>;

    /**
     * Same function as above given for convenience
     *
     * @abstract
     * @param {string} path
     * @param {object} parameters
     * @returns {Promise<Response>}
     */
    abstract get(path: string, parameters: object): Promise<Response>;

    /**
     * PUT verb
     *
     * @abstract
     * @param {string} path
     * @param {object} body request body
     * @param {object} query request parameters/query
     * @returns {Promise<Response>}
     */
    abstract put(path: string, body: object, query?: object): Promise<Response>;

    /**
     * DELETE verb
     *
     * @abstract
     * @param {string} path
     * @param {object} query request parameters/query
     * @returns {Promise<Response>}
     */
    abstract delete(
        path: string,
        extra: { query?: object; init?: RequestInit },
    ): Promise<Response>;

    abstract delete(
        path: string,
        extra?: { query?: object; init?: RequestInit },
    ): Promise<Response>;
}