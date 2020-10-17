import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree;

export default class AuthForm extends Component {

    static propTypes = {
        role: PropTypes.object.isRequired
    }

    constructor (props) {
        super(props)
        //generate initial state based on input menus
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    getTreeNode = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNode(item.children) : null}
                </TreeNode>
            )
            return pre
        }, [])
    }

    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({checkedKeys})
      };

    getMenus = () => {
        return this.state.checkedKeys
    }

    componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }

    componentWillMount() {
        this.treeNodes = this.getTreeNode(menuList)
    }

    render() {

        const { role } = this.props

        const {checkedKeys} = this.state

        return (
            <div>
                <Form>
                    <Item label='Role Name'>
                        <Input value={role.name} />
                    </Item>
                </Form>

                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title='Authrization' key='all'>
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}