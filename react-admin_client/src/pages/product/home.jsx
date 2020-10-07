import React, { Component } from 'react'
import { Select, Card, Button, Table, Input, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import { reqProductList, reqProductSearch } from '../../api';

const Option = Select.Option
const pageSize = 3

export default class ProductHome extends Component {

    state = {
        product: [],
        total: 0,
        loading: false,
        searchType: 'productName',
        searchWord: ''
    }

    initColums = () => {
        this.columns = [
            {
                title: 'Product Name',
                dataIndex: 'name',
                width: '20%'
            },
            {
                title: 'Description',
                dataIndex: 'desc',
                width: '40%'
            },
            {
                title: 'Price',
                dataIndex: 'price',
                width: '13%',
                render: (price) => '$' + price
            },
            {
                title: 'Status',
                dataIndex: 'status',
                width: '14%',
                render: () => {

                    return (
                        <span>
                            <Button type='primary'>In Stock</Button>
                        </span>
                    )
                }
            },
            {
                title: 'Operation',
                render: (product) => (
                    <span>
                        <LinkButton>Edit</LinkButton>
                    </span>
                )
            },
        ];
    }

    getProductList = async (pageNum) => {
        this.setState({ loading: true })

        const {searchWord, searchType} = this.state

        let result

        if(searchWord){
            result = await reqProductSearch({ pageNum, pageSize, searchWord, searchType })
        } else {
            result = await reqProductList(pageNum, pageSize)
        }
        
        this.setState({ loading: false })
        if (result.code === 0) {
            const { total, list } = result.data
            this.setState({
                product: list,
                total
            })
            // console.log(list);
        } else {
            message.error('Error, please try again')
        }
    }

    componentDidMount() {
        this.getProductList(1)
    }

    componentWillMount() {
        this.initColums()
    }

    render() {

        const { product, loading, total, searchType } = this.state

        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: 160 }}
                    onChange={(value) => this.setState({ searchType: value })}
                >
                    <Option value='productName'>Search by Name</Option>
                    <Option value='productDesc'>Search by Description</Option>
                </Select>
                <Input 
                placeholder='Key Word' 
                style={{ width: 150, margin: '0 15px' }} 
                onChange = {(event) => this.setState({searchWord: event.target.value})}
                />
                <Button type='primary' onClick={()=>this.getProductList(1)}>Search</Button>
            </span>
        )

        const extra = (
            <Button type='primary'>
                <PlusOutlined />
                Add Product
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    loading={loading}
                    rowKey='_id'
                    dataSource={product}
                    columns={this.columns}
                    pagination={{
                        total,
                        defaultPageSize: pageSize,
                        showQuickJumper: true,
                        onChange: (pageNum) => { this.getProductList(pageNum) }
                    }}
                />
            </Card>
        )
    }
}