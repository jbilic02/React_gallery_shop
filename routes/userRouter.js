const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')


router.post('/register', userCtrl.register)//ruta za register

router.post('/login', userCtrl.login) //ruta za login

router.get('/logout', userCtrl.logout)//ruta za logout

router.get('/refresh_token', userCtrl.refreshToken)//ruta za refreshToken

router.get('/infor', auth, userCtrl.getUser)//ruta za getUser

router.patch('/addcart', auth, userCtrl.addCart)//ruta za addCart


module.exports = router