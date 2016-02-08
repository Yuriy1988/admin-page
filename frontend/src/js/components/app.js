import React from 'react'

import Header from './header'
import Footer from './footer'
import Sidebar from './sidebar'
import Content from './content'

const App = React.createClass({
  getInitialState() {
      return {
          isLoged: true,
      };
  },
  render() {
    return (
      <div className="components">
        <Header isLoged={this.state.isLoged}/>
        <Sidebar />
        <div className="content-wrapper">
            <Content loged={this.state.isLoged}/>
        </div>
        <Footer isLoged={this.state.isLoged}/>
      </div>
    )
  }
})

export default App