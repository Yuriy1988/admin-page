import React from 'react';
import {Pie} from 'react-chartjs-2';

const data = {
    labels: [
        'USD',
        'EUR',
        'UAH'
    ],
    datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
            'rgb(12,222,132)',
            'rgb(0,92,59)',
            'rgb(20,152,122)'
        ],
        hoverBackgroundColor: [
            'rgb(12,222,132)',
            'rgb(0,92,59)',
            'rgb(20,152,122)'
        ]
    }]
};

export default React.createClass({

    render() {
        return <Pie data={data} />
    }
});
