const md5 = require('blueimp-md5');
var express = require('express');
const { UserModel, RoleModel } = require('../db/model');
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

module.exports = router;
