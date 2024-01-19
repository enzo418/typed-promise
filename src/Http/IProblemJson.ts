/* eslint-disable semi */
// ref: https://datatracker.ietf.org/doc/html/rfc7807#section-3

export default interface IProblemJson {
    // Type is a URI reference that identifies the problem type, if omitted
    // it's considered "about:blank" and indicates that the problem has no additional
    // semantics beyond that of the HTTP status code.
    type?: string;
    title?: string; // summary of the problem type
    detail?: string; // explanation specific to this occurrence
    status: number; // The HTTP status code. -1 if couldn't make the request
    invalidParams?: { [name: string]: { code: string; reason: string } };
}
