import React, { Component } from 'react'
import { Card, Button, Table, message } from 'antd'
import { reqAddRole, reqRoleList } from '../../api'
import Modal from 'antd/lib/modal/Modal'
import AddForm from './add-form'

export default class Role extends Component {

    state = {
        roles: [],//list for all roles
        role: {}, //the selected role
        isShowAdd: 0, //0: hide, 1: show
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

    getRoleList = async () => {
        const result = await reqRoleList()
        if (result.code === 0) {
            this.setState({ roles: result.data })
        } else {
            message.error('Get role list failed, please try again')
        }
    }

    onRow = (role) => {
        return {
            onClick: event => {
                // console.log('sss', roles);
                this.setState({ role })
            }
        }
    }

    addRole = () => {

        //validate form
        this.formRef.current.validateFields()
            .then(async (values) => {
                //collect data, clear form, send api request
                const { roleName } = values
                this.formRef.current.resetFields()
                const result = await reqAddRole(roleName)
                if (result.code === 0) {
                    message.success('Add role success')
                    //hide modal
                    this.setState({ isShowAdd: 0 })
                    //get new role, and generate new list
                    const role = result.data
                    this.setState((state) => ({
                        roles: [...state.roles, role]
                    }))
                }
            })
            .catch(() => {
                message.error('Add role failed')
            })




    }

    handleCancel = () => {
        this.formRef.current.resetFields()
        this.setState({ isShowAdd: 0 })
    }

    componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getRoleList()
    }

    render() {

        const { roles, role, isShowAdd } = this.state

        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({ isShowAdd: 1 })}>Create Role</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id}>Set Role Permissions</Button>
            </span>
        )

        return (
            <div>
                <Card title={title}>
                    <Table
                        rowKey='_id'
                        bordered
                        dataSource={roles}
                        columns={this.columns}
                        pagination={{ defaultPageSize: 5 }}
                        rowSelection={{ type: "radio", selectedRowKeys: [role._id] }}
                        onRow={this.onRow}
                    />
                </Card>

                <Modal
                    title='Add Role'
                    visible={isShowAdd === 1 ? true : false}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        setForm={(formRef) => this.formRef = formRef}
                    />
                </Modal>
            </div>
        )
    }
}