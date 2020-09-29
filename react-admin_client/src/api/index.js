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