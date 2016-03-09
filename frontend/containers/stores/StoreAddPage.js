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
                <form role="form" onSubmit={onCreate}>
                    <div className="box">
                        <div className="box-header with-border">
                            <h3 className="box-title">Adding store</h3>
                        </div>
                        <div className="box-body">
                            <div className="box-body">

                                {(!!storeCreatePagination.error) ?
                                    <Alert type={TYPE_ERROR}
                                           handleClose={createCE}>{storeCreatePagination.error.serverError.message}</Alert> : null}


                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="box box-primary">
                                            <div className="box-header with-border">
                                                <h3 className="box-title">Main information</h3>
                                            </div>
                                            <div className="box-body">
                                                <Field error={errors.store_name}>
                                                    <label htmlFor="storeName">Store name</label>
                                                    <input type="text" className="form-control " id="storeName"
                                                           onChange={bindStore("store_name")}
                                                           value={store.store_name}
                                                           placeholder="Example Shop"/>
                                                </Field>
                                                <Field error={errors.store_identifier}>
                                                    <label htmlFor="storeName">Store name</label>
                                                    <input type="text" className="form-control " id="storeName"
                                                           onChange={bindStore("store_identifier")}
                                                           value={store.store_identifier}
                                                           placeholder="as8d78ys87"/>
                                                </Field>
                                                <Field error={errors.store_url}>
                                                    <label htmlFor="storeUrl">Store URL</label>
                                                    <input type="text" className="form-control " id="storeUrl"
                                                           onChange={bindStore("store_url")}
                                                           value={store.store_url}
                                                           placeholder="www.example.com"/>
                                                </Field>

                                                <Field error={errors.description}>
                                                    <label htmlFor="storeDesc">Description</label>
                                                    <textarea className="form-control " id="storeDesc"
                                                              onChange={bindStore("description")}
                                                              placeholder="Example shop is a..."
                                                              value={store.description}/>
                                                </Field>

                                                <Field error={errors.logo}>
                                                    <div className="row">
                                                        <div className="col-sm-7">
                                                            <label htmlFor="logo">Logo URL</label>
                                                            <input type="text" className="form-control " id="logo"
                                                                   onChange={bindStore("logo")}
                                                                   value={store.logo}
                                                                   placeholder="www.example.com/logo.jpg"/>
                                                        </div>
                                                        <div className="col-sm-5">
                                                            <div >
                                                                <img className="img-responsive img-bordered"
                                                                     src={store.logo}/>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </Field>

                                                <Field error={errors.store_name}>
                                                    <div className="checkbox">
                                                        <label >
                                                            <input type="checkbox" id="showLogo"
                                                                   onChange={bindStore("show_logo")}
                                                                   checked={store.show_logo}/>
                                                            Show logo
                                                        </label>
                                                    </div>
                                                </Field>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="box box-primary">
                                            <div className="box-header with-border">
                                                <h3 className="box-title">Settings</h3>
                                            </div>
                                            <div className="box-body">
                                                <Field error={errors.store_settings.sign_algorithm}>
                                                    <label htmlFor="sign_algorithm">Sign algorithm</label>
                                                    <select className="form-control" id="sign_algorithm"
                                                            onChange={bindStoreSettings("sign_algorithm")}
                                                            value={store.store_settings.sign_algorithm}>
                                                        {
                                                            signAlgorithms.map((item, i) => {
                                                                return <option key={i} value={item}>{item}</option>
                                                            })
                                                        }
                                                    </select>
                                                </Field>

                                                <Field error={errors.store_settings.sign_key}>
                                                    <label htmlFor="signKey">Sign key</label>
                                                    <input type="text" className="form-control " id="signKey"
                                                           onChange={bindStoreSettings("sign_key")}
                                                           value={store.store_settings.sign_key}
                                                           placeholder="4kh3289y432h3io2489238h"/>
                                                </Field>

                                                <Field error={errors.store_settings.succeed_url}>
                                                    <label htmlFor="succeed_url">Success Url</label>
                                                    <input type="text" className="form-control " id="succeed_url"
                                                           onChange={bindStoreSettings("succeed_url")}
                                                           value={store.store_settings.succeed_url}
                                                           placeholder="www.example.com/success"/>
                                                </Field>

                                                <Field error={errors.store_settings.failure_url}>
                                                    <label htmlFor="failure_url">Failure Url</label>
                                                    <input type="text" className="form-control " id="failure_url"
                                                           onChange={bindStoreSettings("failure_url")}
                                                           value={store.store_settings.failure_url}
                                                           placeholder="www.example.com/fail"/>
                                                </Field>

                                                <Field error={errors.store_settings.commission_pct}>
                                                    <label htmlFor="commission_pct">Comission %</label>
                                                    <input type="text" className="form-control " id="commission_pct"
                                                           onChange={bindStoreSettings("commission_pct")}
                                                           value={store.store_settings.commission_pct}
                                                           placeholder="2.4"/>
                                                </Field>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box-footer">
                            <a className="btn btn-default" onClick={cancel}>Cancel</a>
                            <button className="btn btn-success pull-right" type="submit"><i className="fa fa-save"/>
                                &nbsp;Save
                            </button>
                        </div>
                        <LoadingOverlay loading={storeCreatePagination.isFetching}/>
                    </div>
                </form>
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
