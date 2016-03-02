export default class MerchantModel {
    constructor(merchant) {
        this._merchant = merchant || {};
    }

    get merchantInfo() {
        if (typeof this._merchant.merchantInfo != 'undefined') {
            return this._merchant.merchantInfo;
        }
        return {}
    }

    get user() {
        if (typeof this._merchant.user != 'undefined') {
            return this._merchant.user;
        }
        return {}
    }

    get merchantAccount() {
        if (typeof this._merchant.merchantAccount != 'undefined') {
            return this._merchant.merchantAccount;
        }
        return {}
    }


    get id() {
        return this._merchant.id;
    }

    get merchantName() {
        return this._merchant.merchantName;
    }
}