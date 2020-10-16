import React, {Component} from 'react' 
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

export default class AddForm extends Component { 

    formRef = React.createRef();

    static propTypes = {
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.setForm(this.formRef)
    }

    render () { 

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 15 },
        };

        return ( 
            <Form {...formItemLayout} ref={this.formRef}>
                <Item
                label='Role Name:'
                name='roleName'
                rules={[
                    {required: true, message:'Role name must be given'},
                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Role name can only consist of letter, number and _' }
                ]}
                >
                    <Input placeholder='Please input role name' />
                </Item>
            </Form>
        )
    }
}