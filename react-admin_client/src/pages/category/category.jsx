import React, { Component } from 'react'
import { Button, Card, Table, message } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';

import {reqCategoryList} from '../../api/index'

export default class Category extends Component {

    state = {
        loading:false,
        parentId:0,
        parentName:'',
        categories:[],
        subCategories:[]
    }

    getCategoryList = async() => {
        const {parentId} = this.state
        this.setState({loading: true})
        const result = await reqCategoryList(parentId)
        this.setState({loading: false})
        if(result.code===0){
            if(parentId===0){
                this.setState({categories: result.data})
            }else{
                this.setState({subCategories: result.data})
            }
        }else{
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
                        <a href='#x' >Modify</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {
                            this.state.parentId===0 ? <a href='#x' onClick={() => {this.showSubCategory(category)}}>Check SubCategory</a> : null
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
        }, ()=>{
            this.getCategoryList()
        })
    }

    //click go back to get first level list
    showFirstLevel = () => {
        this.setState({
            parentId: 0,
            parentName:'',
            subCategories: []
        })
    }

    componentWillMount(){
        this.initColumns()
        this.getCategoryList()
    }
    render() {

        const {categories, loading, parentId, parentName, subCategories} = this.state

        const title = parentId===0 ? "First Level List" : (
            <span>
                <a href='#x' onClick={this.showFirstLevel}>First Level List</a>
                <ArrowRightOutlined style={{margin: 5}} />
                {parentName}
            </span>
        )

        return (
            <Card
                title={title}
                bordered={false}
                extra={<Button type='primary'><PlusOutlined />Add</Button>} >
                <Table 
                dataSource={parentId===0 ? categories : subCategories} 
                columns={this.columns} 
                bordered 
                rowKey='_id'
                pagination={{showQuickJumper: true}}
                loading={loading}
                />
            </Card>
        )
    }
}