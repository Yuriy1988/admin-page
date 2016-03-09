export default class MerchantModel {
    constructor(merchant) {
        this._merchant = merchant || {};
    }

    static create() {
        return {
            merchant_name: null,		    // {required} Обозначение торговца в системе
            merchant_account: {
                bank_name: null,		    // {required}
                checking_account: null,	// {required}
                currency: "USD",		// {required}
                mfo: null,			    // {required}
                okpo: null			    // {required}
            },
            merchant_info: {
                address: null,
                director_name: null
            },
            user: {
                username: null,  	// {required, unique} username for login
                first_name: null, // имя
                last_name: null,	// фамилия
                email: null,		// user email (can be blank)
                phone: null,      // {digits only, len fixed} user phone - 12 numbers
                notify: "EMAIL",// [“EMAIL”, “PHONE”, null] - where to send notification (if null - do not send)
                enabled: false	// {required, default=False} is user enabled or not (admin always enabled!)
            }
        };
    }

    static createErrors() {
        return {
            merchant_name: null,		    // {required} Обозначение торговца в системе
            merchant_account: {
                bank_name: null,		    // {required}
                checking_account: null,	// {required}
                currency: null,		// {required}
                mfo: null,			    // {required}
                okpo: null			    // {required}
            },
            merchant_info: {
                address: null,
                director_name: null
            },
            user: {
                username: null,  	// {required, unique} username for login
                first_name: null, // имя
                last_name: null,	// фамилия
                email: null,		// user email (can be blank)
                phone: null,      // {digits only, len fixed} user phone - 12 numbers
                notify: null,// [“EMAIL”, “PHONE”, null] - where to send notification (if null - do not send)
                enabled: null	// {required, default=False} is user enabled or not (admin always enabled!)
            }
        };
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