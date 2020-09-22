const md5 = require('blueimp-md5')

//connect to database
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/React_Admin_System')
const conn = mongoose.connection
conn.on('connected', function (){
    console.log('database connect successfully');
})

//define User Schema
const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: String},
    email: {type: String},
    create_time: {type: Number, default: Date.now},
    role_id: {type: String}
})

//define Model
const UserModel = mongoose.model('users', userSchema)

//Initial default user Admin => username: admin, password: admin
UserModel.findOne({username: 'admin', password: 'admin'}).then(user => {
    if(!user){
        UserModel.create({username: 'admin', password: md5('admin')}).then(user => {
            console.log('Initial default user Admin => username: admin, password: admin');
        })
    }
})

//export model
exports.UserModel = UserModel



//define Role Schema
const roleSchema = new mongoose.Schema({
   menus: Array,
   name:{type: String, required: true},
   create_time: {type: Number, default: Date.now},
   auth_name: String,
   auth_time: Number
})

//define Model
const RoleModel = mongoose.model('roles', roleSchema)

//export model
exports.RoleModel = RoleModel