import React from 'react'

const AddAdmin = React.createClass({
  render() {
    return (
    	
				<div className="row">
    			<div className="col-xs-12">
        		<div className="box">
            	<div className="box-header">
            		</div>
            			<div className="box-body">
                		<div className="row">
                    	<div className="col-xs-4">
                        <div>
                            <label forName="login">Фамилия</label>
                            <input type="text" id="lastName" className="form-control" placeholder="Введите фамилию" />
                        </div>
                    </div>
                    <div className="col-xs-4">
                        <div>
                            <label forName="login">Имя</label>
                            <input type="text" id="firstName" className="form-control" placeholder="Введите имя" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-4">
                        <div>
                            <br/>
                            <input type="checkbox" id="activity" />
                            <label forName="activity" >Активность</label>
                        </div>
                    </div>
                </div>
                <div className="row">
                  <hr/>
                </div>
            </div>
            <div className="box-footer clearfix">
                <div className="pull-right">
                    <button className="btn btn-success">Сохранить</button>
                </div>
            </div>
        	</div>
    		</div>
			</div>

    )
  }
})

export default AddAdmin