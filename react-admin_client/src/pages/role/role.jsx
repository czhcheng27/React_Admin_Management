import React, { Component } from 'react'
import { Card, Button, Table } from 'antd'

export default class Role extends Component {

    state = {
        roles: [
            {
                "menus": [],
                "_id": "5f87b342172e3045d4b47d2f",
                "name": "Manager",
                "create_time": 1602728770173,
                "__v": 0
            },
            {
                "menus": [],
                "_id": "5f87b399172e3045d4b47d30",
                "name": "Sales",
                "create_time": 1602728857603,
                "__v": 0
            },
            {
                "menus": [],
                "_id": "5f87b3cb172e3045d4b47d31",
                "name": "Tech Support",
                "create_time": 1602728907017,
                "__v": 0
            }
        ]
    }

    initColumn = () => {
        this.columns = [
            {
                title: 'Role',
                dataIndex: 'name'
            },
            {
                title: 'Create Time',
                dataIndex: 'create_time'
            },
            {
                title: 'Authorized Time',
                dataIndex: 'auth_time'
            },
            {
                title: 'Authorized Person',
                dataIndex: 'auth_name'
            },
        ]
    }

    onRow = (roles) => {
        return {
            onClick: event => {
                console.log('sss', roles);
            }
        }
    }

    componentWillMount() {
        this.initColumn()
    }

    render() {

        const { roles } = this.state

        const title = (
            <span>
                <Button type='primary'>Create Role</Button>&nbsp;&nbsp;
                <Button type='primary'>Set Role Permissions</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    rowKey='_id'
                    bordered
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 5 }}
                    rowSelection={{ type: "radio" }}
                    onRow={this.onRow}
                />
            </Card>
        )
    }
}