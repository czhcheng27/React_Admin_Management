import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtlis'
import LeftNav from '../../components/left-nav/left-nav'
import Header from '../../components/header/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Pie from '../charts/pie'
import Line from '../charts/line'
import Bar from '../charts/bar'

const {Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        if (!user || !user._id) {
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{height:'100%'}}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{backgroundColor:'#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/category' component={Category} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Welcome, develop by Zihang Cheng</Footer>
                </Layout>
            </Layout>
        )
    }
}