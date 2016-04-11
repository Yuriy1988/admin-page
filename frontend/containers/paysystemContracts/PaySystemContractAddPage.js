import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {RedirectActions, PaySystemsContractsActions, PaginationActions} from '../../actions/index'

import PaySystemContractForm from '../../components/forms/PaySystemContractForm'
import LoadingOverlay from '../../components/LoadingOverlay'
import Alert, {TYPE_ERROR} from '../../components/Alert'

class PaySystemContractAddPage extends Component {

    constructor(props) {
        super(props);
        this.onCreate = this.onCreate.bind(this);
    }

    onCreate(contract) {
        const {create} = this.props;
        const {paysysId} = this.props.params;
        create(paysysId, contract);
    }

    componentWillReceiveProps(props) {
        const {createRequest, clearPagination, redirect} = props;
        const {paysysId} = this.props.params;
        if (!!createRequest.result) {
            redirect(`/admin/administrator/paysys/${paysysId}/contracts`);
            clearPagination("paysystemContractCreate"); // TODO const
        }
    }

    componentWillUnmount() {
        const {clearPagination} = this.props;
        clearPagination("paysystemContractCreate");// TODO const
    }

    componentWillMount() {
        const {clearPagination} = this.props;
        clearPagination("paysystemContractCreate");// TODO const
    }

    render() {
        const {createRequest, createCE, redirect} = this.props;

        let errors = {};
        try {
            errors = createRequest.error.serverError.errors;
        } catch (e) {
        }


        let errorMsg = null;
        if (createRequest.error) {
            errorMsg = createRequest.error.serverError.message;
        }

        return (
            <div>
                <Alert type={TYPE_ERROR} handleClose={createCE}>{errorMsg}</Alert>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Adding payment system contract</h3>
                    </div>
                    <div className="box-body">
                        <PaySystemContractForm onSubmit={this.onCreate} errors={errors}/>
                    </div>
                    <LoadingOverlay loading={createRequest.isFetching}/>
                </div>
            </div>
        )
    }
}


export default connect(
    (state)=>({
        createRequest: state.pagination.paysystemContractCreate
    }),
    {
        create: PaySystemsContractsActions.create,
        createCE: PaySystemsContractsActions.createCError,
        cancel: RedirectActions.back,
        redirect: RedirectActions.redirect,
        clearPagination: PaginationActions.clear
    }
)(PaySystemContractAddPage)
