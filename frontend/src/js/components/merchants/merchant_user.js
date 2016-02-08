import React from 'react'

const MerchantUser = React.createClass({
  render() {
    return (
    		<div className="tab-content no-padding">
    			<table className="table table-condensed">
    				<tbody>
    					<tr>
        				<th className="text-center" style={{width:'15px'}}>#</th>
        				<th>Login</th>
        				<th>Name</th>
        				<th>Surname</th>
        				<th>Enabled</th>
        				<th className="text-center" style={{width:'300px'}}>Operations</th>
    					</tr>
    					<tr>
        				<td className="text-center">1.</td>
        				<td>
            			<span>
                		<span>
                  	<span>
                      <i className="glyphicon glyphicon-envelope"></i>&nbsp;
                      <a href="mailto:ivanov@gmail.com">ivanov@gmail.com</a>
                  	</span>
                		</span>
            			</span>
        				</td>
        				<td>
            			Лозинский
        				</td>
        				<td>
            			Юрий
        				</td>
        				<td>
            			<span>
               			<span className="badge alert-success">Yes</span>
            			</span>
        				</td>
        				<td className="text-center">
            			<a className="btn btn-primary btn-xs" href="#/merchant/1/23/edit">Modify</a>
            			<a className="btn btn-danger btn-xs">Delete</a>
        				</td>
    					</tr>
					</tbody>
				</table>
			</div>
    )
  }
})

export default MerchantUser

//20 <!-- ngRepeat: user in users -->
//21 <!-- ngIf: user.userName -->
//22 <!-- ngSwitchWhen: true -->
//23 <!-- end ngSwitchWhen: -->
//24 <!-- ngSwitchWhen: false -->
//26 <!-- end ngIf: user.userName -->
//36 <!-- end ngSwitchWhen: -->
//36 <!-- ngSwitchWhen: true -->
//37                <!-- ngSwitchWhen: false -->
//44 <!-- end ngRepeat: user in users -->
