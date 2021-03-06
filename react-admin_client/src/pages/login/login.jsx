import React, { Component } from 'react'
import { Form, Button, Input, message} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';

import './login.less'
import {reqLogin} from '../../api/index'
import memoryUtlis from '../../utils/memoryUtlis'
import storageUtlis from '../../utils/storageUtlis'

export default class Login extends Component {

    onFinish = async(values) => {
        console.log('Received values of form: ', values);
        const result = await reqLogin(values)
        if(result.code===0){
            //save user to memory
            const user = result.data
            memoryUtlis.user = user
            //also need to save user to local
            storageUtlis.saveUser(user)
            message.success('request success');
            this.props.history.replace('/')
        }else{
            message.error('request failed');
        }
      };

      validatorPwd = (rule, value) => {
        //   console.log('validatorPwd', rule, value)
          return new Promise(async (resolve, reject) => {
            if (!value) {
                await reject('Please input your Password!')
            } else if (value.length < 4) {
                await reject('Password should at least 4 digits!')
            } else if (value.length > 12) {
                await reject('Password can\'t longer than 12 digits!')
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                await reject('Password can only consist of letter, number and _!')
            } else {
                await resolve()
            }
        })
      }

    render() {

        const user = memoryUtlis.user
        if(user && user._id){
            return <Redirect to='/' />
        }
        return (
            <div className='login'>

                <header className='login-header'>
                    <img src={require(`../../assets/images/logo.png`)} alt='logo' />
                    <h1>React Project: Admin Management System</h1>
                </header>

                <section className='login-content'>
                    <h1>User Login</h1>
                    {
                        /* 
                        username
                        1. must type in
                        2. longer than 4 digits
                        3. < 12
                        4. consist of letter, number and _
                        */
                    }
                    <Form
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    >
                        <Form.Item
                        name='username'
                        rules={[
                            { required: true, message: 'Please input your Username!' },
                            { max: 12, message: 'Username can\'t longer than 12 digits!' },
                            { min: 4, message: 'Username should at least 4 digits!' },
                            { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only consist of letter, number and _!' },
                        ]}
                        >
                        <Input 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Username" />
                        </Form.Item>

                        <Form.Item
                        name='password'
                        rules={[{ validator: this.validatorPwd }]}
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