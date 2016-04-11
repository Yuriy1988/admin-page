import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {RedirectActions, PaySystemsActions, PaginationActions} from '../../actions/index'

import PaySystemForm from '../../components/forms/PaySystemForm'
import LoadingOverlay from '../../components/LoadingOverlay'
import Alert, {TYPE_ERROR} from '../../components/Alert'

class PaySystemEditPage extends Component {

    constructor(props) {
        super(props);
        this.onEdit = this.onEdit.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(props) {
        const {editRequest, redirect, clearPagination} = props;

        if (!!editRequest.result) {
            redirect(`/admin/administrator/paysys`);
            clearPagination("paySystemEdit"); //TODO constant
            clearPagination("paySystemGet"); //TODO constant
        }
    }

    componentWillUnmount() {
        const {clearPagination} = this.props;
        clearPagination("paySystemEdit"); //TODO constant
        clearPagination("paySystemGet"); //TODO constant
    }

    loadData() {
        const {loadPaySys} = this.props;
        const {paysysId} = this.props.params;
        loadPaySys(paysysId);
    }

    onEdit(paysysData) {
        const {edit} = this.props;
        const {paysysId} = this.props.params;
        edit(paysysId, paysysData);
    }

    render() {
        const {editRequest, editCE} = this.props;
        const {getRequest, loadPaySysCE} = this.props;
        const {paySystems} = this.props;


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

        let paysys = null;
        if (getRequest.result) {
            const paysysId = getRequest.result;
            if (paySystems[paysysId]) {
                paysys = paySystems[paysysId];
            }
        }

        const form = (paysys) ?
            <PaySystemForm onSubmit={this.onEdit} errors={errors} initPaySystem={paysys}/> : null;
        return (
            <div>
                <Alert type={TYPE_ERROR} handleClose={editCE}>{errorEdit}</Alert>
                <Alert type={TYPE_ERROR} handleClose={loadPaySysCE}>{errorGet}</Alert>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Edit payment system</h3>
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
        editRequest: state.pagination.paySystemEdit,
        getRequest: state.pagination.paySystemGet,
        paySystems: state.entities.paySystems
    }),
    {
        loadPaySys: PaySystemsActions.getById,
        loadPaySysCE: PaySystemsActions.getByIdCError,
        cancel: RedirectActions.back,
        redirect: RedirectActions.redirect,
        edit: PaySystemsActions.editById,
        editCE: PaySystemsActions.editByIdCError,

        clearPagination: PaginationActions.clear
    }
)(PaySystemEditPage)
