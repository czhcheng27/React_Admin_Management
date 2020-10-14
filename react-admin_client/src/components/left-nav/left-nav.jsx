import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd'

import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'

const { SubMenu } = Menu;

class LeftNav extends Component {

    getMenuNode = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map(menu => {
            if (!menu.children) {
                /*  <Menu.Item key="/home" icon={<PieChartOutlined />}>
                    <Link to='/home'>Home</Link>
                </Menu.Item>  */
                return (
                    <Menu.Item key={menu.key} icon={menu.icon}>
                        <Link to={menu.key}>{menu.title}</Link>
                    </Menu.Item>
                )
            } else {
                /* <SubMenu key="sub1" icon={<MailOutlined />} title="Products">
                    <Menu.Item key="/category" icon={<AppstoreOutlined />}>
                        <Link to='/category'>Category Manage</Link>
                    </Menu.Item>
                    <Menu.Item key="/product" icon={<ContainerOutlined />}>
                        <Link to='/product'>Product Manage</Link>
                    </Menu.Item>
                </SubMenu> */
                let openKey = menu.children.find(childItem => path.indexOf(childItem.key) === 0)
                if (openKey) {
                    this.openKey = menu.key
                }

                return (
                    <SubMenu key={menu.key} icon={menu.icon} title={menu.title}>
                        {this.getMenuNode(menu.children)}
                    </SubMenu>
                )
            }
        })
    }

    componentWillMount() {
        this.menu = this.getMenuNode(menuList)
    }
    render() {

        let path = this.props.location.pathname

        if (path.indexOf('/product') === 0) {
            path = '/product'
        }


        const openKey = this.openKey
        return (
            <div className='left-nav'>

                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt='logo' />
                    <h1>Admin System</h1>
                </Link>

                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >

                    {
                        this.menu
                    }

                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav)