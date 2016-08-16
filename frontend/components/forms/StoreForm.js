import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { merge } from 'lodash'
import {RedirectActions, StoreActions, DictionaryActions} from '../../actions/index'
import StoreModel from '../../models/store'
import Field from '../../components/Field'
import {changeHandlerMixin} from '../../mixins/index'

@changeHandlerMixin
class StoreForm extends Component {
    constructor(props) {

        super(props);

        this._onCreate = this._onCreate.bind(this);

        this.onChange = this.changeHandler(this);
        this.changeStore = this.onChange("store");
        this.changeStoreSettings = this.changeStore("store_settings");

        this.state = {
            store: StoreModel.create(props.initStore)
        };

    }

    componentDidMount() {
        const {loadAlgorithms} = this.props;

        loadAlgorithms();
    }

    _onCreate(e) {
        e.preventDefault();
        const { onSubmit } = this.props;
        const { store } = this.state;
        onSubmit(store);
    }

    render() {
        const { cancel } = this.props;
        const { signAlgorithms } = this.props;

        let { store } = this.state;
        store = new StoreModel(store);

        const onCreate = this._onCreate;
        const bindStore = this.changeStore;
        const bindStoreSettings = this.changeStoreSettings;


        let errors = StoreModel.createErrors();

        try {
            errors = Object.assign({}, errors, this.props.errors);
        } catch (e) {
        }


        return (
            <form role="form" onSubmit={onCreate}>
                <div className="row">
                    <div className="col-md-6">
                        <h4 >Main information</h4>
                        <Field error={errors.store_name}>
                            <label htmlFor="storeName">Store name</label>
                            <input type="text" className="form-control " id="storeName"
                                   onChange={bindStore("store_name")}
                                   value={store.storeName}
                                   placeholder="Example Shop"/>
                        </Field>
                        {/*<Field error={errors.store_identifier}>
                            <label htmlFor="storeIdentifier">Store identifier</label>
                            <input type="text" className="form-control " id="storeIdentifier"
                                   onChange={bindStore("store_identifier")}
                                   value={store.storeIdentifier}
                                   placeholder="as8d78ys87"/>
                        </Field>*/}
                        <Field error={errors.store_url}>
                            <label htmlFor="storeUrl">Store home page URL</label>
                            <input type="text" className="form-control " id="storeUrl"
                                   onChange={bindStore("store_url")}
                                   value={store.storeUrl}
                                   placeholder="http://www.example.com"/>
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
                                           placeholder="http://www.example.com/logo.jpg"/>
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
                                           checked={store.showLogo}/>
                                    Show logo
                                </label>
                            </div>
                        </Field>

                    </div>

                    <div className="col-md-6">

                        <h4 >Settings</h4>

                        <Field error={errors.store_settings.sign_algorithm}>
                            <label htmlFor="sign_algorithm">Sign algorithm</label>
                            <select className="form-control" id="sign_algorithm"
                                    onChange={bindStoreSettings("sign_algorithm")}
                                    value={store.settings.signAlgorithm}>
                                {
                                    signAlgorithms.map((item, i) => {
                                        return <option key={i} value={item}>{item}</option>
                                    })
                                }
                            </select>
                        </Field>

                        {/*<Field error={errors.store_settings.sign_key}>
                            <label htmlFor="signKey">Sign key</label>
                            <input type="text" className="form-control " id="signKey"
                                   onChange={bindStoreSettings("sign_key")}
                                   value={store.settings.signKey}
                                   placeholder="4kh3289y432h3io2489238h"/>
                        </Field>*/}

                        <Field error={errors.store_settings.succeed_url}>
                            <label htmlFor="succeed_url">Success Url</label>
                            <input type="text" className="form-control " id="succeed_url"
                                   onChange={bindStoreSettings("succeed_url")}
                                   value={store.settings.succeedUrl}
                                   placeholder="http://www.example.com/success"/>
                        </Field>

                        <Field error={errors.store_settings.failure_url}>
                            <label htmlFor="failure_url">Failure Url</label>
                            <input type="text" className="form-control " id="failure_url"
                                   onChange={bindStoreSettings("failure_url")}
                                   value={store.settings.failureUrl}
                                   placeholder="http://www.example.com/fail"/>
                        </Field>

                        {/*<Field error={errors.store_settings.commission_pct}>*/}
                            {/*<label htmlFor="commission_pct">Comission %</label>*/}
                            {/*<input type="text" className="form-control " id="commission_pct"*/}
                                   {/*onChange={bindStoreSettings("commission_pct")}*/}
                                   {/*value={store.settings.commissionPct}*/}
                                   {/*placeholder="2.4"/>*/}
                        {/*</Field>*/}
                    </div>
                </div>

                <div className="row">
                    <hr/>
                    <div className="col-sm-12">
                        <button className="btn pull-right btn-success"
                                type="submit">
                            <i className="fa fa-save"/>&nbsp;Save
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

StoreForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default connect(
    (state)=>({
        signAlgorithms: state.dictionary.signAlgorithm
    }),
    {
        cancel: RedirectActions.back,
        create: StoreActions.create,
        redirect: RedirectActions.redirect,
        createCE: StoreActions.createCError,
        loadAlgorithms: DictionaryActions.loadSignAlgorithm
    }
)(StoreForm)
