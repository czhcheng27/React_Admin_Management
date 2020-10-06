import React, { Component } from 'react'
import { Button, Card, Table, message, Modal, Form, Select, Input } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';

import { reqCategoryList, reqUpdateCategory, reqAddCategory } from '../../api/index'
import LinkButton from '../../components/link-button';

const Item = Form.Item
const Option = Select.Option

export default class Category extends Component {

    formRef = React.createRef();

    state = {
        loading: false,
        parentId: '0',
        parentName: '',
        categories: [],
        subCategories: [],
        showStatus: 0, //0: don't show up; 1: add form; 2: update form
    }

    //get 1st&2nd level list
    getCategoryList = async (parentId) => {
        parentId = parentId || this.state.parentId
        this.setState({ loading: true })
        const result = await reqCategoryList(parentId)
        this.setState({ loading: false })
        if (result.code === 0) {
            if (parentId === '0') {
                this.setState({ categories: result.data })
            } else {
                this.setState({ subCategories: result.data })
            }
        } else {
            message.error('Error, please try again')
        }
    }

    initColumns = () => {
        this.columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
                title: 'Action',
                dataIndex: '',
                key: 'x',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => { this.showUpdate(category) }} >Modify</LinkButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {
                            this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategory(category) }}>Check SubCategory</LinkButton> : null
                        }
                    </span>
                ),
            },
        ];
    }

    //get 2nd level list
    showSubCategory = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategoryList()
        })
    }

    //click go back to get first level list
    showFirstLevel = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories: []
        })
    }

    showAdd = (parentId) => {
        this.setState({ showStatus: 1 })
        setTimeout(() => {
            this.formRef.current.setFieldsValue({ parentId: parentId });
        }, 100)
    }

    //add category function
    addCategory = () => {

        //form validate
        this.formRef.current.validateFields()
            .then(async (values) => {
                //hide modal
                this.setState({ showStatus: 0 })

                //collect data and send add request
                const { parentId, categoryName } = this.formRef.current.getFieldValue()
                this.formRef.current.resetFields();
                const result = await reqAddCategory(parentId, categoryName)
                if (result.code === 0) {
                    //if the category you want to add is under your current category
                    if (parentId === this.state.parentId) {
                        //get CURRENT list again
                        this.getCategoryList()
                    } else if (parentId === '0') {//add 1st level category when you are under 2nd level list, need to get 1st level list but don't need to show
                        this.getCategoryList('0')
                    }
                }
            })

            .catch(errorInfo => {
                message.error('Please try to type your category name again')
            })

    }

    //show update modal
    showUpdate = (category) => {
        //save category
        this.category = category
        // console.log('category',category);
        this.setState({ showStatus: 2 })
        setTimeout(() => {
            this.formRef.current.setFieldsValue({ categoryName: this.category.name });
        }, 100)
    }

    //update
    updateCategory = () => {

        //form validate
        this.formRef.current.validateFields()
            .then(async (values) => {

                //hide modal
                this.setState({ showStatus: 0 })

                //get parameter
                const categoryId = this.category._id
                // const categoryName = this.formRef.current.getFieldValue('categoryName')
                const { categoryName } = values

                //send request to update
                const result = await reqUpdateCategory(categoryId, categoryName)
                if (result.code === 0) {
                    //show list again
                    this.getCategoryList()
                }

            })

            .catch(errorInfo => {
                message.error('Please try to type your category name again')
            })



    }

    handleCancel = () => {
        this.formRef.current.resetFields();
        this.setState({ showStatus: 0 })
    }

    componentWillMount() {
        this.initColumns()
        this.getCategoryList()
    }

    render() {

        const { categories, loading, parentId, parentName, subCategories, showStatus } = this.state

        // const category = this.category || {}
        // console.log('name', category.name);
        // console.log('parentName', parentName);
        // console.log('categories', categories);

        const title = parentId === '0' ? "First Level List" : (
            <span>
                <LinkButton onClick={this.showFirstLevel}>First Level List</LinkButton>
                <ArrowRightOutlined style={{ margin: 5 }} />
                {parentName}
            </span>
        )

        return (
            <div>
                <Card
                    title={title}
                    bordered={false}
                    extra={<Button type='primary' onClick={() => { this.showAdd(parentId) }}><PlusOutlined />Add</Button>} >
                    <Table
                        dataSource={parentId === '0' ? categories : subCategories}
                        columns={this.columns}
                        bordered
                        rowKey='_id'
                        pagination={{ showQuickJumper: true }}
                        loading={loading}
                    />
                </Card>

                <Modal
                    title="Add Category"
                    visible={showStatus === 1 ? true : false}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <Form ref={this.formRef}>
                        <Item name='parentId' initialValue={parentId}>
                            <Select>
                                <Option value={'0'}>First Level Category</Option>
                                {
                                    categories.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        </Item>

                        <Item
                            name='categoryName'
                            rules={[
                                { required: true, message: "Please type your category name" },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Category name can\'t begine with space' }
                            ]}
                        >
                            <Input placeholder="Please type in category name" />
                        </Item>
                    </Form>
                </Modal>

                <Modal
                    title="Update Category"
                    visible={showStatus === 2 ? true : false}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <Form ref={this.formRef}>
                        <Item
                            name='categoryName'
                            rules={[
                                { required: true, message: "Please type your category name" },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: 'Category name can\'t begine with space' }
                            ]}
                        >
                            <Input placeholder="Please type in category name" />
                        </Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}