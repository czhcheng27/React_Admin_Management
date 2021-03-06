import ajax from './ajax'

//every function return promise

//login
export const reqLogin = ({ username, password }) => ajax('/login', { username, password }, 'POST')

//add or update user
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

//add category
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', { parentId, categoryName }, 'POST')

//get category list
export const reqCategoryList = (parentId) => ajax('/manage/category/list', { parentId })

//update category name
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', { categoryId, categoryName }, 'POST')

//get product list
export const reqProductList = (pageNum, pageSize) => ajax('/manage/product/list', { pageNum, pageSize })

//search product
export const reqProductSearch = ({ pageNum, pageSize, searchWord, searchType }) =>
    ajax('/manage/product/search', {
        pageNum,
        pageSize,
        [searchType]: searchWord
    })

//delete image
export const reqDeleteImage = (name) => ajax('/manage/img/delete', { name }, 'POST')

//add product
export const reqAddUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, "POST")

//update product status
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', { productId, status }, 'POST')

//get all role list
export const reqRoleList = () => ajax('/manage/role/list')

//add role
export const reqAddRole = (roleName) => ajax('/manage/role/add', { roleName }, 'POST')

//update role
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

//get user list
export const reqUserList = () => ajax('/manage/user/list')

//delete user
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', { userId }, 'POST')