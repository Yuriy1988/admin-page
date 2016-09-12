//TODO refactor
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { MerchantActions } from '../../actions/index';

import Transition from '../../containers/Transition';

import MerchantModel from '../../models/merchant'


class MerchantPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        MerchantPage.loadData(this.props);
    }

    componentWillReceiveProps(props) {
        const { merchantId } = this.props.params;
        MerchantPage.loadData(props, merchantId);
    }

    static loadData(props, prevMerchantId = -1) {
        const {merchantId} = props.params;

        if (merchantId !== prevMerchantId) {
            const { loadMerchant } = props;
            loadMerchant(merchantId);
        }
    }
    render() {
        const { merchantId } = this.props.params;
        const { merchants, children } = this.props;

        const merchantInfo = new MerchantModel(merchants[merchantId]);

        return (
            <div>
                <h1 className="page-header">
                    <i className="fa fa-briefcase"/> {merchantInfo.merchantName}
                    <div className="box-tools pull-right btn-toolbar">

                        <Link className="btn btn-sm pull-left btn-success"
                              to={`/admin/administrator/merchants/${merchantInfo.id}/managers`}>
                            <i className="fa fa-users"/>&nbsp;Managers
                        </Link>

                        <Link className="btn btn-sm pull-left btn-warning"
                               to={`/admin/administrator/merchants/${merchantInfo.id}/passEdit`}>
                            <i className="fa fa-edit"/>&nbsp;Change password
                        </Link>

                        <Link className="btn btn-sm btn-warning"
                              to={`/admin/administrator/merchants/${merchantInfo.id}/stores`}>
                            <i className="fa fa-shopping-cart"/>&nbsp;Stores
                        </Link>
                        <Link className="btn btn-sm btn-warning"
                              to={`/admin/administrator/merchants/${merchantInfo.id}/contracts`}>
                            <i className="fa fa-file-text-o"/>&nbsp;Contracts
                        </Link>
                        <Link className="btn btn-sm btn-primary"
                              to={`/admin/administrator/merchants/${merchantInfo.id}/edit`}>
                            <i className="fa fa-edit"/>&nbsp;Edit
                        </Link>
                    </div>
                </h1>
                <Transition>{children}</Transition>
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
