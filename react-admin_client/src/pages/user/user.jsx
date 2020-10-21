import React, { Component } from 'react'
import { Card, Table, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { getDate } from '../../utils/dateUtlis'
import { reqUserList, reqDeleteUser, reqRoleList, reqAddOrUpdateUser } from '../../api'
import LinkButton from '../../components/link-button'
import UserForm from './user-form';

export default class User extends Component {

    state = {
        users: [],
        roles: [],
        isShow: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: 'Username',
                dataIndex: 'username'
            },
            {
                title: 'Email',
                dataIndex: 'email'
            },
            {
                title: 'Phone',
                dataIndex: 'phone'
            },
            {
                title: 'Create Time',
                dataIndex: 'create_time',
                render: getDate
            },
            {
                title: 'Role',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
                // render: (role_id) => this.state.roles.find( role => role._id === role_id).name
            },
            {
                title: 'Action',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>Edit</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>Delete</LinkButton>
                    </span>
                )
            },
        ]
    }

    //show update
    showUpdate = (user) => {
        this.user = user
        this.setState({ isShow: true })
    }

    showAdd = () => {
        this.user = null
        this.setState({ isShow: true })
    }

    //delete user
    deleteUser = (user) => {
        Modal.confirm({
            title: `Do you Want to delete ${user.username} ?`,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.code === 0) {
                    message.success(`Delete ${user.username} success`)
                    this.getUsers()
                } else {
                    message.error(`Delete ${user.username} failed`)
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    addUpdateUser = async () => {

        this.setState({ isShow: false })
        //collect data
        const user = this.formRef.current.getFieldsValue()
        this.formRef.current.validateFields()
            .then(() => this.formRef.current.resetFields())

        if (this.user) {
            user._id = this.user._id
        }

        //send api request
        const result = await reqAddOrUpdateUser(user)

        //update show list
        if (result.code === 0) {
            message.success(`${this.user ? 'Update' : 'Add'} user success`)
            this.getUsers()
        } else {
            message.error('Add user failed')
        }
    }

    getUsers = async () => {
        const result = await reqUserList()
        if (result.code === 0) {
            this.setState({ users: result.data })
        } else {
            console.log('getUsers()', result.msg);
        }
    }

    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }

    getRoles = async () => {
        const result = await reqRoleList()
        if (result.code === 0) {
            this.setState({ roles: result.data })
            this.initRoleNames(result.data)

        } else {
            console.log('failed');
        }
    }

    componentWillMount() {
        this.initColumns()
        this.getRoles()
    }

    componentDidMount() {
        this.getUsers()
    }
    render() {

        const { users, isShow, roles } = this.state

        const user = this.user || {}

        const title = (
            <span>
                <Button type='primary' onClick={() => this.showAdd()}>Create User</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    rowKey="_id"
                    dataSource={users}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                />

                <Modal
                    title={user._id ? 'Edit User' : 'Add User'}
                    visible={isShow}
                    onOk={this.addUpdateUser}
                    onCancel={() => this.setState({ isShow: false })}
                    destroyOnClose={true}
                >
                    <UserForm
                        roles={roles}
                        setForm={(formRef) => this.formRef = formRef}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}