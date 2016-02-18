import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
//import Content from '../components/Content'
import SideBarProvider from '../containers/SideBarProvider'

class App extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { children } = this.props;

        return (
            <SideBarProvider>
                <Header isLoged={false}/>
                {children}

                <Footer />
            </SideBarProvider>
        )
    }
}


export default connect()(App)
