import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import SideBarToggler  from './SideBarToggler'
import HeaderUser from './HeaderUser'

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

