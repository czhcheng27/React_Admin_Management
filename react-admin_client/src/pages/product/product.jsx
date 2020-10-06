import React, {Component} from 'react' 
import {Switch, Route, Redirect} from 'react-router-dom'

import AddUpdate from './add-update'
import ProductHome from './home'

export default class Product extends Component { 
    render () { 
        return ( 
            <Switch>
                <Route exact path='/product' component={ProductHome} />{/* exact: complete match */}
                <Route path='/product/addupdate' component={AddUpdate} />
                <Redirect to='/product' />
            </Switch>
        )
    }
}