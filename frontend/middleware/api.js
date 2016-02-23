import { Schema, arrayOf, normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import 'isomorphic-fetch'

const API_ROOT = 'http://localhost:3000/';

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(endpoint, schema) {
    const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;

    const options = {
        credentials: 'same-origin'
    };

    return fetch(fullUrl, options)
        .then(
            response => {
                if (response.ok) {
                    return response.json(); //.then(json => ({json, response}))
                } else {
                    const errorObj = {
                        code: response.status,
                        message: response.statusText
                    };

                    return Promise.reject(errorObj);
                }
            },
            requestError => {
                const errorObj = {
                    code: 0,
                    message: requestError.message
                };

                return Promise.reject(errorObj);
            }
        )
        .then(
            jsonData => {
                const camelizedJson = camelizeKeys(jsonData);
                return Object.assign({},
                    normalize(camelizedJson, schema)
                )
            },
            error => {
                let errorObj = {
                    code: 0,
                    message: error.message
                };

                errorObj = Object.assign({}, errorObj, error);

                return Promise.reject(errorObj);
            }
        );
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/gaearon/normalizr

const userSchema = new Schema('users', {
    idAttribute: 'login'
});

const repoSchema = new Schema('repos', {
    idAttribute: 'fullName'
});

const merchantSchema = new Schema('merchants');

repoSchema.define({
    owner: userSchema
});

// Schemas for Github API responses.
export const Schemas = {
    USER: userSchema,
    USER_ARRAY: arrayOf(userSchema),
    REPO: repoSchema,
    REPO_ARRAY: arrayOf(repoSchema),
    MERCHANTS_LIST: {merchants: arrayOf(merchantSchema)}
};

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {

    const callAPI = action[CALL_API];
    if (typeof callAPI === 'undefined') {
        return next(action);
    }

    let { endpoint } = callAPI;
    const { schema, types, method="GET" } = callAPI;

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState());
    }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.');
    }
    if (!schema) {
        throw new Error('Specify one of the exported Schemas.');
    }
    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.');
    }
    if (!types.every(type => typeof type === 'string')) {
        throw new Error('Expected action types to be strings.');
    }

    function actionWith(data) {
        const finalAction = Object.assign({}, action, data);
        delete finalAction[CALL_API];
        return finalAction;
    }

    const [ requestType, successType, failureType ] = types;

    next(actionWith({type: requestType}));

    return callApi(endpoint, schema ).then(
        response => {
            next(actionWith({
                response,
                type: successType
            }))
        },
        error => {
            next(actionWith({
                type: failureType,
                error
            }))
        }
    )
}
