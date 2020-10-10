/*
处理文件上传的路由
 */
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const dirPath = path.join(__dirname, '..', 'public/upload')

const storage = multer.diskStorage({
  // destination: 'upload', 
  destination: function (req, file, cb) { //function need create folder mannuly
    // console.log('destination()', file)
    if (!fs.existsSync(dirPath)) {
      fs.mkdir(dirPath, function (err) {
        if (err) {
          console.log(err)
        } else {
          cb(null, dirPath)
        }
      })
    } else {
      cb(null, dirPath)
    }
  },
  filename: function (req, file, cb) {
    // console.log('filename()', file)
    var ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
})
const upload = multer({storage})
const uploadSingle = upload.single('image')

module.exports = function fileUpload(router) {

  // upload image
  router.post('/manage/img/upload', (req, res) => {
    uploadSingle(req, res, function (err) { 
      if (err) {
        return res.send({
          code: 1,
          msg: 'upload image failed'
        })
      }
      var file = req.file
      res.send({
        code: 0,
        data: {
          name: file.filename,
          url: 'http://localhost:9000/upload/' + file.filename
        }
      })

    })
  })

  // delete image
  router.post('/manage/img/delete', (req, res) => {
    const {name} = req.body
    fs.unlink(path.join(dirPath, name), (err) => {
      if (err) {
        console.log(err)
        res.send({
          code: 1,
          msg: 'delete image failed'
        })
      } else {
        res.send({
          code: 0
        })
      }
    })
  })
}
