import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { StoreActions } from '../../actions/index';

import Alert, {TYPE_ERROR} from '../../components/Alert';
import Boolean from '../../components/Boolean';
import LoadingOverlay from '../../components/LoadingOverlay';

import StoreModel from '../../models/store'


class StorePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        StorePage.loadData(this.props, -1);
    }

    componentWillReceiveProps(props) {
        const {storeId} = this.props.params;

        StorePage.loadData(props, storeId);
    }

    static loadData(props, prevStoreId) {
        const {storeId} = props.params;

        if (storeId !== prevStoreId) {
            const {loadStore} = props;
            loadStore(storeId);
        }
    }


    render() {

        const {stores, storePagination, loadStoreCE, children} = this.props;

        const storeInfo = new StoreModel(stores[storePagination.result]);

        return (
            <div>
                <div className="box">
                    <div className="box-body">
                        <img className=" img-responsive" src={storeInfo.logo}/>
                    </div>
                    <LoadingOverlay loading={storePagination.isFetching}/>
                </div>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">
                            {storeInfo.storeName}
                        </h3>
                        <div className="box-tools pull-right">
                            <Link className="btn btn-sm btn-success" to={`/admin/administrator/stores/${storeInfo.id}/stat`}><i
                                className="fa fa-pie-chart"/> Statistic</Link>
                        </div>
                    </div>
                    <LoadingOverlay loading={storePagination.isFetching}/>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="box">
                            <div className="box-header with-border">
                                <h3 className="box-title">
                                    Store information
                                </h3>
                            </div>
                            <div className="box-body">
                                <ul className="list-group list-group-unbordered">
                                    <li className="list-group-item">
                                        <b>Category</b>
                                        <p className="text-muted pull-right">{storeInfo.category}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Show logo</b>
                                        <Boolean className="pull-right" value={storeInfo.showLogo}/>
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Description</strong>
                                        <p className="text-muted">{storeInfo.description}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Store identifier</strong>
                                        <p className="text-muted pull-right">{storeInfo.storeIdentifier}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Store front</strong>
                                        <a className="pull-right btn-success btn btn-xs"
                                           target="_blank"
                                           href={storeInfo.storeUrl}>
                                            {storeInfo.storeName} &nbsp;
                                            <i className="fa fa-arrow-right"/>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <LoadingOverlay loading={storePagination.isFetching}/>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="box">
                            <div className="box-header with-border">
                                <h3 className="box-title">
                                    Settings
                                </h3>
                            </div>
                            <div className="box-body">
                                <ul className="list-group list-group-unbordered">
                                    <li className="list-group-item">
                                        <b>Comission</b>
                                        <p className="text-muted pull-right">{storeInfo.settings.commissionPct}%</p>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Failure Url</b>
                                        <p className="text-muted pull-right">{storeInfo.settings.failureUrl}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <b>Succeed Url</b>
                                        <p className="text-muted pull-right">{storeInfo.settings.succeedUrl}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Sign Key</strong>
                                        <p className="text-muted pull-right">{storeInfo.settings.signKey}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Sign Algorithm</strong>
                                        <p className="text-muted pull-right">{storeInfo.settings.signAlgorithm}</p>
                                    </li>
                                </ul>
                            </div>
                            <LoadingOverlay loading={storePagination.isFetching}/>
                        </div>
                    </div>
                </div>

                {(!!storePagination.error) ?
                    <Alert type={TYPE_ERROR}
                           handleClose={loadStoreCE}>{storePagination.error.message}</Alert> : null}

                {children}

            </div>
        )
    }
}


export default connect(
    (state)=>({
        stores: state.entities.stores,
        storePagination: state.pagination.store
    }),
    {
        loadStore: StoreActions.getById,
        loadStoreCE: StoreActions.getByIdCError
    }
)(StorePage)
