import React, { Component } from 'react'
import { Form, Button, Input} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './login.less'

export default class Login extends Component {

    onFinish = (values) => {
        console.log('Received values of form: ', values);
      };

    render() {
        return (
            <div className='login'>

                <header className='login-header'>
                    <img src={require(`./images/logo.png`)} alt='logo' />
                    <h1>React Project: Admin Management System</h1>
                </header>

                <section className='login-content'>
                    <h1>User Login</h1>
                    <Form
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    >
                        <Form.Item
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                        <Input 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Username" />
                        </Form.Item>

                        <Form.Item
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                        <Input.Password
                        className='password'
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in</Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}