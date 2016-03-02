export default class StoreModel {
    constructor(store) {
        this._store = store || {};
    }

    static createStore() {
        return {
            "store_name": "",
            "store_identifier": "",
            "store_url": "",
            "description": "",
            "logo": "",
            "show_logo": true,
            "store_settings": {
                "sign_algorithm": "MD5",
                "sign_key": "",
                "succeed_url": "",
                "failure_url": "",
                "commission_pct": ""
            }
        };
    }

    get settings() {
        if (typeof this._store.storeSettings != 'undefined') {
            return this._store.storeSettings;
        }
        return {}
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
        return this._store.showLogo;
    }

    get storeIdentifier() {
        return this._store.storeIdentifier;
    }

    get storeName() {
        return this._store.storeName;
    }

    get storeUrl() {
        return this._store.storeUrl;
    }
}