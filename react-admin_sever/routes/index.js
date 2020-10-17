const md5 = require('blueimp-md5');
var express = require('express');
const { UserModel, RoleModel, CategoryModel, ProductModel } = require('../db/model');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//login
router.post('/login', function (req, res) {
  const { username, password } = req.body
  UserModel.findOne({ username, password: md5(password) }, function (err, user) {
    if (user) {
      res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 })
      if (user.role_id) {
        RoleModel.findOne({ _id: user.role_id }, function (err, role) {
          if (role) {
            user._doc.role = role
            res.send({ code: 0, data: user })
          }
        })
      } else {
        user._doc.role = { menus: [] }
        res.send({ code: 0, data: user })
      }
    } else {
      res.send({ code: 1, msg: 'username and password doesn\'t match' })
    }
  })
})

//add category
router.post('/manage/category/add', function (req, res) {
  const { parentId, categoryName } = req.body
  CategoryModel.create({ parentId: parentId, name: categoryName || '0' }, function (err, doc) {
    if (!err) {
      res.send({ code: 0, data: doc })
    } else {
      res.send({ code: 1, msg: 'Error, please try again' })
    }
  })
})

//update category name
router.post('/manage/category/update', function (req, res) {
  const { categoryId, categoryName } = req.body
  CategoryModel.findOneAndUpdate({ _id: categoryId }, { name: categoryName }, function (err, doc) {
    if (!err) {
      res.send({ code: 0 })
    } else {
      res.send({ code: 1, msg: 'Error, please try again' })
    }
  })
})

//get category list
router.get('/manage/category/list', function (req, res) {
  const { parentId } = req.query
  CategoryModel.find({ parentId }, function (err, doc) {
    if (!err) {
      res.send({ code: 0, data: doc })
    } else {
      res.send({ code: 1, msg: 'Error, please try again' })
    }
  })
})

//add new product
router.post('/manage/product/add', function (req, res) {
  const product = req.body
  ProductModel.create(product)
    .then(product => {
      res.send({ code: 0, data: product })
    })
    .catch(error => {
      console.log('Add new product occur error', error);
      res.send({ code: 1, msg: 'Error, please try again' })
    })
})

//get product list
router.get('/manage/product/list', function (req, res) {
  const { pageNum, pageSize } = req.query
  ProductModel.find({})
    .then(products => {
      res.send({ code: 0, data: pageFilter(products, pageNum, pageSize) })
    })
    .catch(error => {
      console.error('Error, please try again', error)
      res.send({ code: 1, msg: 'Error, please try again' })
    })
})

// search product
router.get('/manage/product/search', (req, res) => {
  const { pageNum, pageSize, productName, productDesc } = req.query
  let contition = {}
  if (productName) {
    contition = { name: new RegExp(`^.*${productName}.*$`) }
  } else if (productDesc) {
    contition = { desc: new RegExp(`^.*${productDesc}.*$`) }
  }
  ProductModel.find(contition)
    .then(products => {
      res.send({ code: 0, data: pageFilter(products, pageNum, pageSize) })
    })
    .catch(error => {
      console.error('Error', error)
      res.send({ code: 1, msg: 'Error, please try again' })
    })
})

//add product
router.post('/manage/product/add', (req, res) => {
  const product = req.body
  ProductModel.create(product, function (err, doc) {
    if (!err) {
      res.send({ code: 0, data: doc })
    } else {
      res.send({ code: 1, msg: 'Add product failed' })
    }
  })
})

//update product
router.post('/manage/product/update', (req, res) => {
  const product = req.body
  ProductModel.findByIdAndUpdate({ _id: product._id }, product, function (err, oldDoc) {
    if (!err) {
      res.send({ code: 0 })
    } else {
      res.send({ code: 1, msg: 'Update product failed' })
    }
  })
})

//update product status
router.post('/manage/product/updateStatus', (req, res) => {
  const { productId, status } = req.body
  // console.log('productId', productId);
  //     console.log('status', status);
  ProductModel.findByIdAndUpdate({ _id: productId }, { status: status }, function (err, oldDoc) {
    if (!err) {
      // console.log('productId', productId);
      // console.log('status', status);
      res.send({ code: 0 })
    } else {
      // console.log('sss');
      res.send({ code: 1, msg: 'Error, please try again' })
    }
  })
})

//add role
router.post('/manage/role/add', (req, res) => {
  const { roleName } = req.body
  RoleModel.create({ name: roleName })
    .then(role => {
      res.send({ code: 0, data: role })
    })
    .catch(err => {
      res.send({ code: 1, msg: 'Add role failed, please try again' })
    })
})

//get role list
router.get('/manage/role/list', (req, res) => {
  RoleModel.find()
    .then(roles => {
      res.send({ code: 0, data: roles })
    })
    .catch(err => {
      res.send({ code: 1, msg: 'Get role list failed, please try again' })
    })
})

//update role
router.post('/manage/role/update', (req, res) => {
  const role = req.body
  role.auth_time = Date.now()
  RoleModel.findByIdAndUpdate({ _id: role._id }, role)
    .then(oldRole => {
      res.send({ code: 0 })
    })
    .catch(err => {
      res.send({ code: 1, msg: 'Update role failed, please try again' })
    })
})


function pageFilter(arr, pageNum, pageSize) {
  pageNum = pageNum * 1
  pageSize = pageSize * 1
  const total = arr.length
  const pages = Math.floor((total + pageSize - 1) / pageSize)
  const start = pageSize * (pageNum - 1)
  const end = start + pageSize <= total ? start + pageSize : total
  const list = []
  for (var i = start; i < end; i++) {
    list.push(arr[i])
  }

  return {
    pageNum,
    total,
    pages,
    pageSize,
    list
  }
}

require('./file-upload')(router)

module.exports = router;
