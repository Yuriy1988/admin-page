import React from 'react'

const payList = React.createClass({
  render() {
    return (
        <div className="row">
          <div className="col-xs-12">
              <div className="box">
                  <div className="box-header">
                      <h3 className="box-title" x-translate>Список платежных систем</h3>
                      <div className="pull-right box-tools">
                          <a className="btn btn-success btn-sm"><i className="fa fa-plus"></i></a>
                      </div>
                  </div>
                  <div className="box-body no-padding">
                      <table className="table table-condensed">
                        <tbody>
                          <tr>
                              <th className="text-center" style={{width:"15px"}}>#</th>
                              <th>Название</th>
                              <th>Активность</th>
                              <th className="text-center" style={{width:"200px"}}>Операции</th>
                          </tr>
                          <tr>
                              <td className="text-center">№1</td>
                              <td>
                                 <b>VISA</b>
                              </td>
                              <th>
                                 <span>
                                    <span className="badge alert-success">Да </span>
                                    <span className="badge alert-danger" >Нет</span>
                                 </span>
                              </th>
                              <td className="text-center">
                                  <a className="btn btn-primary btn-xs">Изменить</a>
                                  <a className="btn btn-danger btn-xs">Удалить</a>
                              </td>
                          </tr>
                          <tr>
                              <td className="text-center">№2</td>
                              <td>
                                 <b>MasterCard</b>
                              </td>
                              <th>
                                 <span>
                                    <span className="badge alert-success">Да </span>
                                    <span className="badge alert-danger" >Нет</span>
                                 </span>
                              </th>
                              <td className="text-center">
                                  <a className="btn btn-primary btn-xs">Изменить</a>
                                  <a className="btn btn-danger btn-xs">Удалить</a>
                              </td>
                          </tr>
                        </tbody>
                      </table>
                  </div>
                 <div className="box-footer clearfix">
                      <ul className="pagination pagination-sm no-margin pull-right">
                          <li><a href="#">«</a></li>
                          <li className="active"><a href="#">1</a></li>
                          <li><a href="#">»</a></li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
    )
  }
})

export default payList