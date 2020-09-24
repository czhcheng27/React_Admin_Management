import React from 'react' 
import {
    AppstoreOutlined,
    PieChartOutlined,
    ContainerOutlined,
    MailOutlined,
} from '@ant-design/icons';

const menuList = [
    {
        title: 'home', 
        key: '/home', // aka path
        icon: <PieChartOutlined />, // 
    },
    {
        title: 'Products',
        key: '/products',
        icon: <MailOutlined />,
        children: [ // submenu
            {
                title: 'Category Manage',
                key: '/category',
                icon: <AppstoreOutlined />
            },
            {
                title: 'Product Manage',
                key: '/product',
                icon: <ContainerOutlined />
            },
        ]
    },
    {
        title: 'User',
        key: '/user',
        icon: <PieChartOutlined />
    },
    {
        title: 'Role',
        key: '/role',
        icon: <ContainerOutlined />,
    },
    {
        title: 'Charts',
        key: '/charts',
        icon: <AppstoreOutlined />,
        children: [
            {
                title: 'Bar',
                key: '/charts/bar',
                icon: <PieChartOutlined />
            },
            {
                title: 'Line',
                key: '/charts/line',
                icon: <AppstoreOutlined />
            },
            {
                title: 'Pie',
                key: '/charts/pie',
                icon: <ContainerOutlined />
            },
        ]
    },
]
export default menuList