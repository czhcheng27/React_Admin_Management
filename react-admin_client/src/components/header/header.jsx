import React, {Component} from 'react' 
import './index.less'

export default class Header extends Component { 
    render () { 
        return ( 
            <div className='header'>
                <div className='header-top'>
                    <span>Welcome, admin</span>
                    <a href='javascript:'>Log Out</a>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>Home</div>
                    <div className='header-bottom-right'>2020-9-24</div>
                </div>
            </div>
        )
    }
}