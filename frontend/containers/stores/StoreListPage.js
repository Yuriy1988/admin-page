import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as StoresActions from '../../actions/stores';
import Alert, {TYPE_ERROR} from '../../components/Alert';
import LoadingOverlay from '../../components/LoadingOverlay';
import Boolean from '../../components/Boolean';

class StoreListPage extends Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        StoreListPage.loadData(this.props, -1);
    }

    componentWillReceiveProps(props) {
        const {merchantId} = this.props.params;

        StoreListPage.loadData(props, merchantId);
    }

    static loadData(props, prevMerchantId) {
        const {merchantId} = props.params;

        if (merchantId !== prevMerchantId) {
            const {loadStores} = props;
            loadStores(merchantId);
        }
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
                        <th width="160px">Actions</th>
                    </tr>
                    {items}
                    </tbody>
                </table>
            </div>
        ) : <p>No items</p>;
    }

    handleDelete(storeId) {
        const { deleteStore } = this.props;
        if (confirm("Are you sure you want to delete store?")) {
            deleteStore(storeId);
        }
    }

    render() {
        const { loadStores, loadStoresCE, stores, storesPagination } = this.props;
        const { merchantId } = this.props.params;

        const storesList = StoreListPage.renderList(storesPagination.ids.map((storeId, i) => {
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                        <Link to={`/admin/administrator/stores/${storeId}`}>
                            {stores[storeId].storeName}
                        </Link>
                    </td>
                    <td >
                        <div className="btn-toolbar pull-right">
                            <Link className="btn btn-sm btn-primary"
                                  to={`/admin/administrator/stores/${storeId}/edit`}>
                                <i className="fa fa-edit"/>&nbsp;Edit
                            </Link>
                            <button className="btn btn-sm btn-danger"
                                    onClick={this.handleDelete.bind(this, stores[storeId].id)}>
                                <i className="fa fa-trash"/>&nbsp;Delete
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }));

        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title"><i className="fa fa-shopping-cart"/> Stores</h3>
                    <div className="box-tools pull-right btn-group">
                        <Link className="btn btn-sm btn-success"
                              to={`/admin/administrator/merchants/${merchantId}/stores/add`}>
                            <i className="fa fa-plus"/> Add
                        </Link>
                    </div>
                </div>
                <div className="box-body no-padding">
                    {(!!storesPagination.error) ?
                        <Alert type={TYPE_ERROR}
                               handleClose={loadStoresCE}>
                            {storesPagination.error.message}
                        </Alert> : null}
                    {storesList}
                </div>
                <LoadingOverlay loading={storesPagination.isFetching}/>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        stores: state.entities.stores,
        storesPagination: state.pagination.stores
    }),
    {
        loadStores: StoresActions.getList,
        loadStoresCE: StoresActions.getListCError,
        deleteStore: StoresActions.deleteById
    }
)(StoreListPage)

