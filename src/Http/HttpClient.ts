import IHttpClient from './IHttpClient';

/**
 * Simple http client to make it easier to
 * make request to a single domain.
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
 * @class HttpClient
 * @typedef {HttpClient}
 */
export default class HttpClient implements IHttpClient {
    /**
     * The base site protocol + domain to which
     * the client will make the requests.
     * Set to empty string to use this client on
     * any site.
     * @type {string}
     */
    private baseUrl: string;

    constructor(pBaseSiteUrl: string = '') {
        this.baseUrl = pBaseSiteUrl;
    }

    /**
     * Makes a http post request
     *
     * @public
     * @param {string} path
     * @param {object} body
     * @param {RequestInit} [init={}] optional request parameters
     * @return {Promise<Response>}
     */
    public post(
        path: string,
        body: object,
        init: RequestInit = {},
    ): Promise<Response> {
        // merge body and args into a single object
        const reqParams = Object.assign(
            {
                body: JSON.stringify(body),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            init,
        );

        return fetch(this.baseUrl + path, reqParams);
    }

    /**
     * Makes a http get request
     *
     * @public
     * @param {string} path
     * @param {object} [parameters={}] query parameters
     * @param {RequestInit} [init={}] optional request parameters
     * @return {Promise<Response>}
     */
    public get(
        path: string,
        parameters: object = {},
        init: RequestInit = {},
    ): Promise<Response> {
        let url: string = this.baseUrl + path;
        url += '?' + this.encodeObjectToQueryParams(parameters);

        return fetch(url, init);
    }

    public put(
        path: string,
        body: object = {},
        query: object = {},
        init: RequestInit = {},
    ): Promise<Response> {
        let url: string = this.baseUrl + path;

        if (Object.keys(query).length > 0) {
            url += '?' + this.encodeObjectToQueryParams(query);
        }

        const reqParams = Object.assign(
            {
                body: JSON.stringify(body),
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            init,
        );

        return fetch(url, reqParams);
    }

    public delete(
        path: string,
        { query, init }: { query?: object; init?: RequestInit } = {},
    ): Promise<Response> {
        let url: string = this.baseUrl + path;

        if (query && Object.keys(query).length > 0) {
            url += '?' + this.encodeObjectToQueryParams(query);
        }

        const reqParams = Object.assign(
            {
                method: 'DELETE',
            },
            init,
        );

        return fetch(url, reqParams);
    }

    /**
     * Converts an object (key-value) to a string
     * in the format
     * "key_1=<value_1>&...&key_n=<value_n>"
     * where each value is encoded.
     *
     * @protected
     * @param {object} params
     * @return {string} encoded string
     */
    protected encodeObjectToQueryParams(params: object): string {
        return Object.entries(params)
            .map(kvp => [kvp[0], encodeURIComponent(kvp[1])].join('='))
            .join('&');
    }
}