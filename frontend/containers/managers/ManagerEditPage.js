import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import {connect} from 'react-redux'
import * as ManagerActions from '../../actions/managers';
import ManagerForm from './ManagerForm'
import LoadingOverlay from '../../components/LoadingOverlay'

class ManagerEditPage extends Component {

    constructor(props) {
        super(props);
        this.onCreate = this.onCreate.bind(this);
    }

    componentWillMount() {
        this.props.getManagerById(this.props.params.managerId);
    }

    onCreate(manager) {
        const { editManager } = this.props;
        const body = {
            id: this.props.selectedManager.id,
            merchant_id: this.props.selectedManager.merchantId,
            user: manager
        };
        editManager(body, this.props.params.managerId);
    }

    render() {
        const {selectedManager} = this.props;
        return selectedManager.user.username? (
            <div>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Edit manager</h3>
                    </div>
                    <div className="box-body">
                        <ManagerForm
                            onSubmit={this.onCreate.bind(this)}
                            selectedManager={selectedManager}
                        />
                        <LoadingOverlay loading={selectedManager.isFetching}/>
                    </div>
                </div>
            </div>
        ): <LoadingOverlay loading={true}/>
    }
}

export default connect(
    (state)=>({
        selectedManager: state.manager
    }),
    {
        getManagerById: ManagerActions.getManagerById,
        editManager: ManagerActions.editManager,
        clearManager: ManagerActions.clearManager,

    }
)(ManagerEditPage)
