import store from 'store'

export default {
    //save user
    saveUser (user) {
        store.set('user_key', user)
    },

    //get user
    getUser(){
        return store.get('user_key')||{}
    },

    //delete user
    removeUser(){
        return store.remove('user_key')
    }
}