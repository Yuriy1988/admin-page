import React, { Component } from 'react'

export const TYPE_ERROR = 'danger';
export const TYPE_INFO = 'info';
export const TYPE_WARNING = 'warning';
export const TYPE_SUCCESS = 'success';

const config = {
    defaultType: TYPE_INFO,
    icon: {
        [TYPE_ERROR]: 'fa-ban',
        [TYPE_INFO]: 'fa-info',
        [TYPE_WARNING]: 'fa-warning',
        [TYPE_SUCCESS]: 'fa-check'
    },
    alert: {
        [TYPE_ERROR]: 'alert-danger',
        [TYPE_INFO]: 'alert-info',
        [TYPE_WARNING]: 'alert-warning',
        [TYPE_SUCCESS]: 'alert-success'
    },
    title: {
        [TYPE_ERROR]: 'Error!',
        [TYPE_INFO]: 'Information',
        [TYPE_WARNING]: 'Warning!',
        [TYPE_SUCCESS]: 'Success'
    }
};


export default class Alert extends Component {
    render() {
        const { children, type = config.defaultType } = this.props;
        const { title = config.title[type] } = this.props;

        return (
            <div className={`alert ${config.alert[type]} alert-dismissible`}>
                <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                <h4><i className={`icon fa ${config.icon[type]}`}/> {title}</h4>
                {children}
            </div>
        );
    }
}
