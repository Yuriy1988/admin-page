//TODO refactor
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

class SidebarItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {icon, to, children} =  this.props;

        switch (typeof to) {
            case 'string':
                return (
                    <li >
                        <Link to={to}>
                            <i className={"fa " + icon}/>
                            <span>{children}</span>
                        </Link>
                    </li>
                );
                break;
            case 'undefined':
                return (
                    <li  >
                        <a >
                            <i className={"fa " + icon}/>
                            <span>{children}</span>
                        </a>
                    </li>
                );
                break;
            default:
                return null
        }
    }
}


class SidebarContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {showChildren: false};
        this.toggleShow = this.toggleShow.bind(this);
    }

    toggleShow(e) {
        const {showChildren} = this.state;
        this.setState({
            showChildren: !showChildren
        });
        e.preventDefault();
    }

    render() {
        const {icon, title, children} = this.props;
        const {showChildren} = this.state;
        return (
            <li className={["treeview", (showChildren)?"active":""].join(" ")}>
                <a href="#" onClick={this.toggleShow}>
                    <i className={"fa " + icon}/>
                    <span>{title}</span>
                    <i className="fa fa-angle-left pull-right"/>
                </a>
                <ul className="treeview-menu ">
                    {children.map((item)=> {
                        return item
                    })}
                </ul>
            </li>
        );

    }
}

export { SidebarItem, SidebarContainer };
