import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {PaySystemsActions, PaginationActions} from '../../actions/index';
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

    componentWillUnmount() {
        const {clearPagination} = this.props;
        clearPagination("paySystemEdit"); //TODO constant
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
                        <th>Active</th>
                        <th width="240px">Actions</th>
                    </tr>
                    {items}
                    </tbody>
                </table>
            </div>
        ) : <p>No items</p>;
    }

    handleToggle(contract) {
        const {enable, disable} = this.props;
        if (contract.active) {
            disable(contract.id);
        } else {
            enable(contract.id);
        }
    }

    render() {
        const {loadPaySystemsCE, paySystems, paySystemsList, editRequest, editRequestCE} = this.props;
        let list = [];
        try {
            list = PaySystemListPage.renderList(paySystemsList.result.paymentSystems.map((paySysId, i) => {
                const paySys = paySystems[paySysId];
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{paySys.paysysName}</td>
                        <td>
                            <Boolean value={paySys.active}/>
                        </td>
                        <td >
                            <div className="btn-toolbar pull-right">
                                <button className={"btn btn-sm btn-"+((paySys.active) ? "danger" : "success")}
                                        onClick={this.handleToggle.bind(this, paySys)}>
                                    <i className="fa fa-power-off"/>&nbsp;{(paySys.active) ? "Disable" : "Enable"}
                                </button>
                                {/*<Link className="btn btn-sm btn-primary"*/}
                                      {/*to={`/admin/administrator/paysys/${paySysId}/edit`}>*/}
                                    {/*<i className="fa fa-edit"/> Edit*/}
                                {/*</Link>*/}
                                <Link className="btn btn-sm btn-primary"
                                      to={`/admin/administrator/paysys/${paySysId}/contracts`}>
                                    <i className="fa fa-file-text-o"/> Contracts
                                </Link>
                            </div>
                        </td>
                    </tr>
                );
            }));
        } catch (e) {
        }

        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title"><i className="fa fa-cc"/> Payment Systems</h3>
                </div>
                <div className="box-body no-padding">
                    {/*{(!!paySystemsList.error) ?*/}
                        {/*<Alert type={TYPE_ERROR}*/}
                               {/*handleClose={loadPaySystemsCE}>*/}
                            {/*{paySystemsList.error.message}*/}
                        {/*</Alert> : null}*/}
                    {/*{(!!editRequest.error) ?*/}
                        {/*<Alert type={TYPE_ERROR}*/}
                               {/*handleClose={editRequestCE}>*/}
                            {/*{editRequest.error.serverError.errors.active}*/}
                        {/*</Alert> : null}*/}
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
        paySystemsList: state.pagination.paySystemsList,
        editRequest: state.pagination.paySystemEdit

    }),
    {
        loadPaySystems: PaySystemsActions.getList,
        loadPaySystemsCE: PaySystemsActions.getListCError,

        editRequestCE: PaySystemsActions.editByIdCError,

        enable: PaySystemsActions.enable,
        disable: PaySystemsActions.disable,

        clearPagination: PaginationActions.clear
    }
)(PaySystemListPage)

