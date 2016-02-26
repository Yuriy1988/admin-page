import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as MerchantActions from '../actions/merchants';
import * as StoresActions from '../actions/stores';
import Alert, {TYPE_ERROR} from '../components/Alert';
import LoadingOverlay from '../components/LoadingOverlay';

class MerchantPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {merchantId} = this.props.params;
        const {loadMerchant, loadStores} = this.props;

        loadMerchant(merchantId);
        loadStores(merchantId);
    }

    render() {

        const {merchants, merchantPagination, loadMerchantCE, loadStoresCE} = this.props;

        const merchantInfo = merchants[merchantPagination.result] || {};

        return (
            <div>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">{merchantInfo.merchantName}</h3>

                        <div className="box-tools pull-right">

                            <Link className="btn btn-xs btn-success"
                                  to={`/admin/administrator/merchants/${merchantInfo.id}/edit`}>
                                <i className="fa fa-plus"/> Add
                            </Link>
                        </div>

                    </div>
                    <div className="box-body">
                        {(!!merchantPagination.error) ?
                            <Alert type={TYPE_ERROR} handleClose={loadMerchantCE}>{merchantPagination.error.message}</Alert> : null}

                    </div>
                    <LoadingOverlay loading={merchantPagination.isFetching}/>
                </div>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title"><i className="fa fa-shopping-cart" /> Stores</h3>

                        <div className="box-tools pull-right btn-group">

                            <Link className="btn btn-xs btn-success" to={`/admin/administrator/merchants/${merchantInfo.id}/stores/add`}>
                                <i className="fa fa-plus"/> Add
                            </Link>

                        </div>

                    </div>
                    <div className="box-body">
                        {(!!merchantPagination.error) ?
                            <Alert type={TYPE_ERROR} handleClose={loadStoresCE}>{merchantPagination.error.message}</Alert> : null}

                    </div>
                    <LoadingOverlay loading={merchantPagination.isFetching}/>
                </div>
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
        loadMerchantCE: MerchantActions.getByIdCError,
        loadStores: StoresActions.getList,
        loadStoresCE: StoresActions.getListCError,
    }
)(MerchantPage)
