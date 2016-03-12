/**
 * Created by gasya on 10.03.16.
 * DigitalOutlooks corporation.
 */


//TODO  refactor
import React, {Component} from 'react'

export default class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: [
                'rgb(12,222,132)',
                'rgb(0,92,59)',
                'rgb(20,152,122)',
                'rgb(25,171,100)',
                'rgb(1,146,89)',
                'rgb(2,167,57)',
                'rgb(25,171,91)',
                'rgb(2,133,86)',
                'rgb(0,110,35)'
            ],
            items: [1, 1, 1, 1, 1, 1, 5],
            radius: []
        };
    }

    getColor(i) {
        return this.state.colors[i % this.state.colors.length];
    }

    getValues(items) {
        var sum = items.reduce((prev, val) => prev += val, 0);
        var values = items.reduce((res, item)=> {
            let sector;
            sector = [res.prev, res.prev + item / sum * 360];
            res.prev = sector[1];
            res.arr.push(sector);
            return res;
        }, {arr: [], sum: sum, prev: 0});
        return values.arr;
    }

    render() {
        var values = this.getValues(this.state.items);
        var radius = this.state.radius || 100;
        var self = this;
        return (
            <div>
                <svg
                    width="100%"
                    height="400px"
                    viewBox="-15 -15 230 230"
                >
                    <g transform="translate(100,100)" strokeWidth="2" stroke="#fff">
                        {values.map(function (val, i) {
                            let xFrom, yFrom, xTo, yTo, sector;
                            radius = self.state.radius[i] || 100;
                            xFrom = Math.cos(val[0] / 180 * Math.PI) * radius;
                            yFrom = Math.sin(val[0] / 180 * Math.PI) * radius;
                            xTo = Math.cos(val[1] / 180 * Math.PI) * radius;
                            yTo = Math.sin(val[1] / 180 * Math.PI) * radius;
                            sector = val[1] - val[0];

                            return (
                                <path className="animated"
                                      d={`M 0 0 L ${xFrom} ${yFrom} A ${radius} ${radius} 0 ${+(sector>180)} 1 ${xTo} ${yTo} Z`}
                                      fill={self.getColor(i)} key={i}>
                                </path>
                            );
                        })}
                    </g>
                </svg>
            </div>
        );
    }
}

