import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import * as MerchantActions from '../actions/merchants';

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
        return (
            <ul>
                {preRender}
            </ul>
        )
    }

    render() {

        let {merchants, merchantPagination} = this.props;

        console.log(merchantPagination);

        const merchantList = MerchantList.renderList(merchantPagination.ids.map((merchantId) => {
            return `${merchants[merchantId].id} - ${merchants[merchantId].merchantName}`;
        }));

        console.log(merchantList);

        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title">Merchants</h3>
                </div>
                <div className="box-body">
                    {
                        (merchantPagination.isFetching) ? <p>Loading...</p> : null
                    }
                    { merchantList }

                </div>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        merchants: state.entities.merchants,
        merchantPagination: state.pagination.merchants, st: state
    }),
    {loadMerchants: MerchantActions.getList}
)(MerchantList)
