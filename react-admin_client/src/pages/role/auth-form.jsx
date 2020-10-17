import React, { Component } from 'react'
import { Tree } from 'antd'

import menuList from '../../config/menuConfig'

const { TreeNode } = Tree;

export default class AuthForm extends Component {

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
        // console.log('onCheck', checkedKeys);
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

        const {checkedKeys} = this.state

        return (
            <div>
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