import React from 'react'
import { render } from 'react-dom'

import Header from './components/header'
import Footer from './components/footer'
import Sidebar from './components/sidebar'
import Content from './components/content'

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

render(<App />, document.getElementById('app'))