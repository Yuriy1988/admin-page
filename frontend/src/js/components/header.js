import React from 'react'
import LoginDropdown from './header/login_dropdown'

const Header = React.createClass({
  componentWillMount() {
      document.body.classList.add('sidebar-mini'); 
  },
  render() {
    return (
       <header className="main-header">
				<a className="logo" href="#/">
            	<span className="logo-mini"><b>XO</b>P</span>
            	<span className="logo-lg"><b>XOP</b>ay</span>
        	</a>
        	<nav className="navbar navbar-static-top">
            	<a href="#" onClick={this.sidebarToggle} className="sidebar-toggle">
                	<span className="sr-only">Toggle navigation</span>
            	</a>
              <LoginDropdown isLoged={this.props.isLoged} />
	        </nav>
			</header>
    )
  },
  sidebarToggle (){
    document.body.classList.toggle('sidebar-collapse');
    document.body.classList.toggle('sidebar-open');
  }
})

export default Header;