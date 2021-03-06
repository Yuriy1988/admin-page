import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {PaySystemsContractsActions} from '../../actions/index';
import PaySystemContractModel from '../../models/paysystemContract';
import Alert, {TYPE_ERROR} from '../../components/Alert';
import LoadingOverlay from '../../components/LoadingOverlay';
import Boolean from '../../components/Boolean';

class PaySystemContractListPage extends Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
    }

    componentDidMount() {
        PaySystemContractListPage.loadData(this.props, -1);
    }

    componentWillReceiveProps(props) {
        const {paysysId} = this.props.params;

        PaySystemContractListPage.loadData(props, paysysId);
    }

    static loadData(props, prevPaySysId) {
        const {paysysId} = props.params;

        if (paysysId !== prevPaySysId) {
            const {loadContracts} = props;
            loadContracts(paysysId);
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
                        <th>Filter</th>
                        <th>Currency</th>
                        <th>Comission %</th>
                        <th>Comission Fixed</th>
                        <th>Document</th>
                        <th>Active</th>
                        <th width="230px">Actions</th>
                    </tr>
                    {items}
                    </tbody>
                </table>
            </div>
        ) : <p></p>;
    }

    handleDelete(contractId) {
        const {deleteContract} = this.props;
        if (confirm("Are you sure you want to delete payment system contract?")) {
            deleteContract(contractId);
        }
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
        const {loadContractsCE, contracts, getListRequest} = this.props;
        const {paysysId} = this.props.params;

        const contractsList = PaySystemContractListPage.renderList(getListRequest.ids.map((contractId, i) => {
            const contract = new PaySystemContractModel(contracts[contractId]);

            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td><span className="contract-filter">{contract.filter}</span></td>
                    <td>{contract.currency}</td>
                    <td>{contract.commissionPct}%</td>
                    <td>{contract.commissionFixed} {contract.currency}</td>
                    <td><a target="_blank" className="btn btn-default btn-sm" href={contract.contractDocUrl}>Open
                        document</a></td>
                    <td><Boolean value={contract.active}/></td>
                    <td >
                        <div className="btn-toolbar pull-right">
                            <button className={"btn btn-sm btn-"+((contract.active) ? "danger" : "success")}
                                    onClick={this.handleToggle.bind(this, contract)}>
                                <i className="fa fa-power-off"/>&nbsp;{(contract.active) ? "Disable" : "Enable"}
                            </button>
                            <Link className="btn btn-sm btn-primary"
                                  to={`/admin/administrator/paysys/${paysysId}/contracts/${contractId}/edit`}>
                                <i className="fa fa-edit"/>&nbsp;Edit
                            </Link>
                            <button className="btn btn-sm btn-danger"
                                    onClick={this.handleDelete.bind(this, contract.id)}>
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
                    <h3 className="box-title"><i className="fa fa-file-text-o"/>&nbsp;Payment System Contracts</h3>
                    <div className="box-tools pull-right btn-group">
                        <Link className="btn btn-sm btn-success"
                              to={`/admin/administrator/paysys/${paysysId}/contracts/add`}>
                            <i className="fa fa-plus"/> Add
                        </Link>
                    </div>
                </div>
                <div className="box-body no-padding">
                    {(!!getListRequest.error) ?
                        <Alert type={TYPE_ERROR}
                               handleClose={loadContractsCE}>
                            {getListRequest.error.message}
                        </Alert> : null}
                    {contractsList}
                </div>
                <LoadingOverlay loading={getListRequest.isFetching}/>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        contracts: state.entities.paysysContracts,
        getListRequest: state.pagination.paysystemContractList
    }),
    {
        loadContracts: PaySystemsContractsActions.getList,
        loadContractsCE: PaySystemsContractsActions.getListCError,

        enable: PaySystemsContractsActions.enable,
        disable: PaySystemsContractsActions.disable,
        deleteContract: PaySystemsContractsActions.deleteById
    }
)(PaySystemContractListPage)

