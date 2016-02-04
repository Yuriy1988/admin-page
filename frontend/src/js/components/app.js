import React from 'react'
import { Link } from 'react-router';

import Header from './header'
import Footer from './footer'
import Sidebar from './side_bar'
import Content from './content'

const App = React.createClass({
  getInitialState() {
      return {
          isLoged: false,
      };
  },
  render() {
    var logInSite = this.state.isLoged ? {marginLeft: '230px'} : {marginLeft: '0px'};
    return (
      <div className="components">
        <Header isLoged={this.state.isLoged}/>
        <div className="content-wrapper" style={logInSite}>
            <Content loged={this.state.isLoged}/>
        </div>
        <Footer isLoged={this.state.isLoged}/>
      </div>
    )
  }
})

export default App