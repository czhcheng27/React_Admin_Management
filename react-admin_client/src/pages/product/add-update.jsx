import React, { Component } from 'react'
import { Form, Input, Card, Upload, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';

import LinkButton from '../../components/link-button';

const Item = Form.Item
const TextArea = Input.TextArea

export default class AddUpdate extends Component {

    formRef = React.createRef();

    checkPrice = (rule, value) => {
        // console.log(value, typeof value);
        if (value * 1 >= 0) {
            return Promise.resolve()
        }
        return Promise.reject("Price must be greater than zero!")
    }

    submit = () => {
        this.formRef.current.validateFields()
            .then(() => {
                console.log('Success');
            })
            .catch(() => {
                console.log('Failed');
            })
    }
    render() {

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined onClick={() => this.props.history.goBack()} />
                </LinkButton>
                Add New Product
            </span>
        )
        return (
            <Card title={title}>
                <Form {...formItemLayout} ref={this.formRef}>
                    <Item
                        label='Name'
                        name='name'
                        rules={[
                            { required: true, message: "Please type your product name" }
                        ]}
                    >
                        <Input placeholder='Please type your product name' />
                    </Item>

                    <Item
                        label='Description'
                        name='desc'
                        rules={[
                            { required: true, message: "Please type your description" }
                        ]}
                    >
                        <TextArea placeholder='Please type description' />
                    </Item>

                    <Item
                        label='Price'
                        name='price'
                        rules={[
                            { required: true, message: "Please type your price" },
                            { validator: this.checkPrice }
                        ]}
                    >
                        <Input placeholder='Please type price' addonAfter="CAD" />
                    </Item>

                    <Item label='Category' >
                        <div>Category</div>
                    </Item>

                    <Item label='Pictures' >
                        <div>Pictures</div>
                    </Item>

                    <Item label='Details' >
                        <div>Details</div>
                    </Item>

                    <Item>
                        <Button type='primary' onClick={this.submit}>Submit</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}