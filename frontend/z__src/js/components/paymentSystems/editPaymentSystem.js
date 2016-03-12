import React from 'react'

const editPaySys = React.createClass({
  render() {
    return (
        <div className="row">
          <div className="col-xs-12">
            <div className="box">
            <div className="box-header">
                <h3 className="box-title">Создание платежной системы</h3>
                <h3 className="box-title">Редактирование платежной системы</h3>
                <input type="text" placeholder="Введите название" className="pull-right"/>
                <b className="pull-right">Card Name</b>
            </div>
            <div className="box-body">
                <label forName="number">Номер карты/аккаунта (логин)</label>
                <span>
                    <small className="text-danger pull-right tooltip-wide">
                       <span>
                          [?]
                       </span>
                    </small>
                </span>
                <div className="has-error form-group">
                    <input type="text" className="form-control" id="number" placeholder="Введите номер карты/аккаунта"/>
                </div>
                <label forName="password">Пароль</label>
                <span>
                    <small className="text-danger pull-right tooltip-wide">
                       <span>
                          [?]
                       </span>
                    </small>
                </span>
                <div className="has-error form-group">
                    <input type="password" className="form-control" id="password" placeholder="Введите пароль"/>
                </div>
                <div className="checkbox">
                    <label>
                       <input type="checkbox"/>
                       <span>Активность</span>
                    </label>
                </div>
            </div>
            <div className="box-footer clearfix">
                <div className="pull-right">
                    <button className="btn btn-success">Сохранить</button>
                    <a className="btn btn-default">Отмена</a>
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default editPaySys