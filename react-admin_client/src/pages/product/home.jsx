import React, { Component } from 'react'
import { Select, Card, Button, Table, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';

const Option = Select.Option

export default class ProductHome extends Component {

    state = {
        product: [
            {
                "status": 1,
                "imgs": [],
                "_id": "5f7be2b8f809f909e851c99f",
                "categoryId": "5f793e0750831929f088a2c3",
                "pCategoryId": "0",
                "name": "Audi",
                "price": 66666,
                "desc": "A6, remote start, heated seats",
                "__v": 0
            },
            {
                "status": 1,
                "imgs": [],
                "_id": "5f7be4cf6f867c43f09601d0",
                "categoryId": "5f793e0750831929f088a2c3",
                "pCategoryId": "0",
                "name": "Honda",
                "price": 33333,
                "desc": "Civic, blind point, heated seats",
                "__v": 0
            },
            {
                "status": 1,
                "imgs": [],
                "_id": "5f7be4f76f867c43f09601d1",
                "categoryId": "5f793e0750831929f088a2c3",
                "pCategoryId": "0",
                "name": "Toyota",
                "price": 44444,
                "desc": "Rav4, blind point, light",
                "__v": 0
            },
            {
                "status": 1,
                "imgs": [],
                "_id": "5f7be5246f867c43f09601d2",
                "categoryId": "5f793e0750831929f088a2c3",
                "pCategoryId": "0",
                "name": "Benz",
                "price": 77777,
                "desc": "C300, voice control",
                "__v": 0
            }
        ]
    }

    initColums = () => {
        this.columns = [
            {
                title: 'Product Name',
                dataIndex: 'name',
            },
            {
                title: 'Description',
                dataIndex: 'desc',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                render: (price) => '$' + price
            },
            {
                title: 'Status',
                dataIndex: 'status',
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

    componentWillMount() {
        this.initColums()
    }

    render() {

        const { product } = this.state

        const title = (
            <span>
                <Select value='1' style={{ width: 160 }}>
                    <Option value='1'>Search by Name</Option>
                    <Option value='2'>Search by Description</Option>
                </Select>
                <Input placeholder='Key Word' style={{ width: 150, margin: '0 15px' }} />
                <Button type='primary'>Search</Button>
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
                    rowKey='_id'
                    dataSource={product}
                    columns={this.columns} />
            </Card>
        )
    }
}