const User = require('../../models/user')
const bcrypt = require('bcrypt')
const moment = require('moment')
const passport = require('passport')
const multer = require('multer')
const path = require('path')
const contract = require('../../models/contract')
const User_blockchain = require('../../models/user_blockchain')
const contract_abi = require('../../config/abi')
const abi = contract_abi.abi

const Web3 = require('web3')
const rpcURL = "http://localhost:8000"
const web3 = new Web3(rpcURL)
const accounts = require('web3-eth-accounts')
const keythereum = require('keythereum')
const tx = require('ethereumjs-tx').Transaction
var accountOneKey = process.env.Private_Key_Of_Account_One;


/*----------file uploader operation-----------*/
let storage = multer.diskStorage({
    destination: (req, file, cb) =>cb(null, 'public/img'),
    filename: (req, file, cb) =>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
}) 

let upload = multer({
    storage,
}).single('image')

function authController(){
    const _getRedirectUrl = (req) =>{
        return req.user.role === 'Admin' ? '/admin/user-list' : '/'
    }
    return{
        login(req, res){
            res.render('auth/login')
        },
        registration(req, res){
            return res.render('auth/registration')
        },
        postLogin(req, res, next){
            const { email, password } = req.body

            /*------------validate user----------*/
            if(!email || !password){
                req.flash('error', 'All fields are required to be filled up for login')
                return res.redirect('/login')
            } 
            else{
                passport.authenticate('local', (err, user, info) =>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    if(!user){
                        req.flash('error', info.message)
                        return res.redirect('/login')
                    }
                    req.login(user, (err) =>{
                        if(err){
                            req.flash('error', info.message)
                            return next(err)
                        }

                        /*--------login with the redirected user role api-------*/ 
                        return res.redirect(_getRedirectUrl(req))
                    })
                })(req, res, next)
            }
        },
        async postRegistration(req, res){
            upload(req, res, async function (err) {
            const { name, email, uni_id, address, contact, dob, password } = req.body
            
            if(err){
                return res.status(500).send({ error: err.message})
            }

            if(!req.file){
                req.flash('error', 'Did not find any file')
            }
            
            /*---------validate request--------*/ 
            if(!name || !email || !uni_id || !contact ||!address || !password || !dob ){
                req.flash('error', 'All fields are required for registration')
                req.flash('name', name)
                req.flash('email', email)
                req.flash('uni_id', uni_id)
                req.flash('dob', dob)
                req.flash('contact', contact)
                req.flash('address', address)
                req.flash('password', password)
                return res.redirect('/registration')
            }

            /*----------check if email exists-----------*/
            User.exists({email: email}, (err, result)=>{
                if(result){
                    req.flash('error', 'This email is taken')
                    req.flash('name', name)
                    req.flash('uni_id', uni_id)
                    req.flash('contact', contact)
                    req.flash('address', address)
                    req.flash('dob', dob)
                    req.flash('password', password)
                    return res.redirect('/registration')
                }
            })

            /*----------check if contact number exists-----------*/
            User.exists({contact: contact}, (err, result)=>{
                if(result){
                    req.flash('error', 'This contact is already exists')
                    req.flash('name', name)
                    req.flash('email', email)
                    req.flash('uni_id', uni_id)
                    req.flash('address', address)
                    req.flash('dob', dob)
                    req.flash('password', password)
                    return res.redirect('/registration')
                }
            })
            // if(password != confirm_password){
            //     req.flash('error', 'Password does not matched')
            //         req.flash('name', name)
            //         req.flash('email', email)
            //         req.flash('uni_id', uni_id)
            //         req.flash('address', address)
            //         req.flash('dob', dob)
            //         req.flash('password', password)
            //         return res.redirect('/registration')
            // }

            /*---------hash password----------*/
            const hashedPassword = await bcrypt.hash(password, 10)

            /*---------store user information into database--------*/
            const user = new User({
                image: '/img/' + req.file.filename,
                name: name,
                email: email,
                uni_id: uni_id,
                contact: contact,
                address: address,
                dob: dob,
                password: hashedPassword
            }) 

            console.log(user)
            const Contract = await contract.find();

            user.save().then(request =>{
                req.flash('success', 'Registation done Successfully')
                

                web3.eth.getAccounts().then(async function(accounts){
                    Contract.forEach(async function(contractAdd){
                        const contract_address = contractAdd.contractAddress;

                        const name = user.name.toString();
                        const email = user.email.toString();
                        const uniId = user.uni_id.toString();
                        const myAddress = user.address.toString();
                        const role = "Student";

                        const myContract = new web3.eth.Contract(abi, contract_address);
                        const myContractFunction = myContract.methods.storeRegistrationInformation(name, email, uniId, myAddress, role).encodeABI();

                        const tx = {
                            chainId: 54673,
                            data: myContractFunction,
                            to: process.env.Account_One_Address,
                            value: web3.utils.toWei('0.1', 'ether'),
                            gas: 600000*1.50
                        }

                        web3.eth.accounts.signTransaction(tx, "0x" + accountOneKey).then(signed =>{
                            web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', async function(response){
                                const user_blockchain = new User_blockchain({
                                    userID: user._id,
                                    blockHash: response.blockHash,
                                    blockNumber: response.blockNumber,
                                    contractAddress: response.contractAddress,
                                    cumulativeGasUsed: response.cumulativeGasUsed,
                                    from: response.from,
                                    gasUsed: response.gasUsed,
                                    logsBloom: response.logsBloom,
                                    status: response.status,
                                    to: response.to,
                                    transactionHash: response.transactionHash,
                                    transactionIndex: response.transactionIndex,
                                    type: response.type
                                })

                                const save_user_blockchain = await user_blockchain.save();
                                console.log(save_user_blockchain)
                            })
                        })
                    })
                })
                return res.redirect('/')
            }).catch(err =>{
                console.log(err)
                req.flash('error', 'Something went Wrong')
                return res.redirect('/registration')
            })
        }) 
        },
        logout(req, res){
            req.logout()
            return res.redirect('/login')
        }
    }
}


module.exports = authController