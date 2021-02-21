const router = require('express').Router()
const productCtrl = require('../controllers/productCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/products')
    .get(productCtrl.getProducts)
    .post(auth, authAdmin,productCtrl.createProduct) //dodat (auth, authAdmin,)


router.route('/products/:id')//brisanje ili dodavanje elementa prema zadanom id-u iz baze produkata
    .delete(auth, authAdmin,productCtrl.deleteProduct) //dodat (auth, authAdmin,)
    .put(auth, authAdmin,productCtrl.updateProduct) //dodat (auth, authAdmin,)



module.exports = router