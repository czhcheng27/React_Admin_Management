import React, { Component } from 'react'
import { Card, Button, Table, message, Form, Input } from 'antd'
import { reqAddRole, reqRoleList, reqUpdateRole } from '../../api'
import { getDate } from '../../utils/dateUtlis'
import Modal from 'antd/lib/modal/Modal'
import AddForm from './add-form'
import AuthForm from './auth-form'
import '../../utils/memoryUtlis'
import memoryUtlis from '../../utils/memoryUtlis'
import storageUtlis from '../../utils/storageUtlis'

const Item = Form.Item

export default class Role extends Component {

    formRef2 = React.createRef();

    state = {
        roles: [],//list for all roles
        role: {}, //the selected role
        isShowAdd: 0, //0: hide, 1: show
        isShowAuth: 0
    }

    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title: 'Role',
                dataIndex: 'name'
            },
            {
                title: 'Create Time',
                dataIndex: 'create_time',
                render: getDate
            },
            {
                title: 'Authorized Time',
                dataIndex: 'auth_time',
                render: getDate
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

    //show update modal
    showUpdate = () => {
        this.setState({ isShowAuth: 1 })
        setTimeout(() => {
            this.formRef2.current.setFieldsValue({ roleName: this.state.role.name });
        }, 100)
    }

    //update role
    updateRole = () => {

        this.setState({ isShowAuth: 0 })
        let menus = this.auth.current.getMenus()
        this.menus = menus
        // console.log('menus', menus);

        this.formRef2.current.validateFields()
            .then(async(values) => {
                // console.log('values', values);

                const { role } = this.state
                role.menus = this.menus
                // console.log('role.menus', role.menus);
                role.name = values.roleName
                role.auth_name = memoryUtlis.user.username
                // console.log('role', role);
                const result = await reqUpdateRole(role)
                if (result.code === 0) {
                   
                    //if update yourself role, need to force to logout and relogin
                    if(memoryUtlis.user.role_id = role._id){
                        memoryUtlis.user = {}
                        storageUtlis.removeUser()
                        this.props.history.replace('/login')
                        message.success('Current user\'s Role has been revised, please log in')
                    }
                    message.success('Update Role Success')
                    this.getRoleList()
                } else {
                    message.error("Update Role Failed")
                }

            })
            .catch(err => {
                message.error("Update Role Failed")
            })
    }

    handleCancel = () => {
        this.formRef.current.resetFields()
        this.setState({ isShowAdd: 0, isShowAuth: 0 })
    }

    componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getRoleList()
    }

    render() {

        const { roles, role, isShowAdd, isShowAuth } = this.state

        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({ isShowAdd: 1 })}>Create Role</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.showUpdate()}>Set up Authorization</Button>
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
                        rowSelection={{ 
                            type: "radio", 
                            selectedRowKeys: [role._id],
                            onSelect: (role) => {
                                this.setState({role})
                            }
                        }}
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

                <Modal
                    title='Set up Authorization'
                    visible={isShowAuth === 1 ? true : false}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({ isShowAuth: 0 })
                    }}
                >
                    <Form ref={this.formRef2}>
                        <Item label='Role Name' name='roleName'>
                            <Input />
                        </Item>
                    </Form>
                    <AuthForm role={role} ref={this.auth} />
                </Modal>
            </div>
        )
    }
}