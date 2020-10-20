import React, { Component } from 'react'
import { Input, Select, Form } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

export default class UserForm extends Component {

    formRef = React.createRef();

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    componentWillMount() {
        this.props.setForm(this.formRef)
    }

    render() {

        const { roles, user } = this.props

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 15 },
        };

        const prefixSelector = (
            <Form.Item name="prefix" noStyle>
                <Select
                    style={{
                        width: 70,
                    }}
                >
                    <Option value="1">+1</Option>
                    <Option value="86">+86</Option>
                </Select>
            </Form.Item>
        );

        return (
            <Form {...formItemLayout} ref={this.formRef} initialValues={{ prefix: '1' }}>
                <Item
                    label='Username'
                    name='username'
                    initialValue={user.username}
                    rules={[
                        { required: true, message: 'Username must be given' },
                        { min: 4, message: 'Username should be at least 4 digits' },
                        { max: 12, message: 'Username should no more than 12 digits' },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only consist of letter, number and _' }
                    ]}
                >
                    <Input placeholder='Please type in username' />
                </Item>

                {
                    user._id? null : <Item
                    label='Password'
                    name='password'
                    rules={[
                        { required: true, message: 'Password must be given' },
                        { min: 4, message: 'Password should be at least 4 digits' },
                        { max: 12, message: 'Password should no more than 12 digits' },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: 'Password can only consist of letter, number and _' }
                    ]}
                >
                    <Input type='password' placeholder='Please type in username' />
                </Item>
                }
                

                <Item
                    label='Phone'
                    name='phone'
                    initialValue={user.phone}
                    rules={[
                        { len: 10, message: 'Phone number format is incorrect' },
                        {
                            pattern: /^[^\s]*$/,
                            message: 'Whitespace is not allowed',
                        }
                    ]}
                >
                    <Input addonBefore={prefixSelector} placeholder='Please type in phone number' />
                </Item>

                <Item
                    label='Email'
                    name='email'
                    initialValue={user.email}
                >
                    <Input placeholder='Please type in email' />
                </Item>

                <Item
                    label='Role'
                    name='role_id'
                    initialValue={user.role_id}
                    rules={[
                        { required: true, message: 'Role must be selected' }
                    ]}
                >
                    <Select placeholder='Please select a role'>
                        {
                            roles.map(role => (
                                <Option key={role._id} value={role._id}>{role.name}</Option>
                            ))
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}