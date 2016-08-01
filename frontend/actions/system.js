import {CALL_API} from '../middleware/api';
import {SERVER_VERSION_GET} from '../lib/api'
import {TOKEN_REFRESH} from '../lib/api'

export const SERVER_VERSION_REQUEST = 'SERVER_VERSION_REQUEST';
export const SERVER_VERSION_SUCCESS = 'SERVER_VERSION_SUCCESS';
export const SERVER_VERSION_FAILURE = 'SERVER_VERSION_FAILURE';
export const SERVER_VERSION_CERROR = 'SERVER_VERSION_CERROR';

export function serverRequestError() {
    return {
        type: SERVER_VERSION_CERROR
    }
}

export function getServerVersion() {
    return {
        [CALL_API]: {
            types: [SERVER_VERSION_REQUEST, SERVER_VERSION_SUCCESS, SERVER_VERSION_FAILURE],
            cError: SERVER_VERSION_CERROR,
            endpoint: SERVER_VERSION_GET,
        }
    }
}


export function tokenRefresh() {

    function refreshToken(url) {
        return new Promise(function (resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.setRequestHeader("Authorization", 'Bearer ' + window.localStorage.user_token);
            xhr.onload = function () {
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    var error = new Error(this.statusText);
                    error.code = this.status;
                    reject(error);
                }
            };

            xhr.onerror = function () {
                reject(new Error("Network Error"));
            };

            xhr.send();
        });
    }

    var API_VERSION = localStorage.version || "dev";
    if (window.localStorage.user_token) {
        refreshToken(`${location.origin}/api/admin/${API_VERSION}/authorization/token`)
            .then(
                response => localStorage.setItem("user_token", (`${JSON.parse(response).token}`)),
                error => console.log(`Rejected: ${error}`));
    }
}