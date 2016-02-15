
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import  SideBarToggler  from '../components/SideBarToggler'

//import LoginDropdown from './header/login_dropdown'

/*const Header = React.createClass({
    componentWillMount() {
        document.body.classList.add('sidebar-mini');
    },
    sidebarToggle (){
        document.body.classList.toggle('sidebar-collapse');
        document.body.classList.toggle('sidebar-open');
    }
})

export default Header;
*/





export default class Header extends Component {

//sidebar-mini
    render() {
        return (
            <header className="main-header">
                <Link className="logo" to="/admin/">
                    <span className="logo-mini"><b>XO</b>P</span>
                    <span className="logo-lg"><b>XOP</b>ay</span>
                </Link>
                <nav className="navbar navbar-static-top">
                    <SideBarToggler/>
                    {/*<LoginDropdown isLoged={this.props.isLoged} />*/}
                </nav>
            </header>
        );
    }
    sidebarToggle (){
        //document.body.classList.toggle('sidebar-collapse');
        //document.body.classList.toggle('sidebar-open');
    }
}


/* < */
/*
 <!--i className="fa fa-angle-left pull-right"></i-->*/