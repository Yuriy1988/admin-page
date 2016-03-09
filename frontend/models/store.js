export default class StoreModel {
    constructor(store) {
        this._store = store || {};
    }

    static createStore() {
        return {
            "store_name": null,
            "store_identifier": null,
            "store_url": null,
            "description": null,
            "logo": null,
            "show_logo": false,
            "store_settings": {
                "sign_algorithm": "MD5",
                "sign_key": null,
                "succeed_url": null,
                "failure_url": null,
                "commission_pct": null
            }
        };
    }


    static createErrors() {
        return {
            "store_name": null,
            "store_identifier": null,
            "store_url": null,
            "description": null,
            "logo": null,
            "show_logo": null,
            "store_settings": {
                "sign_algorithm": null,
                "sign_key": null,
                "succeed_url": null,
                "failure_url": null,
                "commission_pct": null
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