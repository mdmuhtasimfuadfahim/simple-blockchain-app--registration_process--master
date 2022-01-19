const User = require('../../../models/user')
const User_blockchain = require('../../../models/user_blockchain')
const moment = require('moment')

function adminController(){
    return{
        async userList(req, res){
            const user = await User.find()
            res.render('admin-view/viewList', {user: user, moment:moment})
        },
        async userTableBlockchain(req, res){
            // User_blockchain.find({ sort: { 'createdAt': -1 } }).
            // populate('userID', '-password').exec((err, users)=>{
            //     if(req.xhr){
            //         console.log(users)
            //         res.json(users)
            //     }
            //     else{
            //         return res.render('admin-view/viewUserTable')
            //     }
               
            // }) 
            const user_blockchain = await User_blockchain.find().populate('userID', '-password')
            console.log(user_blockchain)
            res.render('admin-view/viewUserTable', {users: user_blockchain, moment: moment})

        }
    }
}

module.exports = adminController