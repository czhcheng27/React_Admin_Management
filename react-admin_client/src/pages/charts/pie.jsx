import React, { Component } from 'react'
import { Button, Card } from 'antd'
import ReactEcharts from 'echarts-for-react';

export default class Pie extends Component {

    getOption = () => {
        return {
            backgroundColor: '#2c343c',

            title: {
                text: 'Customized Pie',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#ccc'
                }
            },

            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },

            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [
                        { value: 335, name: 'Direct Visit' },
                        { value: 310, name: 'Email AD' },
                        { value: 274, name: 'League AD' },
                        { value: 235, name: 'Video AD' },
                        { value: 400, name: 'Search Engine' }
                    ].sort(function (a, b) { return a.value - b.value; }),
                    roseType: 'radius',
                    label: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    labelLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    },
                    itemStyle: {
                        color: '#c23531',
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },

                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        }
    }

    getOption2 = () => {
        return {
            title: {
                text: 'Source of user visits to a site',
                subtext: 'Purely fictitious',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['Direct Visit', 'Email AD', 'League AD', 'Video AD', 'Search Engine']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 335, name: 'Direct Visit'},
                        {value: 310, name: 'Email AD'},
                        {value: 234, name: 'League AD'},
                        {value: 135, name: 'Video AD'},
                        {value: 1548, name: 'Search Engine'}
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
    }

    render() {
        return (
            <div>
                <Card>
                    <Button type='primary'>Update</Button>
                </Card>

                <Card title="Pie Image 1">
                    <ReactEcharts option={this.getOption()} />
                </Card>

                <Card title="Pie Image 2">
                    <ReactEcharts option={this.getOption2()} />
                </Card>
            </div>
        )
    }
}