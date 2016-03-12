import React from 'react'
import ReactDOM from 'react-dom'

import Header from '../header'
import Content from '../content'
import Footer from '../footer'

const Login = React.createClass({
  render() {
    return (
      <div className="components">
        <Header isLoged={false}/>
        <div className="content-wrapper" style={{marginLeft: '0px'}}>
            <Content loged={false}/>
        </div>
        <Footer />
      </div>
    )
  }
})


ReactDOM.render(<Login />, document.getElementById('app'));