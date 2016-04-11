import {decamelizeKeys as decamelize} from 'humps'
import {merge} from 'lodash'

export default class PaySystemContractModel {
    constructor(data) {
        this._data = decamelize(data) || {};
    }

    static create(dataProp = {}) {
        let data = decamelize(dataProp);
        const initData = {
            id: null,			// {readonly, unique} paysys_contract_id
            paysys_id: null,		// {readonly, unique} id плат. сист. (Allowed paysys_id)
            contractor_name: null,	// {required} название банка/агрегатора
            commission_fixed: null,	// {required} фиксированная часть комиссии (значение в валюте currency)
            commission_pct: null,	// {required} комиссия в процентах, которую xopay взымает с торговца
            contract_doc_url: null,		// {required} ссылка на документ (pdf) контракта
            currency: "USD",		// {required} валюта контракта (Currency Enum)
            active: false,		// {default=false} контракт активен или нет
            filter: null			// {default="*"} фильтр для платежных реквизитов в формате Contract Filters
        };

        return merge(initData, data);
    }


    static createErrors() {
        return {
            id: null,			// {readonly, unique} paysys_contract_id
            paysys_id: null,		// {readonly, unique} id плат. сист. (Allowed paysys_id)
            contractor_name: null,	// {required} название банка/агрегатора
            commission_fixed: null,	// {required} фиксированная часть комиссии (значение в валюте currency)
            commission_pct: null,	// {required} комиссия в процентах, которую xopay взымает с торговца
            contract_doc_url: null,		// {required} ссылка на документ (pdf) контракта
            currency: null,		// {required} валюта контракта (Currency Enum)
            active: null,		// {default=false} контракт активен или нет
            filter: null			// {default="*"} фильтр для платежных реквизитов в формате Contract Filters
        };
    }

    get id() {
        return this._data.id;
    }

    get paysysId() {
        return this._data.paysys_id;
    }

    get contractorName() {
        return this._data.contractor_name;
    }

    get commissionFixed() {
        return this._data.commission_fixed;
    }

    get commissionPct() {
        return this._data.commission_pct;
    }

    get contractDocUrl() {
        return this._data.contract_doc_url;
    }

    get currency() {
        return this._data.currency;
    }

    get active() {
        return this._data.active;
    }

    get filter() {
        return this._data.filter;
    }
}
