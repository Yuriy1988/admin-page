import React from 'react'

const Login = React.createClass({
  render() {
    var userLoged = this.props.isLoged? {display: ''} : {display: 'none'} ;
    return (
        <div className="navbar-custom-menu" style={userLoged}>
           <ul className="nav navbar-nav">
            <li className="dropdown " onClick={this.dropdownToggle}> {/*class open should be added/removed by click event*/}
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                <i className="glyphicon glyphicon-user"></i> test
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a href="#">Logout</a>
                </li>
                <li className="divider"></li>
                <li>
                  <a href="">Русский</a>
                </li>
                <li>
                  <a href="">English
                    <i className="fa fa-hand-o-left"></i>
                  </a>
                </li>
            </ul>
          </li>
        </ul>
      </div>
    )
  },
  dropdownToggle (event) {
    var target = event.target;

    while (target != this) {
      if (target.tagName == 'LI') {
        target.classList.toggle('open');
        return;
      }
        target = target.parentNode;
    }
  }

})

export default Login