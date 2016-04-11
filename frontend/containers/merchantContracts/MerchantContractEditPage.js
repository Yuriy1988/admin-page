import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {RedirectActions, MerchantContractActions, PaginationActions} from '../../actions/index'

import MerchantContractForm from '../../components/forms/MerchantContractForm'
import LoadingOverlay from '../../components/LoadingOverlay'
import Alert, {TYPE_ERROR} from '../../components/Alert'

class MerchantContractEditPage extends Component {

    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(props) {
        const {editRequest, back, clearPagination} = props;

        if (!!editRequest.result) {
            //redirect(`/admin/administrator/${editRequest.result}`); TODO REDIRECT
            back(); // FIXME Temp workaroud
            clearPagination("merchantContractEdit"); //TODO constant
            clearPagination("merchantContractGet"); //TODO constant
        }
    }

    componentWillMount() {
        const {clearPagination} = this.props;
        clearPagination("merchantContractEdit"); //TODO constant
        clearPagination("merchantContractGet"); //TODO constant
    }

    componentWillUnmount() {
        const {clearPagination} = this.props;
        clearPagination("merchantContractEdit"); //TODO constant
        clearPagination("merchantContractGet"); //TODO constant
    }

    loadData() {
        const {loadMerchantContract} = this.props;
        const {merchantContractId} = this.props.params;
        loadMerchantContract(merchantContractId);
    }

    onEdit(contract) {
        const {edit} = this.props;
        const {merchantContractId} = this.props.params;
        edit(merchantContractId, contract);
    }

    render() {
        const {editRequest, editCE} = this.props;
        const {getRequest, loadStoreCE} = this.props;
        const {merchantContracts} = this.props;


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
            const storeId = getRequest.result;
            if (merchantContracts[storeId]) {
                contract = merchantContracts[storeId];
            }
        }

        const form = (contract) ?
            <MerchantContractForm onSubmit={this.onEdit} errors={errors} initMerchantContract={contract}/> : null;
        return (
            <div>
                <Alert type={TYPE_ERROR} handleClose={editCE}>{errorEdit}</Alert>
                <Alert type={TYPE_ERROR} handleClose={loadStoreCE}>{errorGet}</Alert>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Edit merchant contract</h3>
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
        editRequest: state.pagination.merchantContractEdit,
        getRequest: state.pagination.merchantContractGet,
        merchantContracts: state.entities.merchantContracts
    }),
    {
        loadMerchantContract: MerchantContractActions.getById,
        loadMerchantContractCE: MerchantContractActions.getByIdCError,
        cancel: RedirectActions.back,
        redirect: RedirectActions.redirect,
        back: RedirectActions.back,
        edit: MerchantContractActions.editById,
        editCE: MerchantContractActions.editByIdCError,

        clearPagination: PaginationActions.clear
    }
)(MerchantContractEditPage)
