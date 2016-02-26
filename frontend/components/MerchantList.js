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
        const preRender = items.map((value, i) => {
            return (<li key={i}>{value}</li>);
        });
        return (items.length > 0) ? (
            <ul>
                {preRender}
            </ul>
        ) : <p>No items</p>;
    }

    render() {

        let {merchants, merchantPagination, loadMerchantsCE} = this.props;

        const merchantList = MerchantList.renderList(merchantPagination.ids.map((merchantId) => {
            return <Link to={`/admin/administrator/merchants/${merchants[merchantId].id}`}>{`${merchants[merchantId].id} - ${merchants[merchantId].merchantName}`}</Link>;
        }));

        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title"><i className="fa fa-briefcase"/> List of merchants</h3>

                    <div className="box-tools pull-right">

                        <Link className="btn btn-xs btn-success" to="/admin/administrator/merchants/add"><i className="fa fa-plus" /> Add</Link>
                    </div>

                </div>
                <div className="box-body">

                    {
                        (!!merchantPagination.error) ?
                            <Alert type={TYPE_ERROR} handleClose={loadMerchantsCE}>{merchantPagination.error.message}</Alert> : null
                    }
                    { merchantList }
                </div>
                <LoadingOverlay loading={merchantPagination.isFetching}/>
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
        loadMerchantsCE: MerchantActions.getListCError
    }
)(MerchantList)

