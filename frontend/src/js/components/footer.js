import React from 'react'

const Footer = React.createClass({
  render() {
  	var logInSite = this.props.isLoged ? {marginLeft: '230px'} : {marginLeft: '0px'};
    return (
      <footer className="main-footer" style={logInSite}>
          <strong>Copyright © 2016 <a href="#">Company</a>.</strong> All rights reserved.
      </footer>
    )
  }
})

export default Footer;