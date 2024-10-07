const port = 3000
const express = require('express')
const app = express()
const path = require('path')
const multer  = require('multer')
const crypto = require('crypto')
// const upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {

    console.log(file)
    crypto.randomBytes(6, function(err,bytes) {
      // body
     const uniqueSuffix = bytes.toString('hex') +'-'+ Date.now()+path.extname(file.originalname) 
     cb(null, uniqueSuffix)
    })
  }
})


const upload = multer({ storage: storage })

app.use(express.static(path.join(__dirname, 'public'))) 

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.get('/', function (req, res) {
  // res.send('Hello World')
  res.render('upload')
})

app.post('/upload',upload.single('fileToUpload'), function (req, res) {

    console.log('uploaded'+req.file.originalname)
    res.redirect('/')
})

app.listen(port)
