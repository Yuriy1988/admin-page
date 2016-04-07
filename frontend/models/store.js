import {decamelizeKeys as decamelize} from 'humps'
import {merge} from 'lodash'

export default class StoreModel {
    constructor(store) {
        this._store = decamelize(store) || {};
    }

    static create(dataProp = {}) {
        let data = decamelize(dataProp);
        const initData = {
            "store_name": null,
            "store_identifier": null,
            "store_url": null,
            "description": null,
            "logo": null,
            "show_logo": false,
            "store_settings": StoreSettingsModel.create(data.store_settings)
        };

        return merge(initData, data);
    }

    static createStore(store) {
        console.log("DEPRECATED in store model createStore");
        return StoreModel.create(store);
    }


    static createErrors() {
        return {
            "store_name": null,
            "store_identifier": null,
            "store_url": null,
            "description": null,
            "logo": null,
            "show_logo": null,
            "store_settings": StoreSettingsModel.createErrors()
        };
    }

    get settings() {
        return new StoreSettingsModel(this._store.store_settings);
    }

    get id() {
        return this._store.id;
    }

    get category() {
        return this._store.category;
    }

    get description() {
        return this._store.description;
    }

    get logo() {
        return this._store.logo;
    }

    get showLogo() {
        return this._store.show_logo;
    }

    get storeIdentifier() {
        return this._store.store_identifier;
    }

    get storeName() {
        return this._store.store_name;
    }

    get storeUrl() {
        return this._store.store_url;
    }
}


export class StoreSettingsModel {
    constructor(settings) {
        this._settings = decamelize(settings) || {};

    }


    static create(dataProp = {}) {
        let data = decamelize(dataProp);
        const initData = {
            "sign_algorithm": "MD5",
            "sign_key": null,
            "succeed_url": null,
            "failure_url": null,
            "commission_pct": null
        };

        return merge(initData, data);
    }

    static createErrors() {
        return {
            "sign_algorithm": null,
            "sign_key": null,
            "succeed_url": null,
            "failure_url": null,
            "commission_pct": null
        };
    }

    get signAlgorithm() {
        return this._settings.sign_algorithm;
    }

    get signKey() {
        return this._settings.sign_key;
    }

    get succeedUrl() {
        return this._settings.succeed_url;
    }

    get failureUrl() {
        return this._settings.failure_url;
    }

    get commissionPct() {
        return this._settings.commission_pct;
    }
}
