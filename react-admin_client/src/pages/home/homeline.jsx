import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Chart, Line, Point, Tooltip } from 'bizcharts';

const data = [
    {
        month: "Jan",
        city: "a",
        temperature: 7000
    },
    {
        month: "Jan",
        city: "b",
        temperature: 3900
    },
    {
        month: "Feb",
        city: "a",
        temperature: 6900
    },
    {
        month: "Feb",
        city: "b",
        temperature: 4200
    },
    {
        month: "Mar",
        city: "a",
        temperature: 9500
    },
    {
        month: "Mar",
        city: "b",
        temperature: 5700
    },
    {
        month: "Apr",
        city: "a",
        temperature: 14500
    },
    {
        month: "Apr",
        city: "b",
        temperature: 8500
    },
    {
        month: "May",
        city: "a",
        temperature: 18400
    },
    {
        month: "May",
        city: "b",
        temperature: 11900
    },
    {
        month: "Jun",
        city: "a",
        temperature: 21500
    },
    {
        month: "Jun",
        city: "b",
        temperature: 15200
    },
    {
        month: "Jul",
        city: "a",
        temperature: 25200
    },
    {
        month: "Jul",
        city: "b",
        temperature: 17000
    },
    {
        month: "Aug",
        city: "a",
        temperature: 26500
    },
    {
        month: "Aug",
        city: "b",
        temperature: 16600
    },
    {
        month: "Sep",
        city: "a",
        temperature: 23300
    },
    {
        month: "Sep",
        city: "b",
        temperature: 14200
    },
    {
        month: "Oct",
        city: "a",
        temperature: 18300
    },
    {
        month: "Oct",
        city: "b",
        temperature: 10300
    },
    {
        month: "Nov",
        city: "a",
        temperature: 13900
    },
    {
        month: "Nov",
        city: "b",
        temperature: 6600
    },
    {
        month: "Dec",
        city: "a",
        temperature: 9600
    },
    {
        month: "Dec",
        city: "b",
        temperature: 4800
    }
];

export default class HomeLine extends Component {
    render() {
        return (
            <div style={{float: 'right', width: 750, height: 300}}>
                <Chart scale={{ temperature: { min: 0 } }} padding={[30, 20, 50, 40]} autoFit height={250} data={data} interactions={['element-active']}>
                    <Line shape="smooth" position="month*temperature" color="city" label="temperature" />
                    <Point position="month*temperature" color="city" />
                    <Tooltip shared showCrosshairs />
                </Chart>
            </div>
        )
    }
}