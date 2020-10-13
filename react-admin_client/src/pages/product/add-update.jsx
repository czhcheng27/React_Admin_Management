import React, { Component } from 'react'
import { Form, Input, Card, Upload, Button, Cascader, Modal, message } from 'antd'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';

import { reqCategoryList, reqDeleteImage, reqAddUpdateProduct } from '../../api/index'
import LinkButton from '../../components/link-button';
import RichTextEditor from './rich-text-editor'

const Item = Form.Item
const TextArea = Input.TextArea

export default class AddUpdate extends Component {

    formRef = React.createRef();

    state = {
        options: [],
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
        fileListUpdate: []
    }

    constructor(props) {
        super(props)
        this.edit = React.createRef()
    }

    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = async ({ file, fileList }) => {
        // console.log('handleChange', file, fileList[fileList.length-1], file.status, file===fileList[fileList.length-1]);

        //when update success, correction the current file's name & url
        if (file.status === 'done') {
            const result = file.response//{code:0, data:{name: 'xxx.jpg', url: 'xxx'}}
            console.log(result);
            if (result.code === 0) {
                // console.log(result.data);
                message.success('Upload image success')
                const { name, url } = result.data
                let file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('Upload image failed')
            }
        } else if (file.status === 'removed') {
            const result = await reqDeleteImage(file.name)
            if (result.code === 0) {
                message.success('Delete image success')
            } else {
                message.error('Delete image failed')
            }
        }


        this.setState({ fileList });
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
                imgs = this.state.fileList.map(file => file.name)
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
                    if(categoryIds.length === 1) {
                        let hasSubCategory = pCategoryName.find((c => c.value === categoryIds[0]))
                        pCategoryIdName = hasSubCategory.label

                        pCategoryId = '0'
                        categoryId = categoryIds[0]
                    } else {
                        pCategoryId = categoryIds[0]
                        categoryId = categoryIds[1]

                        let hasSubCategory = pCategoryName.find((c => c.value === categoryIds[0]))
                        pCategoryIdName = hasSubCategory.label

                        let subCategoryChildren = hasSubCategory.children.find(c => c.value === categoryIds[1])
                        categoryIdName = subCategoryChildren.label
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
                    message.success(`${this.isUpdate ? 'Update' : 'Add'}product success`)
                } else {
                    message.error(`${this.isUpdate ? 'Update' : 'Add'}product failed`)
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
        const { categoryId, pCategoryId, categoryIdName, pCategoryIdName, imgs, detail } = product
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

        let fileListUpdate = []

        if (imgs && imgs.length > 0) {
            fileListUpdate = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: 'http://localhost:9000/upload/' + img
            }))
        }

        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );

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
                        <Upload
                            action="/manage/img/upload"
                            accept='image/*'//File types that can be accepted
                            name='image'//The name of uploading file
                            listType="picture-card"
                            fileList={isUpdate ? fileListUpdate : fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                        >
                            {fileList.length >= 9 ? null : uploadButton}
                        </Upload>
                        <Modal
                            visible={previewVisible}
                            title={previewTitle}
                            footer={null}
                            onCancel={this.handleCancel}
                        >
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
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