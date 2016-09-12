import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as ManagerActions from '../../actions/managers';
import ManagerForm from './ManagerForm'
import LoadingOverlay from '../../components/LoadingOverlay'

class ManagerCreatePage extends Component {

    constructor(props) {
        super(props);
        this.onCreate = this.onCreate.bind(this);
    }

    onCreate(manager) {
        const { addManager } = this.props;
        addManager(manager, this.props.params.merchantId);
    }

    render() {
        const selectedManager = this.props.selectedManager;
        return (
            <div>
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <h3 className="box-title">Add manager</h3>
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
        )
    }
}

export default connect(
    (state)=>({
        selectedManager: state.manager_to_add
    }),
    {
        addManager: ManagerActions.addManager,
        clearManager: ManagerActions.clearManager
    }
)(ManagerCreatePage)
