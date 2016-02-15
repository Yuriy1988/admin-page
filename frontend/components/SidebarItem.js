import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

class SidebarItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {subItems,item} = this.props;

        if (typeof subItems != 'undefined') {
            return (
                <li className="treeview active">
                    <a href="#">
                        <i className={"fa "+item.icon}/>
                        {item.children}
                        <i className="fa fa-angle-left pull-right"/>
                    </a>
                    <ul className="treeview-menu ">
                        {subItems.map((item)=> {
                            return (
                                <li>
                                    <Link to={item.to}>
                                        <i className={"fa "+item.icon}/>
                                        {item.children}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </li>
            );
        } else {
            return (
                <li>
                    <Link to={item.to}>
                        <i className={"fa "+item.icon}/>
                        {item.children}
                    </Link>
                </li>
            );
        }


    }
}


export default connect()(SidebarItem);
/* < */
/*
 <!--i className="fa fa-angle-left pull-right"></i-->*/