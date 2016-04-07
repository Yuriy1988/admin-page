import {decamelizeKeys as decamelize} from 'humps'
import {merge} from 'lodash'

export default class MerchantContractModel {
    constructor(store) {
        this._store = decamelize(store) || {};
    }

    static create(dataProp = {}) {
        let data = decamelize(dataProp);
        const initData = {
            commission_fixed: null,	// {required}
            commission_pct: null,	// {required}
            contract_doc_url: null,		// {required}
            currency: "USD",		// {required} одна из Currency Enum
            active: true,		// {default=false}
            filter: ""
        };

        return merge(initData, data);
    }


    static createErrors() {
        return {
            commission_fixed: null,
            commission_pct: null,
            contract_doc_url: null,
            currency: null,
            active: null,
            filter: null
        };
    }

    get id() {
        return this._store.id;
    }

    get commissionFixed() {
        return this._store.commission_fixed;
    }

    get commissionPct() {
        return this._store.commission_pct;
    }

    get contractDocUrl() {
        return this._store.contract_doc_url;
    }

    get currency() {
        return this._store.currency;
    }

    get active() {
        return this._store.active;
    }

    get filter() {
        return this._store.filter;
    }
}
