const LocalStratey = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt') 


function initPassport(passport){
    passport.use(new LocalStratey({ usernameField: 'email' }, async (email, password, done) =>{
       
        /*-----------check if email exist--------*/
        const user = await User.findOne({ email: email })
        if(!user){
            return done(null, false, { message: 'No user with this email' })
        }

        /*--------------compare password with hashed password------------*/
        bcrypt.compare(password, user.password).then(match =>{
            if(match){
                return done(null, user, { message: 'Logged in successfully'})
            }

            return done(null, false, { message: 'Wrong email or password'})
        }).catch(err =>{
            return done(null, false, { message: 'Something went wrong'})
        })
    }))

    /*-----------serialize user------------*/ 
    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    /*-----------deserialize user------------*/
    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user) =>{
            done(err, user)
        })
    })
}


module.exports = initPassport