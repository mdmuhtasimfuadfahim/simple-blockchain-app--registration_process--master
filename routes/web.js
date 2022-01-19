const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const adminController = require('../app/http/controllers/admin/adminController')
/*------------middlewares--------------*/
const auth = require('../app/http/middlewares/auth') 
const guest = require('../app/http/middlewares/guest') 
const admin = require('../app/http/middlewares/admin') 

function initRoutes(app){
    app.get('/', homeController().index)
    app.get('/login', guest, authController().login)
    app.get('/registration', guest, authController().registration)

    app.post('/post-login', authController().postLogin)
    app.post('/post-registration', authController().postRegistration)
    app.post('/logout', auth, authController().logout)

    app.get('/admin/user-list', admin, adminController().userList)
    app.get('/admin/user-table-blockchain', admin, adminController().userTableBlockchain)
}


module.exports = initRoutes