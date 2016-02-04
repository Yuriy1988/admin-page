import React from 'react'
import LoginDropdown from './header_components/login_dropdown'

const Header = React.createClass({
  render() {
    var ifLogedDropdownList = this.props.isLoged? <LoginDropdown isLoged={this.props.isLoged} /> : null;
    return (
       <header className="main-header">
				<a className="logo" href="#/">
            	<span className="logo-mini"><b>XO</b>P</span>
            	<span className="logo-lg"><b>XOP</b>ay</span>
        	</a>
        	<nav className="navbar navbar-static-top">
            	<a href="#" className="sidebar-toggle">
                	<span className="sr-only">Toggle navigation</span>
            	</a>
              {ifLogedDropdownList}
	        </nav>
			</header>
    )
  }
})

export default Header;