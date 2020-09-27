import React, {Component} from 'react' 
import {withRouter} from 'react-router-dom'

import {getDate} from '../../utils/dateUtlis'
import menuList from '../../config/menuConfig'
import './index.less'

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

    componentDidMount(){
        setInterval(()=>{
            const currentTime = getDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    render () { 

        const {currentTime} = this.state
        let title = this.getTitle()

        return ( 
            <div className='header'>
                <div className='header-top'>
                    <span>Welcome, admin</span>
                    <a href='javascript:'>Log Out</a>
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