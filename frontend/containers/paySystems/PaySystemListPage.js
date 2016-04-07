import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {PaySystemsActions} from '../../actions/index';
import Alert, {TYPE_ERROR} from '../../components/Alert';
import LoadingOverlay from '../../components/LoadingOverlay';
import Boolean from '../../components/Boolean';

class PaySystemListPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        PaySystemListPage.loadData(this.props);
    }

    static loadData(props) {
        const {loadPaySystems} = props;
        loadPaySystems();
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


    render() {
        const {loadPaySystemsCE, paySystems, paySystemsList} = this.props;


        const list = PaySystemListPage.renderList(paySystemsList.ids.map((paySysId, i) => {
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                        <Link to={`/admin/administrator/paysys/${paySysId}`}>
                            {JSON.stringify(paySystems[paySysId])}
                        </Link>
                    </td>
                    {/*<td >
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
                    </td>*/}
                </tr>
            );
        }));

        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title"><i className="fa fa-cc"/> Payment Systems</h3>
                </div>
                <div className="box-body no-padding">
                    {(!!paySystemsList.error) ?
                        <Alert type={TYPE_ERROR}
                               handleClose={loadPaySystemsCE}>
                            {paySystemsList.error.message}
                        </Alert> : null}
                    {list}
                </div>
                <LoadingOverlay loading={paySystemsList.isFetching}/>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        paySystems: state.entities.paySystems,
        paySystemsList: state.pagination.paySystemsList
    }),
    {
        loadPaySystems: PaySystemsActions.getList,
        loadPaySystemsCE: PaySystemsActions.getListCError
        //deleteStore: StoresActions.deleteById
    }
)(PaySystemListPage)

