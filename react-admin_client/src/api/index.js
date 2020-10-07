import ajax from './ajax'

//every function return promise

//login
export const reqLogin = ({username, password}) => ajax('/login', {username, password}, 'POST')

//add user
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

//add category
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {parentId, categoryName}, 'POST')

//get category list
export const reqCategoryList = (parentId) => ajax('/manage/category/list', {parentId})

//update category name
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')

//get product list
export const reqProductList = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})