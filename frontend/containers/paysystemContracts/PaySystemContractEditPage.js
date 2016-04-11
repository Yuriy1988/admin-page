import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { RedirectActions, PaySystemsContractsActions, PaginationActions } from '../../actions/index'

import PaySystemContractForm from '../../components/forms/PaySystemContractForm'
import LoadingOverlay from '../../components/LoadingOverlay'
import Alert, { TYPE_ERROR } from '../../components/Alert'

class PaySystemContractEditPage extends Component {

    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentWillReceiveProps(props) {
        const { editRequest, back, clearPagination} = props;

        if (!!editRequest.result) {
            //redirect(`/admin/administrator/${editRequest.result}`); TODO REDIRECT
            back(); // FIXME Temp workaroud
            clearPagination("paysystemContractEdit"); //TODO constant
            clearPagination("paysystemContractGet"); //TODO constant
        }
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillMount() {
        const { clearPagination } = this.props;
        clearPagination("paysystemContractEdit"); //TODO constant
        clearPagination("paysystemContractGet"); //TODO constant
    }

    componentWillUnmount() {
        const { clearPagination } = this.props;
        clearPagination("paysystemContractEdit"); //TODO constant
        clearPagination("paysystemContractGet"); //TODO constant
    }

    loadData() {
        const { loadContract } = this.props;
        const { paysysContractId } = this.props.params;
        loadContract(paysysContractId);
    }

    onEdit(contract) {
        const { edit } = this.props;
        const { paysysContractId } = this.props.params;
        edit(paysysContractId, contract);
    }

    render() {
        const { editRequest, editCE } = this.props;
        const { getRequest, loadContractCE } = this.props;
        const { contracts } = this.props;


        let errors = {};
        try {
            errors = editRequest.error.serverError.errors;
        } catch (e) {
        }

        let errorEdit = null;
        if (editRequest.error) {
            errorEdit = editRequest.error.serverError.message;
        }

        let errorGet = null;
        if (getRequest.error) {
            errorGet = getRequest.error.serverError.message;
        }

        let contract = null;
        if (getRequest.result) {
            const contractId = getRequest.result;
            if (contracts[contractId]) {
                contract = contracts[contractId];
            }
        }

        const form = (contract) ?
            <PaySystemContractForm onSubmit={this.onEdit} errors={errors} initContract={contract}/> : null;
        return (
            <div>
                <Alert type={TYPE_ERROR} handleClose={editCE}>{errorEdit}</Alert>
                <Alert type={TYPE_ERROR} handleClose={loadContractCE}>{errorGet}</Alert>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Edit payment system contract</h3>
                    </div>
                    <div className="box-body">
                        {form}
                    </div>
                    <LoadingOverlay loading={editRequest.isFetching || getRequest.isFetching}/>
                </div>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        editRequest: state.pagination.paysystemContractEdit,
        getRequest: state.pagination.paysystemContractGet,
        contracts: state.entities.paysysContracts
    }),
    {
        loadContract: PaySystemsContractsActions.getById,
        loadContractCE: PaySystemsContractsActions.getByIdCError,
        cancel: RedirectActions.back,
        redirect: RedirectActions.redirect,
        back: RedirectActions.back,
        edit: PaySystemsContractsActions.editById,
        editCE: PaySystemsContractsActions.editByIdCError,

        clearPagination: PaginationActions.clear
    }
)(PaySystemContractEditPage)
