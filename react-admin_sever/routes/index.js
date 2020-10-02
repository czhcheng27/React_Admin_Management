const md5 = require('blueimp-md5');
var express = require('express');
const { UserModel, RoleModel, CategoryModel } = require('../db/model');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//login
router.post('/login', function (req, res){
  const {username, password} = req.body
  UserModel.findOne({username, password:md5(password)}, function (err, user){
    if(user){
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
      if(user.role_id){
        RoleModel.findOne({_id: user.role_id}, function (err, role){
          if(role){
            user._doc.role = role
            res.send({code:0, data: user})
          }
        })
      }else{
        user._doc.role = {menus: []}
        res.send({code:0, data:user})
      }
    }else{
      res.send({code:1, msg:'username and password doesn\'t match'})
    }
  })
})

//add category
router.post('/manage/category/add', function (req, res){
  const {parentId, categoryName}  = req.body
  CategoryModel.create({parentId: parentId, name: categoryName || '0'}, function (err, doc){
    if(!err){
      res.send({code:0, data:doc})
    }else{
      res.send({code:1, msg:'Error, please try again'})
    }
  })
})

//update category name
router.post('/manage/category/update', function (req, res){
  const {categoryId, categoryName} = req.body
  CategoryModel.findOneAndUpdate({_id: categoryId}, {name: categoryName}, function (err, doc){
    if(!err){
      res.send({code:0})
    }else{
      res.send({code:1, msg:'Error, please try again'})
    }
  })
})

//get category list
router.get('/manage/category/list', function (req, res){
  const {parentId} = req.query
  CategoryModel.find({parentId}, function (err, doc){
    if(!err){
      res.send({code:0, data: doc})
    }else{
      res.send({code:1, msg:'Error, please try again'})
    }
  })
})

module.exports = router;
