import React, { Component } from 'react'
import { Button, Card, Table, Icon } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

const dataSource = [
    {
        "parentId": "0",
        "_id": "5f728b8ba99350321cc3006d",
        "name": "abc",
        "__v": 0
    },
    {
        "parentId": "0",
        "_id": "5f728c1aa99350321cc3006e",
        "name": "computer",
        "__v": 0
    },
    {
        "parentId": "0",
        "_id": "5f728c23a99350321cc3006f",
        "name": "keyboard",
        "__v": 0
    },
    {
        "parentId": "0",
        "_id": "5f728c2ca99350321cc30070",
        "name": "cellphone",
        "__v": 0
    }
]

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        width: 300,
        render: () => (
            <span>
                <a>Modify</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a>Check SubCategory</a>
            </span>
        ),
    },
];

export default class Category extends Component {
    render() {
        return (
            <Card
                title="First Level List"
                bordered={false}
                extra={<Button type='primary'><PlusOutlined />Add</Button>} >
                <Table 
                dataSource={dataSource} 
                columns={columns} 
                bordered 
                rowKey='_id'
                />
            </Card>
        )
    }
}