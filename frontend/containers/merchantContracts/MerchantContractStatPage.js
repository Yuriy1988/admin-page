import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { StoreActions } from '../../actions/index';

import Alert, {TYPE_ERROR} from '../../components/Alert';
import Boolean from '../../components/Boolean';
import LoadingOverlay from '../../components/LoadingOverlay';

import StoreModel from '../../models/store'

import Chart from '../../components/Chart'


class StorePage extends Component {
    constructor(props) {
        super(props);
        console.log(Chart);
    }

    componentDidMount() {
        $('#reservation').daterangepicker();

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

        const {stores, storePagination} = this.props;

        const storeInfo = new StoreModel(stores[storePagination.result]);

        return (
            <div>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">
                            {storeInfo.storeName} - Statistic
                        </h3>
                    </div>
                    <div className="box-body">
                        <div className="form-group">
                            <div className="row">

                                <div className="col-sm-4">
                                    <select className="form-control">
                                        <option>PayPal</option>
                                        <option>BitCoin</option>
                                        <option>Visa/Master</option>
                                    </select>
                                </div>
                                <div className="col-sm-4">
                                    <select className="form-control">
                                        <option>Pending</option>
                                        <option>Closed</option>
                                        <option>Succeed</option>
                                    </select>
                                </div>
                                <div className="col-sm-4">
                                    <select className="form-control">
                                        <option>UAH</option>
                                        <option>RUR</option>
                                        <option>USD</option>
                                        <option>EUR</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="Receipt #"/>
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="Transaction #"/>
                                </div>
                                <div className="col-sm-3">
                                    <div className="input-group">
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar"/>
                                        </div>
                                        <input type="text" className="form-control pull-right" id="reservation"/>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <a type="text" className="btn btn-success btn-block">Filter</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <Chart />
                    <LoadingOverlay loading={false}/>
                </div>
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
