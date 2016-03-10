import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {RedirectActions, StoreActions, DictionaryActions} from '../../actions/index'
import StoreModel from '../../models/store'
import Field from '../../components/Field'
import Alert, {TYPE_ERROR} from '../../components/Alert'
import LoadingOverlay from '../../components/LoadingOverlay'
import {changeHandlerMixin} from '../../mixins/index'

@changeHandlerMixin
class StoreAddPage extends Component {
    constructor(props) {

        super(props);

        this._onCreate = this._onCreate.bind(this);

        this.onChange = this.changeHandler(this);
        this.changeStore = this.onChange("store");
        this.changeStoreSettings = this.changeStore("store_settings");

        this.state = {
            store: StoreModel.createStore()
        }
    }

    componentDidMount() {
        const {loadAlgorithms} = this.props;

        loadAlgorithms();
    }

    _onCreate(e) {
        e.preventDefault();
        const { create } = this.props;
        const { merchantId } = this.props.params;
        const { store } = this.state;
        create(merchantId, store);
    }

    render() {
        const { cancel, storeCreatePagination, createCE, redirect} = this.props;
        const {signAlgorithms} = this.props;
        const { store } = this.state;

        const onCreate = this._onCreate;
        const bindStore = this.changeStore;
        const bindStoreSettings = this.changeStoreSettings;


        let errors = StoreModel.createErrors();

        try {
            errors = Object.assign({}, errors, storeCreatePagination.error.serverError.errors);
        } catch (e) {
        }


        if (!!storeCreatePagination.result) {
            redirect(`/admin/administrator/stores/${storeCreatePagination.result}`);
        }

        return (
            <div>

                <LoadingOverlay loading={storeCreatePagination.isFetching}/>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        storeCreatePagination: state.pagination.storeCreate,
        signAlgorithms: state.dictionary.signAlgorithm
    }),
    {
        cancel: RedirectActions.back,
        create: StoreActions.create,
        redirect: RedirectActions.redirect,
        createCE: StoreActions.createCError,
        loadAlgorithms: DictionaryActions.loadSignAlgorithm
    }
)(StoreAddPage)
