import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {RedirectActions, MerchantActions, DictionaryActions} from '../../actions/index'

import MerchantForm from '../../components/forms/MerchantForm'

class MerchantAddPage extends Component {
    constructor(props) {
        super(props);
    }

    onCreate(merchant) {
        const { create } = this.props;
        create(merchant)
    }

    render() {



        /*if (!!storeCreatePagination.result) {
         redirect(`/admin/administrator/stores/${storeCreatePagination.result}`, true);
         }*/

        return (
            <div>
                <MerchantForm />
            </div>
        )
    }
}


export default connect(
    (state)=>({}),
    {
        cancel: RedirectActions.back,
        create: MerchantActions.create,
        redirect: RedirectActions.redirect,
        createCE: MerchantActions.createCError
    }
)(MerchantAddPage)
