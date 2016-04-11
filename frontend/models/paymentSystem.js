import {decamelizeKeys as decamelize} from 'humps'
import {merge} from 'lodash'

export default class PaySysModel {
    constructor(data) {
        this._data = decamelize(data) || {};
    }

    static create(dataProp = {}) {
        let data = decamelize(dataProp);
        const initData = {
            id: null,
            paysys_name: null,
            active: false,

            paysys_login: null, //hidden
            paysys_password: null //hidden
        };

        return merge(initData, data);
    }

    static createErrors() {
        return {
            id: null,
            paysys_name: null,
            active: null,
            paysys_login: null,
            paysys_password: null
        };
    }

    get name() {
        return this._data.paysys_name;
    }

    get id() {
        return this._data.id;
    }

    get login() {
        return this._data.paysys_login;
    }

    get password() {
        return this._data.paysys_password;
    }

    get active() {
        return this._data.active;
    }
}