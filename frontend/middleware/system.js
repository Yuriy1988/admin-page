import * as UserActions from './../actions/user';
import {camelizeKeys} from 'humps';

export default function handleTokenTime (store) {
    if (localStorage.user) {
        if ((JSON.parse(localStorage.user).exp - Date.now() / 1000) / 60 < 0) {
            console.log('logout');
            store.dispatch({
                type: UserActions.USER_LOGOUT_SUCCESS,
            });
            location.pathname = 'admin/access_denied'
        }
        if ((JSON.parse(localStorage.user).exp - Date.now() / 1000) / 60 < 7) {
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

            var API_VERSION = localStorage.version || "dev"; // refactor
            if (window.localStorage.user_token) {
                refreshToken(`${location.origin}/api/admin/${API_VERSION}/authorization/token`)
                    .then(
                        function (response) {
                            store.dispatch({
                                type: 'TOKEN_REFRESH',
                                response: `${camelizeKeys(response)}`
                            });
                        },
                        error => console.log(`Rejected: ${error}`));
            }
        }
    }
}