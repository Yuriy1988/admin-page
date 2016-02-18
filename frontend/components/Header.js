import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import  SideBarToggler  from '../components/SideBarToggler'

import HeaderUser from '../components/HeaderUser'

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


class Header extends Component {

    render() {
        return (
            <header className="main-header">
                <Link className="logo" to="/admin/">
                    <span className="logo-mini"><b>XO</b>P</span>
                    <span className="logo-lg"><b>XOP</b>ay</span>
                </Link>
                <nav className="navbar navbar-static-top">
                    <SideBarToggler/>
                    <HeaderUser />
                </nav>
            </header>
        );
    }
}

export default connect()(Header)

