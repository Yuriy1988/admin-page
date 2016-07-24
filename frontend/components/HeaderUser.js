import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as UserActions from '../actions/user'

class HeaderUser extends Component {

    constructor(props) {
        super(props);
        this.handleToggle = this.handleToggle.bind(this);
        this.hideMe = this.hideMe.bind(this);
        this.logoutHandle = this.logoutHandle.bind(this);
        this.onOutClick = this.onOutClick.bind(this);
        this.state = {
            open: false
        };


        document.addEventListener('click', this.onOutClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onOutClick);
    }

    onOutClick(e) {
        if (!e.leaveOpen) {
            this.hideMe();
        }
    }

    handleToggle(e) {
        e.nativeEvent.leaveOpen = true;
        this.setState({
            open: !this.state.open
        })
    }

    logoutHandle(e) {
        debugger;
        e.preventDefault();
        const {logout} = this.props;
        logout();
    }

    hideMe() {
        this.setState({
            open: false
        })
    }

    render() {
        const {open} = this.state;
        const {user} = this.props;

        if (!user.token) {
            return null;
        }

        return (
            <div className="navbar-custom-menu">
                <ul className="nav navbar-nav">
                    <li className={["dropdown",(open)?"open":""].join(" ")}
                        onClick={this.handleToggle}> {/*class open should be added/removed by click event*/}
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                            <i className="glyphicon glyphicon-user"/> {user.userName}
                        </a>
                        <ul className="dropdown-menu">
                            <li>
                                <a href="#" onClick={this.logoutHandle}>Logout</a>
                                <a href="#" >Change password</a> //todo passchanging;
                            </li>
                            {/*<<li className="divider"/>
                             <li>
                             <a href="">Русский</a>
                             </li>
                             li>
                             <a href="">English
                             <i className="fa fa-hand-o-left"/>
                             </a>
                             </li>*/}
                        </ul>
                    </li>
                </ul>
            </div>
        );
    }
}


export default connect(
    (state)=> {
        return {user: state.user}
    }
    ,
    {
        logout: UserActions.logout
    }
)(HeaderUser)

