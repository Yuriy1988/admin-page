//TODO refactor
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { MerchantActions } from '../../actions/index';
import Alert, {TYPE_ERROR} from '../../components/Alert';
import LoadingOverlay from '../../components/LoadingOverlay';

import MerchantModel from '../../models/merchant'


class MerchantPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        MerchantPage.loadData(this.props);
    }

    componentWillReceiveProps(props) {
        const {merchantId} = this.props.params;
        MerchantPage.loadData(props, merchantId);
    }

    static loadData(props, prevMerchantId = -1) {
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

                <h1 className="page-header">
                    <i className="fa fa-briefcase"/> {merchantInfo.merchantName}
                    <div className="box-tools pull-right btn-toolbar">

                        <Link className="btn btn-sm btn-primary"
                              to={`/admin/administrator/merchants/${merchantInfo.id}/stores`}>
                            <i className="fa fa-shopping-cart"/>&nbsp;Stores
                        </Link>
                        <Link className="btn btn-sm btn-primary"
                              to={`/admin/administrator/merchants/${merchantInfo.id}/edit`}>
                            <i className="fa fa-edit"/>&nbsp;Edit
                        </Link>
                    </div>
                </h1>

                {(!!merchantPagination.error) ?
                    <Alert type={TYPE_ERROR}
                           handleClose={loadMerchantCE}>{merchantPagination.error.message}</Alert> : null}


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
        loadMerchant: MerchantActions.getByIdLazy,
        loadMerchantCE: MerchantActions.getByIdCError
    }
)(MerchantPage)
