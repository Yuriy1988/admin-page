import React from 'react'
import { Link } from 'react-router';

const Login = React.createClass({
  render() {
    return (
					<section className="content">
						<div className="alert alert-info">
   							<span>Login</span>: test<br/>
   							<span>Password</span>: test
						</div>
						<div className="alert alert-danger hidden"></div>
						<form name="form">
						    <div className="form-group">
						      <label className="move-icon" forName="username" >Login</label>
						      <i className="fa fa-key"></i>
						      <input type="text" name="username" id="username" className="form-control"/>
						      <span>Login required</span>
						    </div>
						    <div className="form-group">
						      <label className="move-icon" forName="password">Password</label>
						      <i className="fa fa-lock"></i>
						      <input type="password" name="password" id="password" className="form-control"/>
						      <span className="help-block">Password required</span>
						    </div>
						    <div className="form-actions">
      							<button type="submit" className="btn btn-danger" disabled="disabled">Enter</button>
   							</div>
						</form>
					</section>
    )
  }
})

export default Login