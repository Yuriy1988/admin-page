//TODO refactor
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as MerchantActions from '../actions/merchants';
import Alert, {TYPE_ERROR} from '../components/Alert';
import LoadingOverlay from '../components/LoadingOverlay';


class MerchantList extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadMerchants();
    }

    static renderList(items) {
        // const preRender = items.map((value, i) => (value));
        return (items.length > 0) ? (
            <div className="table-responsive">
                <table className="table table-hover table-striped">
                    <tbody>
                    <tr key="header">
                        <th width="5%">#</th>
                        <th>Name</th>
                        <th width="145px">Actions</th>
                    </tr>
                    {items}
                    </tbody>
                </table>
            </div>
        ) : <p>No items</p>;
    }

    handleDeleteButton(mid) {
        const {deleteMerchant} = this.props;
        if (confirm("Are you sure you want to delete merchant?")) {
            deleteMerchant(mid);
        }
    }

    render() {

        let {merchants, merchantPagination, loadMerchantsCE,  deleteMerchantCE} = this.props;

        const merchantList = MerchantList.renderList(merchantPagination.ids.map((merchantId, i) => {
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                        <Link to={`/admin/administrator/merchants/${merchants[merchantId].id}`}>
                            {merchants[merchantId].merchantName}
                        </Link>
                    </td>
                    <td >
                        <div className="btn-toolbar">
                            <Link className="btn btn-sm btn-primary"
                                  to={`/admin/administrator/merchants/${merchants[merchantId].id}/edit`}>
                                <i className="fa fa-edit"/> Edit
                            </Link>
                            <button className="btn btn-sm btn-danger"
                                    onClick={this.handleDeleteButton.bind(this, merchants[merchantId].id)}>
                                <i className="fa fa-trash"/> Delete
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }));

        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title"><i className="fa fa-briefcase"/> Merchants</h3>

                    <div className="box-tools pull-right">
                        <Link className="btn btn-sm btn-success" to="/admin/administrator/merchants/add"><i
                            className="fa fa-plus"/> Add</Link>
                    </div>

                </div>
                <div className="box-body no-padding">

                    {
                        (!!merchantPagination.error) ?
                            <Alert type={TYPE_ERROR}
                                   handleClose={loadMerchantsCE}>{merchantPagination.error.message}</Alert> : null
                    }
                    { merchantList }
                </div>
                <LoadingOverlay loading={merchantPagination.isFetching }/>
            </div>
        )
    }
}

export default connect(
    (state)=>({
        merchants: state.entities.merchants,
        merchantPagination: state.pagination.merchants
    }),
    {
        loadMerchants: MerchantActions.getList,
        loadMerchantsCE: MerchantActions.getListCError,
        deleteMerchant: MerchantActions.deleteById,
        deleteMerchantCE: MerchantActions.deleteByIdCError
    }
)(MerchantList)

