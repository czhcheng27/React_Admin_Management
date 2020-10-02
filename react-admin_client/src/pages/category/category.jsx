import React, { Component } from 'react'
import { Button, Card, Table, message, Modal, Form, Select, Input } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';

import { reqCategoryList } from '../../api/index'
import LinkButton from '../../components/link-button';

const Item = Form.Item
const Option = Select.Option

export default class Category extends Component {

    formRef = React.createRef();

    state = {
        loading: false,
        parentId: 0,
        parentName: '',
        categories: [],
        subCategories: [],
        showStatus: 0, //0: don't show up; 1: add form; 2: update form
    }

    getCategoryList = async () => {
        const { parentId } = this.state
        this.setState({ loading: true })
        const result = await reqCategoryList(parentId)
        this.setState({ loading: false })
        if (result.code === 0) {
            if (parentId === 0) {
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
                        <LinkButton onClick={()=>{this.showUpdate(category)}} >Modify</LinkButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {
                            this.state.parentId === 0 ? <LinkButton onClick={() => { this.showSubCategory(category) }}>Check SubCategory</LinkButton> : null
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
            parentId: 0,
            parentName: '',
            subCategories: []
        })
    }

    showAdd = () => {
        this.setState({showStatus:1})
    }

    //show update modal
    showUpdate = (category) => {
        //save category
        this.category = category
        // console.log('category',category);
        this.setState({showStatus: 2})
        setTimeout(()=>{
            this.formRef.current.setFieldsValue({categoryName: this.category.name});
        },100)
    }

    handleCancel = () => {
        this.setState({showStatus: 0})
    }

    componentWillMount() {
        this.initColumns()
        this.getCategoryList()
    }
    render() {

        const { categories, loading, parentId, parentName, subCategories, showStatus } = this.state

        const category = this.category || {}
        console.log('name', category.name);

        const title = parentId === 0 ? "First Level List" : (
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
                    extra={<Button type='primary' onClick={this.showAdd}><PlusOutlined />Add</Button>} >
                    <Table
                        dataSource={parentId === 0 ? categories : subCategories}
                        columns={this.columns}
                        bordered
                        rowKey='_id'
                        pagination={{ showQuickJumper: true }}
                        loading={loading}
                    />
                </Card>

                <Modal
                    title="Add Category"
                    visible={showStatus===1?true:false}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <Form initialValues={{parentId:'0'}}>
                        <Item name='parentId'>
                        <Select>
                            <Option value='0'>First Level Category</Option>
                            <Option value='1'>Computer</Option>
                            <Option value='2'>Keyboard</Option>
                        </Select>
                        </Item>

                        <Item name='categoryName'>
                            <Input placeholder="Please type in category name" />
                        </Item>
                    </Form>
                </Modal>

                <Modal
                    title="Update Category"
                    visible={showStatus===2?true:false}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <Form ref={this.formRef}>
                        <Item name='categoryName'>
                            <Input placeholder="Please type in category name" />
                        </Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}