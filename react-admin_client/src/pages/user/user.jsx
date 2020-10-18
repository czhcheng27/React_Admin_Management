import React, {Component} from 'react' 
import {Card, Table, Button, Modal, message} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {getDate} from '../../utils/dateUtlis'
import { reqUserList, reqDeleteUser } from '../../api'
import LinkButton from '../../components/link-button'

export default class User extends Component { 

    state = {
        users: [],
        isShow: false
    }

    initColumns = () => {
        this.columns = [
            {
                title:'Username',
                dataIndex:'username'
            },
            {
                title:'Email',
                dataIndex:'email'
            },
            {
                title:'Phone',
                dataIndex:'phone'
            },
            {
                title:'Create Time',
                dataIndex:'create_time',
                render: getDate
            },
            {
                title:'Role',
                dataIndex:'role_id'
            },
            {
                title:'Action',
                render: (user) => (
                    <span>
                        <LinkButton>Edit</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>Delete</LinkButton>
                    </span>
                )
            },
        ]
    }

    //delete user
    deleteUser = (user) => {
        Modal.confirm({
            title: 'Do you Want to delete ' + `${user.username} ?`,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
              const result = await reqDeleteUser(user._id)
              if(result.code===0){
                  message.success('Delete ' + `${user.username} success`)
                  this.getUsers()
              }else {
                  message.error('Delete ' + `${user.username} failed`)
              }
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    addUpdateUser = () => {

    }

    getUsers = async () => {
        const result = await reqUserList()
        if(result.code===0){
            this.setState({users: result.data})
        }else{
            console.log('getUsers()', result.msg);
        }
    }

    componentWillMount(){
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }
    render () { 

        const {users, isShow} = this.state

        const title = (
            <span>
                <Button type='primary' onClick = {() => this.setState({isShow: true})}>Create User</Button>
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
                title='Add User'
                visible={isShow}
                onOk={this.addUpdateUser}
                onCancel={() =>this.setState({isShow: false})}
                >
                    xxx
                </Modal>
            </Card>
        )
    }
}