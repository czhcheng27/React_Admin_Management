import React, {Component} from 'react' 
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {getDate} from '../../utils/dateUtlis'
import menuList from '../../config/menuConfig'
import './index.less'
import memoryUtils from '../../utils/memoryUtlis'
import storageUtlis from '../../utils/storageUtlis'
import LinkButton from '../link-button'

class Header extends Component { 

    state = {
        currentTime: getDate(Date.now())
    }

    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if(item.key===path){
                title = item.title
            } else if (item.children){
                let cItem = item.children.find(cItem => cItem.key===path)
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout = () => {
        Modal.confirm({
            title: 'Do you Want to log out?',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
              console.log('OK');
              //clear user 
              memoryUtils.user = {}
              storageUtlis.removeUser()
              this.props.history.replace('/login')
            },
            onCancel() {
              console.log('Cancel');
            },
          })
    }

    componentDidMount(){
        this.setIntervalId = setInterval(()=>{
            const currentTime = getDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.setIntervalId)
    }

    render () { 

        const {currentTime} = this.state
        let title = this.getTitle()

        return ( 
            <div className='header'>
                <div className='header-top'>
                    <span>Welcome, admin</span>
                    <LinkButton onClick={this.logout}>Log Out</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>{currentTime}</div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)