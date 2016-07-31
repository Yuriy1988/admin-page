var test;
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import LoadingOverlay from '../../components/LoadingOverlay';
import Chart from '../../components/Chart'


class Statistic extends Component {
    constructor(props) {
        super(props);
        this.getDate = this.getDate.bind(this);
    }

    componentDidMount() {

        $('.calendar-input').daterangepicker();
    }

    getDate (position) {
        let result;
        if ($('.calendar-input').val()) {
            let arr = $('.calendar-input').val().split('-')[position].split('/'); // make date to correct format
            result = arr[2].toString().trim() + '/' + arr[1].toString().trim() + '/' + arr[0].toString().trim()
        } else {
            result = '';
        }
        return result;
    }

    getValues() {
        let storeId, currency, fromPrice, tillPrice, paysysId, status, fromDate, tillDate, orderBy, limit, offset;

        storeId = $('.store-id-input').val();
        currency = $('.currency-input').val();
        fromPrice = $('.paymentFrom-input').val();
        tillPrice = $('.paymentTill-input').val();
        paysysId = ($('.paysyss-id-input').val()).replace(' ', '_');
        status = ($('.status-input').val()).replace(' ', '_').toUpperCase();
        fromDate = this.getDate(0);
        tillDate = this.getDate(1);
        orderBy = '';
        limit ='';
        offset ='';
        console.log(`?store_id=${storeId}&currency=${currency}&from_total_price=${fromPrice}&till_total_price=${tillPrice}&paysys_id=${paysysId}&status=${status}&from_date=${fromDate}till_date=${tillDate}&order_by=${orderBy}&limit=${limit}&offset=${offset}`);    }

    render() {
        const {stores, storePagination} = this.props;

        return (
            <div>
                <div className="col-sm-3">
                    <span>Select date </span>
                    <div className="input-group">
                        <div className="input-group-addon">
                            <i className="fa fa-calendar"/>
                        </div>
                        <input type="text" className="form-control pull-right calendar-input"/>
                    </div>
                </div>
                <div className="col-sm-3">
                    <span>Store id </span>
                    <div className="input-group">
                        <div className="input-group-addon">
                            <i className="fa fa-shopping-cart"/>
                        </div>
                        <input type="text" className="form-control pull-right store-id-input"/>
                    </div>
                </div>

                <div className="col-sm-3">
                    <span>Payment account</span>
                    <div className="input-group">
                        <input type="text" className="form-control pull-right payment-account-input"/>
                    </div>
                </div>

                <div className="col-sm-2">
                    <span>Select currency</span>
                    <select className="form-control currency-input">
                        <option></option>
                        <option>UAH</option>
                        <option>RUR</option>
                        <option>USD</option>
                        <option>EUR</option>
                    </select>
                </div>

                <div className="col-sm-2">
                    <span>Select pay system</span>
                    <select className="form-control paysyss-id-input">
                        <option></option>
                        <option>PAY PAL</option>
                        <option>BIT COIN</option>
                        <option>VISA MASTER</option>
                    </select>
                </div>

                <div className="col-sm-2">
                    <span>Select payment status</span>
                    <select className="form-control status-input">
                        <option></option>
                        <option>Created</option>
                        <option>Accepted</option>
                        <option>Success</option>
                        <option>3D secure</option>
                        <option>Processed</option>
                        <option>Rejected</option>
                    </select>
                </div>

                <div className="col-sm-2">
                    <span>Payment from</span>
                    <input type="text" className="form-control pull-right paymentFrom-input"/>
                    <div>
                        <span>Payment till</span>
                        <input type="text" className="form-control pull-right paymentTill-input"/>
                    </div>
                </div>

                <button className="btn btn-success" onClick={this.getValues.bind(this)}>Get statistic</button>
                <LoadingOverlay loading={false}/>
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
        // loadStore: StoreActions.getById,
        // loadStoreCE: StoreActions.getByIdCError
    }
)(Statistic)
