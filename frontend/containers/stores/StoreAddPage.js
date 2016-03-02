import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {RedirectActions, StoreActions} from '../../actions/index'
import StoreModel from '../../models/store'

class StoreAddPage extends Component {
    constructor(props) {
        super(props);

        this._onStoreChange = this._onStoreChange.bind(this);
        this._onStoreCChange = this._onStoreCChange.bind(this);
        this._onCreate = this._onCreate.bind(this);


        this.state = {
            store: StoreModel.createStore()
        }
    }

    _onCreate(e) {
        e.preventDefault();
        const { create } = this.props;
        create(this.state.store);
    }

    _onStoreChange(field, name) {
        return ((e) => {
            const { value } = e.target;
            const { store } = this.state;
            let newStore = Object.assign({}, store);

            if (!!name) {
                newStore[field] = Object.assign({}, store[field], {[name]: value});
            } else {
                newStore[field] = value;
            }
            this.setState({store: newStore});

        }).bind(this);
    }

    _onStoreCChange(field, name) {
        return ((e) => {
            const { checked } = e.target;
            const { store } = this.state;
            let newStore = Object.assign({}, store);

            if (!!name) {
                newStore[field] = Object.assign({}, store[field], {[name]: checked});
            } else {
                newStore[field] = checked;
            }
            this.setState({store: newStore});

        }).bind(this);

    }

    render() {
        const { cancel, storeCreatePagination, createCE} = this.props;
        const { store } = this.state;
        const onChange = this._onStoreChange;
        const onCChange = this._onStoreCChange;
        const onCreate = this._onCreate;

        return (
            <div>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">Adding store</h3>
                    </div>
                    <div className="box-body">
                        <div className="box-body">

                            {(!!storeCreatePagination.error) ?
                                <Alert type={TYPE_ERROR}
                                       handleClose={createCE}>{storeCreatePagination.error.message}</Alert> : null}


                            <div className="row">
                                <div className="col-md-6">
                                    <div className="box box-primary">
                                        <div className="box-header with-border">
                                            <h3 className="box-title">Main information</h3>
                                        </div>
                                        <div className="box-body">
                                            <div className="form-group">
                                                <label htmlFor="storeName">Store name</label>
                                                <input type="text" className="form-control " id="storeName"
                                                       onChange={onChange("store_name")}
                                                       value={store.store_name}
                                                       placeholder="Rozetka UA"/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="storeName">Store name</label>
                                                <input type="text" className="form-control " id="storeName"
                                                       onChange={onChange("store_identifier")}
                                                       value={store.store_identifier}
                                                       placeholder="as8d78ys87"/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="storeUrl">Store URL</label>
                                                <input type="text" className="form-control " id="storeUrl"
                                                       onChange={onChange("store_url")}
                                                       value={store.store_url}
                                                       placeholder="www.rozetka.ua"/>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="storeDesc">Description</label>
                                                <textarea className="form-control " id="storeDesc"
                                                          onChange={onChange("description")}
                                                          value={store.description}
                                                          placeholder="Rozetka UA is a..."/>
                                            </div>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-7">
                                                        <label htmlFor="logo">Logo URL</label>
                                                        <input type="text" className="form-control " id="logo"
                                                               onChange={onChange("logo")}
                                                               value={store.logo}
                                                               placeholder="www.rozetka.ua/logo.jpg"/>
                                                    </div>
                                                    <div className="col-sm-5">
                                                        <div >
                                                            <img className="img-responsive img-bordered" src={store.logo} />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {/*  {
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
                                 };*/}
                                <div className="col-md-6">
                                    <div className="box box-primary">
                                        <div className="box-header with-border">
                                            <h3 className="box-title">Settings</h3>
                                        </div>
                                        <div className="box-body">
                                            <div className="form-group">
                                                <label htmlFor="storeName">Store name</label>
                                                <input type="text" className="form-control " id="storeName"
                                                       onChange={onChange("store_name")}
                                                       value={store.store_name}
                                                       placeholder="Store name"/>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-footer">
                        <a className="btn btn-default" onClick={cancel}>Cancel</a>
                        <a className="btn btn-success pull-right" onClick={cancel}><i className="fa fa-save"/> Save</a>
                    </div>
                </div>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        storeCreatePagination: state.pagination.storeCreate
    }),
    {
        cancel: RedirectActions.back,
        create: StoreActions.create,
        createCE: StoreActions.createCError,
    }
)(StoreAddPage)
