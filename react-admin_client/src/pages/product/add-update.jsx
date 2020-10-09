import React, { Component } from 'react'
import { Form, Input, Card, Upload, Button, Cascader } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';

import { reqCategoryList } from '../../api/index'
import LinkButton from '../../components/link-button';

const Item = Form.Item
const TextArea = Input.TextArea

export default class AddUpdate extends Component {

    formRef = React.createRef();

    state = {
        options: [],
    }

    initOptions = (categorys) => {
        let categoryOption = categorys.map(async c => {
            // console.log(c)
            let subResult = await reqCategoryList(c._id)
            let subC = subResult.data
            // console.log(subC);
            if (subC && subC.length > 0) {
                return ({
                    value: c._id,
                    label: c.name,
                    isLeaf: false,
                })

            } else {
                return ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true
                })
            }
        }
        )

        // console.log(categoryOption);
        let newArry = []
        categoryOption.map(c => {

            c.then(values => {
                // console.log(values);

                newArry.push({
                    value: values.value,
                    label: values.label,
                    isLeaf: values.isLeaf,
                })
                // console.log(newArry);
            })
        })
        // console.log(newArry);
        this.setState({ options: newArry })

    }

    //use one function get both 1st nad 2nd level category list
    getCategory = async (parentId) => {
        const result = await reqCategoryList(parentId) //{code:0, data:[]}
        if (parentId === '0') { // 1st level list
            this.initOptions(result.data)
        } else { // 2nd level list
            return result.data //this is subCategorys
        }
    }

    onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
    };

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        // console.log(targetOption);

        let subCategorys = await this.getCategory(targetOption.value)

        targetOption.loading = false;

        if (subCategorys && subCategorys.length > 0) {
            let childCategory = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))

            targetOption.children = childCategory
        } else {
            targetOption.isLeaf = true
        }

        this.setState({
            options: [...this.state.options],
        });
    }

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

    /* testSubname = async (parentId) => {
        const result = await reqCategoryList(parentId)
        let categorys = result.data
        categorys.map(async c => {
 
            let subResult = await reqCategoryList(c._id)
            let subCat = subResult.data
            if(subCat){
                this.setState({leaf: false})
            } else{
                this.setState({leaf: true})
            }
 
            
        })
    }
 
    componentWillMount() {
        this.testSubname('0')
    } */

    componentDidMount() {
        this.getCategory('0')
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
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                            onChange={this.onChange}
                            changeOnSelect
                        />
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