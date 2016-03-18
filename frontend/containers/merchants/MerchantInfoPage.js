//TODO refactor
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { MerchantActions, StoresActions } from '../../actions/index';
import Alert, {TYPE_ERROR} from '../../components/Alert';
import LoadingOverlay from '../../components/LoadingOverlay';
import Boolean from '../../components/Boolean';

import MerchantModel from '../../models/merchant'


class MerchantInfoPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        MerchantInfoPage.loadData(this.props, -1);
    }

    componentWillReceiveProps(props) {
        const {merchantId} = this.props.params;

        MerchantInfoPage.loadData(props, merchantId);
    }

    static loadData(props, prevMerchantId) {
        const {merchantId} = props.params;

        if (merchantId !== prevMerchantId) {
            const { loadMerchant, loadStores } = props;
            loadMerchant(merchantId);
        }
    }


    render() {

        const {merchants, merchantPagination, loadMerchantCE} = this.props;
        const {children} = this.props;

        const merchantInfo = new MerchantModel(merchants[merchantPagination.result]);


        return (
            <div>
                <div className="row">
                    <div className="col-sm-4">
                        <div className="box with-border box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Main information</h3>
                            </div>
                            <div className="box-body">
                                <ul className="list-group list-group-unbordered">
                                    <li className="list-group-item">
                                        <b>Chairman</b> <span
                                        className="pull-right">{merchantInfo.merchantInfo.directorName}</span>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Address</b><span
                                        className="pull-right">{merchantInfo.merchantInfo.address}</span>
                                    </li>
                                </ul>
                            </div>
                            <LoadingOverlay loading={merchantPagination.isFetching}/>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Merchant account</h3>
                            </div>
                            <div className="box-body">
                                <ul className="list-group list-group-unbordered">
                                    <li className="list-group-item">
                                        <b>Bank name</b> <span
                                        className="pull-right">{merchantInfo.merchantAccount.bankName}</span>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Checking Account</b> <span
                                        className="pull-right">{merchantInfo.merchantAccount.checkingAccount}</span>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Currency</b> <span
                                        className="pull-right">{merchantInfo.merchantAccount.currency}</span>
                                    </li>
                                    <li className="list-group-item">
                                        <b>MFO</b> <span
                                        className="pull-right">{merchantInfo.merchantAccount.mfo}</span>
                                    </li>
                                    <li className="list-group-item">
                                        <b>OKPO</b> <span
                                        className="pull-right">{merchantInfo.merchantAccount.okpo}</span>
                                    </li>
                                </ul>
                            </div>
                            <LoadingOverlay loading={merchantPagination.isFetching}/>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="box with-border box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">User information</h3>
                            </div>
                            <div className="box-body">
                                <ul className="list-group list-group-unbordered">
                                    <li className="list-group-item">
                                        <b>First Name</b> <span
                                        className="pull-right">{merchantInfo.user.firstName}</span>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Last Name</b> <span
                                        className="pull-right">{merchantInfo.user.lastName}</span>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Username</b> <span
                                        className="pull-right">{merchantInfo.user.username}</span>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Email</b> <span
                                        className="pull-right">{merchantInfo.user.email}</span>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Phone</b> <span
                                        className="pull-right">{merchantInfo.user.phone}</span>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Enabled</b>
                                        <Boolean className="pull-right" value={merchantInfo.user.enabled}/>
                                    </li>
                                </ul>
                            </div>
                            <LoadingOverlay loading={merchantPagination.isFetching}/>
                        </div>
                    </div>
                </div>

                {children}
            </div>
        )
    }
}


export default connect(
    (state)=>({
        merchants: state.entities.merchants,
        merchantPagination: state.pagination.merchant
    }),
    {
        loadMerchant: MerchantActions.getById,
        loadMerchantCE: MerchantActions.getByIdCError
    }
)(MerchantInfoPage)
