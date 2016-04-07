import {decamelizeKeys as decamelize} from 'humps'
import {merge} from 'lodash'

export default class MerchantModel {
    constructor(data) {
        this._data = decamelize(data) || {};
    }

    static create(dataProp = {}) {
        let data = decamelize(dataProp);
        const initData = {
            id: null,
            merchant_name: null,
            merchant_account: MerchantAccountModel.create(data.merchant_account),
            merchant_info: MerchantInfoModel.create(data.merchant_info),
            user: UserModel.create(data.user)
        };

        return merge(initData, data);
    }

    static createErrors() {
        return {
            id: null,
            merchant_name: null,
            merchant_account: MerchantAccountModel.createErrors(),
            merchant_info: MerchantInfoModel.createErrors(),
            user: UserModel.createErrors()
        };
    }

    get merchantAccount() {
        return new MerchantAccountModel(this._data.merchant_account);
    }

    get user() {
        return new UserModel(this._data.user);
    }

    get merchantInfo() {
        return new MerchantInfoModel(this._data.merchant_info);
    }

    get id() {
        return this._data.id;
    }

    get merchantName() {
        return this._data.merchant_name;
    }
}

export class MerchantInfoModel {
    constructor(data) {
        this._data = decamelize(data) || {};
    }

    static create(dataProp = {}) {
        let data = decamelize(dataProp);
        const initData = {
            address: null,
            director_name: null
        };

        return merge(initData, data);
    }

    static createErrors() {
        return {
            address: null,
            director_name: null
        }
    }

    get address() {
        return this._data.address;
    }

    get directorName() {
        return this._data.director_name;
    }
}

export class UserModel {
    constructor(data) {
        this._data = decamelize(data) || {};
    }

    static create(dataProp = {}) {
        let data = decamelize(dataProp);
        const initData = {
            username: null,  	// {required, unique} username for login
            first_name: null, // имя
            last_name: null,	// фамилия
            email: null,		// user email (can be blank)
            phone: null,      // {digits only, len fixed} user phone - 12 numbers
            notify: "EMAIL",// [“EMAIL”, “PHONE”, null] - where to send notification (if null - do not send)
            enabled: false	// {required, default=False} is user enabled or not (admin always enabled!)
        };

        return merge(initData, data);
    }

    static createErrors() {
        return {
            username: null,  	// {required, unique} username for login
            first_name: null, // имя
            last_name: null,	// фамилия
            email: null,		// user email (can be blank)
            phone: null,      // {digits only, len fixed} user phone - 12 numbers
            notify: null,// [“EMAIL”, “PHONE”, null] - where to send notification (if null - do not send)
            enabled: null	// {required, default=False} is user enabled or not (admin always enabled!)
        }
    }

    get username() {
        return this._data.username;
    }

    get firstName() {
        return this._data.first_name;
    }

    get lastName() {
        return this._data.last_name;
    }

    get email() {
        return this._data.email;
    }

    get phone() {
        return this._data.phone;
    }

    get notify() {
        return this._data.notify;
    }

    get enabled() {
        return this._data.enabled;
    }
}

export class MerchantAccountModel {
    constructor(data) {
        this._data = decamelize(data) || {};
    }

    static create(dataProp = {}) {
        let data = decamelize(dataProp);
        const initData = {
            bank_name: null,		    // {required}
            checking_account: null,	// {required}
            currency: "USD",		// {required}
            mfo: null,			    // {required}
            okpo: null			    // {required}
        };

        return merge(initData, data);
    }

    static createErrors() {
        return {
            bank_name: null,		    // {required}
            checking_account: null,	// {required}
            currency: null,		// {required}
            mfo: null,			    // {required}
            okpo: null			    // {required}
        };
    }

    get bankName() {
        return this._data.bank_name;
    }

    get checkingAccount() {
        return this._data.checking_account;
    }

    get currency() {
        return this._data.currency;
    }

    get mfo() {
        return this._data.mfo;
    }

    get okpo() {
        return this._data.okpo;
    }
}