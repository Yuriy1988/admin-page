import React from 'react'
import SidebarList from './sidebar/sidebar_list.js'

const Sidebar = React.createClass({
  render() {
    return (
      	<aside className="main-sidebar">
	        <section className="sidebar">
	        	{/*Here sidebar components list*/}
	        	<SidebarList />
	        </section>
    	</aside>
    )
  }
})

export default Sidebar