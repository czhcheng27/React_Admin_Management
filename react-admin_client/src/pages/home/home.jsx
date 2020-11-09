/* import React, {Component} from 'react' 

import './index.less'

export default class Home extends Component { 
    render () { 
        return ( 
            <div className='home'>Welcome to React Admin System Project</div>
        )
    }
} */

import React, { Component } from 'react'
import { Card, DatePicker, Statistic, Timeline, Icon } from 'antd'
import moment from 'moment'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

import './index.less'
import HomeLine from './homeline'
import Bar from './bar'

const dateFormat = 'YYYY/MM/DD'
const { RangePicker } = DatePicker

export default class Home extends Component {

    state = {
        isVisited: true
    }

    handleChange = (isVisited) => {
        return () => this.setState({ isVisited })
    }

    render() {
        const { isVisited } = this.state

        return (
            <div className='home'>
                <Card title="Total Product" className='home-card'>
                    <Statistic
                        value={1128163}
                        suffix="pcs"
                        style={{ fontWeight: 'bolder' }}
                    />
                    <Statistic
                        value={15}
                        valueStyle={{ fontSize: 15 }}
                        prefix={'Year-Over-Year'}
                        suffix={<div>%<ArrowUpOutlined style={{ color: 'red', marginLeft: 10 }} /></div>}
                    />
                    <Statistic
                        value={10}
                        valueStyle={{ fontSize: 15 }}
                        prefix={'Month-Over-Month'}
                        suffix={<div>%<ArrowDownOutlined style={{ color: 'green', marginLeft: 10 }} /></div>}
                    />
                </Card>

                <HomeLine />

                <Card
                    className="home-content"
                    title={<div className="home-menu">
                        <span className={isVisited ? "home-menu-active home-menu-visited" : 'home-menu-visited'}
                            onClick={this.handleChange(true)}>Page View</span>
                        <span className={isVisited ? "" : 'home-menu-active'} onClick={this.handleChange(false)}>Sales</span>
                    </div>}
                    extra={<RangePicker
                        defaultValue={[moment('2019/01/01', dateFormat), moment('2019/06/01', dateFormat)]}
                        format={dateFormat}
                    />}
                >
                    <Card
                        className="home-table-left"
                        title={isVisited ? '访问趋势' : '销售趋势'}
                        bodyStyle={{ padding: 0, height: 275 }}
                        extra={<Icon type="reload" />}
                    >
                        <Bar />
                    </Card>

                    <Card title='任务' extra={<Icon type="reload" />} className="home-table-right">
                        <Timeline>
                            <Timeline.Item color="green">Update New Version</Timeline.Item>
                            <Timeline.Item color="green">Finish Web Design</Timeline.Item>
                            <Timeline.Item color="red">
                                <p>API</p>
                                <p>Function Validation</p>
                            </Timeline.Item>
                            <Timeline.Item>
                                <p>Design Login Function</p>
                                <p>Validate</p>
                                <p>Page Design</p>
                            </Timeline.Item>
                        </Timeline>
                    </Card>
                </Card>
            </div>
        )
    }
}