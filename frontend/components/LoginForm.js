import React, { Component, PropTypes } from 'react'

export default class LoginForm extends Component {

    render() {
        return (
            <form name="form" role="form">
                <div className="form-group">
                    <label htmlFor="username">Login&nbsp;</label>
                    <i className="fa fa-key"/>
                    <input type="text" name="username" id="username" className="form-control"/>
                    <span className="help-block">Login required</span>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password&nbsp;</label>
                    <i className="fa fa-lock"/>
                    <input type="password" name="password" id="password" className="form-control"/>
                    <span className="help-block">Password required</span>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-danger">Enter</button>

                </div>
            </form>
        )
    }
}
