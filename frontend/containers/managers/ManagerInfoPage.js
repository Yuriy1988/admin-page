import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Alert, {TYPE_ERROR} from '../../components/Alert'
import {Link} from 'react-router'
import * as ManagersActions from '../../actions/managers';
import LoadingOverlay from '../../components/LoadingOverlay';
import Boolean from '../../components/Boolean';

class ManagerInfoPage extends Component {
    constructor (props) {
        super(props);
    }

    componentWillMount () {
        const id = this.props.params.managerId;
        this.props.getManagerById(id);
    }

    handleDeleteButton (managerId) {
        const {deleteManager} = this.props;
        deleteManager(managerId);
    }

    render () {
        const {manager, manager:{user}, getManagerById}  = this.props;

        return ( user.username ?
                <div className="row">

                    <div className="col-sm-6">
                        <div className="box with-border box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">Manager info</h3>
                                <div className="btn-toolbar pull-right">
                                    <Link
                                        onClick={()=> {getManagerById(manager.id)}}
                                        className="btn btn-sm btn-primary"
                                        to={`/admin/administrator/merchants/${manager.merchantId}/managers/${manager.id}/edit`}>
                                        <i className="fa fa-edit"/> Edit
                                    </Link>


                                    <span className="btn btn-sm btn-danger"
                                          onClick={this.handleDeleteButton.bind(this, manager.id)}>
                                        <i className="fa fa-trash"/> Delete
                                    </span>
                                </div>

                            </div>
                            <div className="box-body">
                                <ul className="list-group list-group-unbordered">
                                    <li className="list-group-item">
                                        <b>Manager Username</b> <span
                                        className="pull-right">{user.username}</span>
                                    </li>

                                    <li className="list-group-item">
                                        <b>First name</b>
                                        <span className="pull-right">{user.firstName}</span>
                                    </li>

                                    <li className="list-group-item">
                                        <b>Last name</b><span
                                        className="pull-right">{user.lastName}</span>
                                    </li>

                                    <li className="list-group-item">
                                        <b>E-mail</b><span
                                        className="pull-right">{user.email}</span>
                                    </li>

                                    <li className="list-group-item">
                                        <b>Id</b><span
                                        className="pull-right">{manager.id}</span>
                                    </li>

                                    <li className="list-group-item">
                                        <b>Notify</b><span
                                        className="pull-right">{user.notify}</span>
                                    </li>

                                    <li className="list-group-item">
                                        <b>Phone number</b><span
                                        className="pull-right">{user.phone}</span>
                                    </li>

                                    <li className="list-group-item">
                                        <b>Enabled</b>
                                        <Boolean className="pull-right" value={user.enabled}/>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div> : <div>
            <div className="col-sm-3 small-margin"><Alert type={TYPE_ERROR}>
            {manager.error}
            </Alert>
            </div>
            <LoadingOverlay loading={manager.isFetching}/>
            </div>

        )
    }
}

export default connect(
    (state)=>({
        manager: state.manager,
        managerList: state.managerList
    }),
    {
        getManagerById: ManagersActions.getManagerById,
        deleteManager: ManagersActions.deleteManager,
        clearManagerList: ManagersActions.clearManagerList,
        clearManager: ManagersActions.clearManager,

    }
)(ManagerInfoPage)

