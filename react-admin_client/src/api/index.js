import ajax from './ajax'

//every function return promise

//login
export const reqLogin = ({username, password}) => ajax('/login', {username, password}, 'POST')

//add user
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

//