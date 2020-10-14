import ajax from './ajax'

//every function return promise

//login
export const reqLogin = ({ username, password }) => ajax('/login', { username, password }, 'POST')

//add user
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

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
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')
