const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    uni_id: {type: String, required: true, unique: true},
    address: {type: String, required: true},
    contact: {type: String, required: true, unique: true},
    dob: {type: Date, required: true},
    role: {type: String, default: 'Student'},
    password: {type: String, required: true},
},{timestamps: true})

module.exports = mongoose.model('User', userSchema)