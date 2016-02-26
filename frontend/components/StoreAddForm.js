/*import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {create, createCError} from '../actions/stores'
import LoadingOverlay from '../components/LoadingOverlay'
import Alert, {TYPE_ERROR} from '../components/Alert'
import {redirect} from '../actions/redirect'

class StoreAddForm extends Component {
    constructor(props) {
        super(props);
        this._onMerchantChange = this._onMerchantChange.bind(this);
        this._onMerchantCChange = this._onMerchantCChange.bind(this);
        this._onCreate = this._onCreate.bind(this);

        this.state = {
            store: {
                store_name: "",			// {required}
                store_url: "",		// {required}

                category: enum,
                description: "",
                logo: url,
                show_logo: boolean,

                settings: {
                    sign_algorithm: enum,	// {required}
                    succeed_url: url,		// {required}
                    failure_url: url,			// {required}
                    commission_pct: decimal,	// {required}
                },
            }
        }
    }

    _onCreate(e) {
        e.preventDefault();
        const { create } = this.props;
        create(this.state.merchant);
    }

    _onMerchantChange(field, name) {
        return ((e) => {
            const { value } = e.target;
            const { merchant } = this.state;
            let newMerchant = Object.assign({}, merchant);

            if (!!name) {
                newMerchant[field] = Object.assign({}, merchant[field], {[name]: value});
            } else {
                newMerchant[field] = value;
            }
            this.setState({merchant: newMerchant});
            console.log(newMerchant);
        }).bind(this);
    }

    _onMerchantCChange(field, name) {
        return ((e) => {
            const { checked } = e.target;
            const { merchant } = this.state;
            let newMerchant = Object.assign({}, merchant);

            if (!!name) {
                newMerchant[field] = Object.assign({}, merchant[field], {[name]: checked});
            } else {
                newMerchant[field] = value;
            }
            this.setState({merchant: newMerchant});
            console.log(newMerchant);
        }).bind(this);
    }

    render() {
        const onChange = this._onMerchantChange;
        const onCChange = this._onMerchantCChange;
        const onCreate = this._onCreate;

        const {merchant} = this.state;
        const {merchantCreate, redirect, createCError} = this.props;

        if (!!merchantCreate.result) {
            redirect(`/admin/administrator/merchants/${merchantCreate.result}`);
        }

        return (

            <div className="box">
                <form role="form" onSubmit={onCreate}>
                    <div className="box-header with-border">
                        <h3 className="box-title">Merchant registration</h3>
                    </div>
                    <div className="box-body">

                        {(!!merchantCreate.error) ?
                            <Alert type={TYPE_ERROR} handleClose={createCError}>{merchantCreate.error.message}</Alert> : null}


                        <div className="row">
                            <div className="col-xs-12">
                                <label htmlFor="name">Merchant name</label>
                                <div className="form-group">
                                    <input type="text" className="form-control" id="name"
                                           onChange={onChange("merchant_name")}
                                           value={merchant.merchant_name}
                                           placeholder="Please, insert merchant name"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Main information</h3>
                                    </div>
                                    <div className="box-body">
                                        <div className="form-group">
                                            <label htmlFor="directorName">Chairman</label>
                                            <input type="text" className="form-control " id="directorName"
                                                   name="director_name"
                                                   onChange={onChange("merchant_info","director_name")}
                                                   value={merchant.merchant_info.director_name}
                                                   placeholder="Director name"/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="address">Address</label>
                                            <input type="text" className="form-control" id="address"
                                                   onChange={onChange("merchant_info","address")}
                                                   value={merchant.merchant_info.address}
                                                   placeholder="Address"/>
                                        </div>
                                    </div>
                                </div>

                            </div>


                            <div className="col-md-4">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Merchant account</h3>
                                    </div>
                                    <div className="box-body">
                                        <div className="form-group">
                                            <label htmlFor="checkingAccount">Checking Account</label>
                                            <input type="text" className="form-control" id="checkingAccount"
                                                   onChange={onChange("merchant_account","checking_account")}
                                                   value={merchant.merchant_account.checking_account}
                                                   placeholder="Checking Account"/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="mfo">MFO</label>
                                            <input type="text" className="form-control" id="mfo"
                                                   onChange={onChange("merchant_account","mfo")}
                                                   value={merchant.merchant_account.mfo}
                                                   placeholder="MFO"/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="okpo">OKPO</label>
                                            <input type="text" className="form-control" id="okpo"
                                                   onChange={onChange("merchant_account","okpo")}
                                                   value={merchant.merchant_account.okpo}
                                                   placeholder="OKPO"/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="bankName">Bank Name</label>
                                            <input type="text" className="form-control" id="bankName"
                                                   placeholder="Bank Name"
                                                   onChange={onChange("merchant_account","bank_name")}
                                                   value={merchant.merchant_account.bank_name}/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="currency">Currency</label>
                                            <select className="form-control" id="currency"
                                                    onChange={onChange("merchant_account","currency")}
                                                    value={merchant.merchant_account.currency}>
                                                <option value="USD">USD</option>
                                                <option value="UAH">UAH</option>
                                                <option value="RUR">RUR</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">User info</h3>
                                    </div>
                                    <div className="box-body">

                                        <div className="form-group">
                                            <label htmlFor="userName">Username (login)</label>
                                            <input type="text" className="form-control" id="userName"
                                                   onChange={onChange("user","username")}
                                                   value={merchant.user.username}
                                                   placeholder="Username"/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="firstName">First name</label>
                                            <input type="text" className="form-control" id="firstName"
                                                   placeholder="First name"
                                                   onChange={onChange("user","first_name")}
                                                   value={merchant.user.first_name}/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="firstName">Last name</label>
                                            <input type="text" className="form-control" id="lastName"
                                                   placeholder="Last name"
                                                   onChange={onChange("user","last_name")}
                                                   value={merchant.user.last_name}/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input type="text" className="form-control" id="email" placeholder="Email"
                                                   onChange={onChange("user","email")}
                                                   value={merchant.user.email}/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="phone">Phone</label>
                                            <input type="text" className="form-control" id="phone" placeholder="Phone"
                                                   onChange={onChange("user","phone")}
                                                   value={merchant.user.phone}/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="notify">Notification</label>
                                            <select className="form-control" id="notify"
                                                    onChange={onChange("user","notify")}
                                                    value={merchant.user.notify}>
                                                <option value="null">Disabled</option>
                                                <option value="EMAIL">Email</option>
                                                <option value="PHONE">Phone</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <div className="checkbox">
                                                <label >
                                                    <input type="checkbox" id="enabled"
                                                           onChange={onCChange("user","enabled")}
                                                           checked={merchant.user.enabled}/>
                                                    Enabled
                                                </label>
                                            </div>

                                        </div>
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
        merchantCreate: store.pagination.merchantCreate
    })
    ,
    {
        create,
        createCError,
        redirect
    }
)(StoreAddForm);
*/