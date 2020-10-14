import React, { Component } from 'react'
import { Select, Card, Button, Table, Input, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import { reqProductList, reqProductSearch, reqUpdateStatus } from '../../api';

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
                width: '14%',
                render: (product) => {
                    const { status, _id } = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type={status === 1 ? 'primary' : 'dashed'}
                                style={{ marginBottom: 5, marginTop: 10 }}
                                onClick = {() => this.updateStatus(_id, newStatus)}
                            >
                                { status === 1 ? 'In Stock' : 'Out of Stock'}
                            </Button>
                            <p>{status === 1 ? 'Click to Out of Stock' : 'Click to In Stock'}</p>
                        </span>
                    )
                }
            },
            {
                title: 'Operation',
                render: (product) => (
                    <span>
                        <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>Edit</LinkButton>
                    </span>
                )
            },
        ];
    }

    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if(result.code===0){
            message.success('Update Status Success')
            this.getProductList(this.pageNum)
        } else {
            message.error('Update Status Failed')
        }
    }

    getProductList = async (pageNum) => {
        
        //save pageNum, becasue it will be used later in updateStatus function
        this.pageNum = pageNum

        this.setState({ loading: true })

        const { searchWord, searchType } = this.state

        let result

        if (searchWord) {
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

    addProduct = () => {
        this.props.history.push('/product/addupdate')
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
                    onChange={(event) => this.setState({ searchWord: event.target.value })}
                />
                <Button type='primary' onClick={() => this.getProductList(1)}>Search</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={this.addProduct}>
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