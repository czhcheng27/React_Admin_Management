import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd'
import {reqDeleteImage} from '../../api'
/*
用于图片上传的组件
 */
export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    // previewVisible: false, // 标识是否显示大图预览Modal
    // previewImage: '', // 大图的url
    // fileList: [
    //   /*{
    //     uid: '-1', // 每个file都有自己唯一的id
    //     name: 'xxx.png', // 图片文件名
    //     status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
    //   },*/
    // ],
    previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
  }

  constructor (props) {
    super(props)

    let fileList = []

    // 如果传入了imgs属性
    const {imgs} = this.props
    if (imgs && imgs.length>0) {
      fileList = imgs.map((img, index) => ({
        uid: -index, // 每个file都有自己唯一的id
        name: img, // 图片文件名
        status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
        url: 'http://localhost:9000/upload/' + img
      }))
    }

    // 初始化状态
    this.state = {
      previewVisible: false, // 标识是否显示大图预览Modal
      previewImage: '', // 大图的url
      fileList // 所有已上传图片的数组
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

  /*
  获取所有已上传图片文件名的数组
   */
  getImgs  = () => {
    return this.state.fileList.map(file => file.name)
  }

  /*
  隐藏Modal
   */
  handleCancel = () => this.setState({ previewVisible: false });



  /*
  file: 当前操作的图片文件(上传/删除)
  fileList: 所有已上传图片文件对象的数组
   */
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
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" /*上传图片的接口地址*/
          accept='image/*'  /*只接收图片格式*/
          name='image' /*请求参数名*/
          listType="picture-card"  /*卡片样式*/
          fileList={fileList}  /*所有已上传图片文件对象的数组*/
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