//TODO refactor
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {create, createCError} from '../actions/merchants'
import LoadingOverlay from '../components/LoadingOverlay'
import Alert, {TYPE_ERROR} from '../components/Alert'
import Field from '../components/Field'
import MerchantModel from '../models/merchant'
import CurrencySelect from '../components/CurrencySelect'
import {redirect} from '../actions/redirect'
import {DictionaryActions} from '../actions/index'
import {changeHandlerMixin} from '../mixins/index'

@changeHandlerMixin
class MerchantForm extends Component {
    constructor(props) {
        super(props);


        this.onChange = this.changeHandler(this);
        this.changeMerchant = this.onChange("merchant");
        this.changeMerchantInfo = this.changeMerchant("merchant_info");
        this.changeMerchantAccount = this.changeMerchant("merchant_account");
        this.changeMerchantUser = this.changeMerchant("user");

        this._onCreate = this._onCreate.bind(this);

        this.state = {
            merchant: MerchantModel.create()
        }
    }

    _onCreate(e) {
        e.preventDefault();
        const { create } = this.props;
        create(this.state.merchant);
    }


    componentDidMount() {
        const {loadNotifications, loadCurrencies} = this.props;
        loadCurrencies();
        loadNotifications();
    }

    render() {

        const onCreate = this._onCreate;

        const {changeMerchant,changeMerchantInfo,changeMerchantAccount,changeMerchantUser} = this;

        const {merchant} = this.state;
        const {merchantCreate, redirect, createCError} = this.props;

        let errors = MerchantModel.createErrors();

        try {
            errors = Object.assign({}, errors, merchantCreate.error.serverError.errors);
        } catch (e) {
        }


        if (!!merchantCreate.result) {
            redirect(`/admin/administrator/merchants/${merchantCreate.result}`); //TODO remove from render
        }

        return (

            <div className="box">
                <form role="form" onSubmit={onCreate}>
                    <div className="box-header with-border">
                        <h3 className="box-title">Merchant registration</h3>
                    </div>
                    <div className="box-body">

                        {(!!merchantCreate.error) ?
                            <Alert type={TYPE_ERROR}
                                   handleClose={createCError}>{merchantCreate.error.serverError.message}</Alert> : null}


                        <div className="row">
                            <div className="col-xs-12">
                                <label htmlFor="name">Merchant name</label>
                                <Field error={errors.merchant_name}>
                                    <input type="text" className="form-control" id="name"
                                           onChange={changeMerchant("merchant_name")}
                                           value={merchant.merchant_name}
                                           placeholder="Please, insert merchant name"/>
                                </Field>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Main information</h3>
                                    </div>
                                    <div className="box-body">
                                        <Field error={errors.merchant_info.director_name}>
                                            <label htmlFor="directorName">Chairman</label>
                                            <input type="text" className="form-control " id="directorName"
                                                   name="director_name"
                                                   onChange={changeMerchantInfo("director_name")}
                                                   value={merchant.merchant_info.director_name}
                                                   placeholder="Director name"/>
                                        </Field>

                                        <Field error={errors.merchant_info.address}>
                                            <label htmlFor="address">Address</label>
                                            <input type="text" className="form-control" id="address"
                                                   onChange={changeMerchantInfo("address")}
                                                   value={merchant.merchant_info.address}
                                                   placeholder="Address"/>
                                        </Field>
                                    </div>
                                </div>

                            </div>


                            <div className="col-md-4">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Merchant account</h3>
                                    </div>
                                    <div className="box-body">
                                        <Field error={errors.merchant_account.checking_account}>
                                            <label htmlFor="checkingAccount">Checking Account</label>
                                            <input type="text" className="form-control" id="checkingAccount"
                                                   onChange={changeMerchantAccount("checking_account")}
                                                   value={merchant.merchant_account.checking_account}
                                                   placeholder="Checking Account"/>
                                        </Field>

                                        <Field error={errors.merchant_account.mfo}>
                                            <label htmlFor="mfo">MFO</label>
                                            <input type="text" className="form-control" id="mfo"
                                                   onChange={changeMerchantAccount("mfo")}
                                                   value={merchant.merchant_account.mfo}
                                                   placeholder="MFO"/>
                                        </Field>

                                        <Field error={errors.merchant_account.okpo}>
                                            <label htmlFor="okpo">OKPO</label>
                                            <input type="text" className="form-control" id="okpo"
                                                   onChange={changeMerchantAccount("okpo")}
                                                   value={merchant.merchant_account.okpo}
                                                   placeholder="OKPO"/>
                                        </Field>


                                        <Field error={errors.merchant_account.bank_name}>
                                            <label htmlFor="bankName">Bank Name</label>
                                            <input type="text" className="form-control" id="bankName"
                                                   placeholder="Bank Name"
                                                   onChange={changeMerchantAccount("bank_name")}
                                                   value={merchant.merchant_account.bank_name}/>
                                        </Field>

                                        <Field error={errors.merchant_account.currency}>
                                            <label htmlFor="currency">Currency</label>
                                            <CurrencySelect id="currency"
                                                            onChange={changeMerchantAccount("currency")}
                                                            value={merchant.merchant_account.currency}/>
                                        </Field>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">User info</h3>
                                    </div>
                                    <div className="box-body">

                                        <Field error={errors.user.username}>
                                            <label htmlFor="userName">Username (login)</label>
                                            <input type="text" className="form-control" id="userName"
                                                   onChange={changeMerchantUser("username")}
                                                   value={merchant.user.username}
                                                   placeholder="Username"/>
                                        </Field>

                                        <Field error={errors.user.first_name}>
                                            <label htmlFor="firstName">First name</label>
                                            <input type="text" className="form-control" id="firstName"
                                                   placeholder="First name"
                                                   onChange={changeMerchantUser("first_name")}
                                                   value={merchant.user.first_name}/>
                                        </Field>

                                        <Field error={errors.user.last_name}>
                                            <label htmlFor="firstName">Last name</label>
                                            <input type="text" className="form-control" id="lastName"
                                                   placeholder="Last name"
                                                   onChange={changeMerchantUser("last_name")}
                                                   value={merchant.user.last_name}/>
                                        </Field>

                                        <Field error={errors.user.email}>
                                            <label htmlFor="email">Email</label>
                                            <input type="text" className="form-control" id="email" placeholder="Email"
                                                   onChange={changeMerchantUser("email")}
                                                   value={merchant.user.email}/>
                                        </Field>

                                        <Field error={errors.user.phone}>
                                            <label htmlFor="phone">Phone</label>
                                            <input type="text" className="form-control" id="phone" placeholder="Phone"
                                                   onChange={changeMerchantUser("phone")}
                                                   value={merchant.user.phone}/>
                                        </Field>

                                        <Field error={errors.user.notify}>
                                            <label htmlFor="notify">Notification</label>
                                            <select className="form-control" id="notify"
                                                    onChange={changeMerchantUser("notify")}
                                                    value={merchant.user.notify}>
                                                <option value="null">Disabled</option>
                                                <option value="EMAIL">Email</option>
                                                <option value="PHONE">Phone</option>
                                            </select>
                                        </Field>

                                        <Field error={errors.user.enabled}>
                                            <div className="checkbox">
                                                <label >
                                                    <input type="checkbox" id="enabled"
                                                           onChange={changeMerchantUser("enabled")}
                                                           checked={merchant.user.enabled}/>
                                                    Enabled
                                                </label>
                                            </div>
                                        </Field>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-footer clearfix">
                        <div className="pull-right">
                            <button className="btn btn-success ">Save</button>
                        </div>
                    </div>
                </form>


                <LoadingOverlay loading={merchantCreate.isFetching}/>
            </div>

        )
    }
}


export default connect(
    (store) => ({
        merchantCreate: store.pagination.merchantCreate,
        currencies: store.dictionary.currency,
        notifies: store.dictionary.notify
    })
    ,
    {
        create,
        createCError,
        redirect,

        loadNotifications: DictionaryActions.loadNotifications,
        loadCurrencies: DictionaryActions.loadCurrencies
    }
)(MerchantForm);
