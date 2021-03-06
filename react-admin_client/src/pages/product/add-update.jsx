import React, { Component } from 'react'
import { Form, Input, Card, Button, Cascader, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';

import { reqCategoryList, reqAddUpdateProduct } from '../../api/index'
import LinkButton from '../../components/link-button';
import RichTextEditor from './rich-text-editor'
import PicturesWall from './pictures-wall'

const Item = Form.Item
const TextArea = Input.TextArea

export default class AddUpdate extends Component {

    formRef = React.createRef();

    state = {
        options: [],
    }

    constructor(props) {
        super(props)
        this.edit = React.createRef()
        this.pw = React.createRef()
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

        console.log(categoryOption);
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
        console.log(newArry);
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
            .then(async (values) => {
                console.log('Success', values);
                let imgs
                imgs = this.pw.current.getImgs()

                console.log('imgs', imgs);
                const detail = this.edit.current.getDetail()
                console.log('detail', detail);

                //collect data
                const { name, desc, price, categoryIds } = values
                console.log('categoryIds', categoryIds);
                let pCategoryName = this.state.options
                console.log('newArry', pCategoryName);

                let pCategoryId, categoryId, pCategoryIdName, categoryIdName

                if (this.isUpdate) {
                    // product._id = this.product._id
                    if (categoryIds.length === 1) {
                        let hasSubCategory = pCategoryName.find((c => categoryIds[0] === c.label || c.value === categoryIds[0]))
                        console.log('222', hasSubCategory);
                        pCategoryIdName = hasSubCategory.label
                        console.log('hasSubCategory', hasSubCategory);

                        pCategoryId = '0'
                        categoryId = hasSubCategory.value
                    } else {
                        // pCategoryId = categoryIds[0]
                        // categoryId = categoryIds[1]

                        let hasSubCategory = pCategoryName.find((c => categoryIds[0] === c.label || c.value === categoryIds[0]))
                        console.log('333', hasSubCategory);
                        pCategoryIdName = hasSubCategory.label
                        pCategoryId = hasSubCategory.value
                        console.log('pCategoryIdName,pCategoryId', pCategoryIdName, pCategoryId);

                        console.log('444', this.props.location.state.categoryIdName);
                        if (categoryIds[1] === this.props.location.state.categoryIdName) {
                            console.log('555', categoryIdName, categoryId);
                            categoryIdName = this.props.location.state.categoryIdName
                            categoryId = this.props.location.state.categoryId
                        } else {
                            let subCategoryChildren = hasSubCategory.children.find(c => c.value === categoryIds[1])
                            categoryIdName = subCategoryChildren.label
                        }

                        // let subCategoryChildren = hasSubCategory.children.find(c => c.value === categoryIds[1])
                        // categoryIdName = subCategoryChildren.label
                    }
                } else {
                    if (categoryIds.length === 1) {

                        let hasSubCategory = pCategoryName.filter((c => !!c.isLeaf))
                        console.log('hasSubCategory', hasSubCategory);
                        let firstLevelCategory = hasSubCategory.find(c => c.value === categoryIds[0])
                        console.log('firstLevelCategory', firstLevelCategory.label);
                        pCategoryIdName = firstLevelCategory.label

                        pCategoryId = '0'
                        categoryId = categoryIds[0]
                    } else {

                        //findout the one which isLeaf:false has subcategory
                        let hasSubCategory = pCategoryName.filter((c => !c.isLeaf))
                        console.log('hasSubCategory', hasSubCategory);
                        let firstLevelCategory = hasSubCategory.find(c => c.value === categoryIds[0])
                        console.log('firstLevelCategory', firstLevelCategory.label);
                        pCategoryIdName = firstLevelCategory.label

                        //findout all the categorys for subcategory & the one which _id is the same
                        let subCategoryChildren = firstLevelCategory.children.find(c => c.value === categoryIds[1])
                        console.log('subCategoryChildren', subCategoryChildren.label);
                        categoryIdName = subCategoryChildren.label

                        pCategoryId = categoryIds[0]
                        categoryId = categoryIds[1]
                    }
                }


                let product = { name, desc, price, categoryId, pCategoryId, imgs, detail, pCategoryIdName, categoryIdName }
                console.log('product', product);

                if (this.isUpdate) {
                    product._id = this.product._id
                }
                console.log('product._id', product._id);

                //send request
                const result = await reqAddUpdateProduct(product)

                //message.success/error
                if (result.code === 0) {
                    this.props.history.goBack()
                    message.success(`${this.isUpdate ? 'Update' : 'Add'} product success`)
                } else {
                    message.error(`${this.isUpdate ? 'Update' : 'Add'} product failed`)
                }
            })
            .catch(() => {
                console.log('Failed');
            })
    }

    componentWillMount = async () => {
        const product = this.props.location.state
        // const {pCategoryId, categoryId} = product
        // console.log('product', product, pCategoryId, categoryId);
        console.log('product', product);
        this.isUpdate = !!product
        this.product = product || {}
    }

    componentDidMount() {
        this.getCategory('0')
    }

    render() {

        const { isUpdate, product } = this
        const { pCategoryId, categoryIdName, pCategoryIdName, imgs, detail } = product
        // console.log('name', product);

        let categoryIds = []

        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(pCategoryIdName)
            } else {
                categoryIds.push(pCategoryIdName)
                categoryIds.push(categoryIdName)
            }
        }
        // console.log('categoryIds', categoryIds);

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined onClick={() => this.props.history.goBack()} />
                </LinkButton>
                {isUpdate ? 'Update Product' : 'Add New Product'}
            </span>
        )
        return (
            <Card title={title}>
                <Form {...formItemLayout} ref={this.formRef}>
                    <Item
                        label='Name'
                        name='name'
                        initialValue={product.name}
                        rules={[
                            { required: true, message: "Please type your product name" }
                        ]}
                    >
                        <Input placeholder='Please type your product name' />
                    </Item>

                    <Item
                        label='Description'
                        name='desc'
                        initialValue={product.desc}
                        rules={[
                            { required: true, message: "Please type your description" }
                        ]}
                    >
                        <TextArea placeholder='Please type description' />
                    </Item>

                    <Item
                        label='Price'
                        name='price'
                        initialValue={product.price}
                        rules={[
                            { required: true, message: "Please type your price" },
                            { validator: this.checkPrice }
                        ]}
                    >
                        <Input placeholder='Please type price' addonAfter="CAD" />
                    </Item>

                    <Item
                        label='Category'
                        name='categoryIds'
                        initialValue={categoryIds}
                        rules={[
                            { required: true, message: "Category must be type in" }
                        ]}
                    >
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                            onChange={this.onChange}
                            changeOnSelect
                        />
                    </Item>

                    <Item label='Pictures' >
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>

                    <Item label='Details' labelCol={2} wrapperCol={20}>
                        <RichTextEditor ref={this.edit} detail={detail} />
                    </Item>

                    <Item>
                        <Button type='primary' onClick={this.submit}>Submit</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}