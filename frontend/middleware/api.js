import { normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import 'isomorphic-fetch'

const API_VERSION = "dev";
const API_ROOT = `${location.origin}/api/admin/${API_VERSION}/`;


// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(endpoint, body) {
    const { schema, path, method, isAuth = false} = endpoint;

    let fullUrl = API_ROOT + path;

    const headers = new Headers();

    headers.append("Content-type", "application/json");

    if (isAuth === true) {
        headers.append("AuthToken", 123);
    }

    let options = {
        credentials: 'same-origin',
        method,
        headers
    };


    if (!!body) {

        if (method == "GET") {
            if (typeof body == 'string') {
                body = JSON.parse(body);
            }

            let params = [];
            for (let key in body) {
                params.push(`${key}=${body[key]}`);

            }

            if (fullUrl.indexOf("?") == -1) {
                fullUrl += "?"
            }

            fullUrl += params.join("&");

        } else {
            if (typeof body !== 'string') {
                body = JSON.stringify(body);
            }
            options.body = body;
        }

    }

    return fetch(fullUrl, options)
        .then(
            response => {
                console.log("try parse");
                return response.json().then(
                    json => ({json, response}),
                    errorParse => {
                        console.log("err parse");

                        const errorObj = {
                            code: 1,
                            message: errorParse.message,
                            serverError: {
                                errors: {},
                                message: "",
                                status_code: 0
                            }
                        };
                        return {json: {}, response};
                    }
                )
            },
            requestError => {
                console.log("req err");
                const errorObj = {
                    code: 2,
                    message: requestError.message,
                    serverError: {
                        errors: {},
                        message: "",
                        status_code: 0
                    }
                };
                return Promise.reject(errorObj);
            }
        ).then(
            ({json, response}) => {
                if (response.ok) {
                    let camelizedJson = camelizeKeys(json);

                    if (!!schema) {
                        camelizedJson = normalize(camelizedJson, schema);
                    }

                    return Object.assign({}, camelizedJson)
                } else {
                    const errorObj = {
                        code: response.status,
                        message: response.statusText,
                        serverError: json.error
                    };

                    return Promise.reject(errorObj);
                }
            },
            error => {
                let errorObj = {
                    code: 2,
                    message: error.message,
                    serverError: {
                        errors: {},
                        message: "",
                        status_code: 0
                    }
                };

                errorObj = Object.assign({}, errorObj, error);

                return Promise.reject(errorObj);
            }
        )
}


// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');
const ALLOWED_METHODS = ["GET", "PUT", "POST", "DELETE"];

function actionWith(action, data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
}

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
    const callAPI = action[CALL_API];
    if (typeof callAPI === 'undefined') {
        return next(action);
    }

    const { endpoint, types, body, cError } = callAPI;


    if (typeof endpoint !== 'object') {
        throw new Error('Specify an endpoint { method: [GET|POST|PUT|DELETE], path: string, schema:normalizrSchema }');
    }

    const { schema, path, method } = endpoint;

    if (typeof path !== 'string') {
        throw new Error('Endpoint.path should be a string');
    }

    if (ALLOWED_METHODS.indexOf(method) === -1) {
        throw new Error('Endpoint.method should be one of [GET|POST|PUT|DELETE]');
    }

    /*if (!schema) {
     throw new Error('Specify one of the exported Schemas.');
     }*/

    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.');
    }
    if (!types.every(type => typeof type === 'string' || typeof type === 'object')) {
        throw new Error('Expected action types to be strings or action object.');
    }


    let [ requestType, successType, failureType ] = types;
    let [rParams, sParams, fParams] = [{}, {}, {}];
    if (typeof requestType == 'object') {
        rParams = requestType;
    }
    if (typeof successType == 'object') {
        sParams = successType;
    }
    if (typeof failureType == 'object') {
        fParams = failureType;
    }

    const newAction = actionWith(action, Object.assign({type: requestType}, rParams));
    next(newAction);

    return callApi(endpoint, body).then(
        response => {
            next(actionWith(action, Object.assign({
                response,
                type: successType
            }, sParams)))
        },
        error => {
            next(actionWith(action, Object.assign({
                error,
                type: failureType
            }, fParams)))
        }
    )
}
