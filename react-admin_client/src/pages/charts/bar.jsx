import React, {Component} from 'react' 
import {Button, Card} from 'antd'
import ReactEcharts from 'echarts-for-react';

export default class Bar extends Component { 
    
    state = {
        sales:[5, 20, 36, 10, 10, 20],
        stock:[15, 23, 33, 1, 15, 10]
    }

    getOption = (sales, stock) => {

        return {
            title: {
                text: 'ECharts entry example'
            },
            tooltip: {},
            legend: {
                data:['Sales', 'Stock']
            },
            xAxis: {
                data: ["shirt","cardign","chiffon shirt","pants","heels","socks"]
            },
            yAxis: {},
            series: [{
                name: 'Sales',
                type: 'bar',
                data: sales
            },{
                name: 'Stock',
                type: 'bar',
                data: stock
            }]
        };

    }

    render () { 

        const {sales, stock} = this.state
        return ( 
            <div>
                <Card>
                    <Button type='primary'>Update</Button>
                </Card>

                <Card title="Bar Image">
                    <ReactEcharts option={this.getOption(sales, stock)} />
                </Card>
            </div>
        )
    }
}