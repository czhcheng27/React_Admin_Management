import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, message } from 'antd'
import { reqDeleteImage } from '../../api'
import { PlusOutlined } from '@ant-design/icons';

export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs: PropTypes.array
    }

    state = {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    }

    constructor(props) {
        super(props)

        let fileList = []


        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: 'http://localhost:9000/upload/' + img
            }))
        }


        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList
        }
    }

    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }


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


    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }


    handleCancel = () => this.setState({ previewVisible: false });




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

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload"
                    accept='image/*'
                    name='image'
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}