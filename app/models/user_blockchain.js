const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userBlockchainSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blockHash: String,
    blockNumber: String,
    contractAddress: String,
    cumulativeGasUsed: String,
    from: String,
    gasUsed: String,
    logsBloom: String,
    status: String,
    to:String,
    transactionHash:String,
    transactionIndex:String,
    type: String
}, {timestamps: true})

module.exports = mongoose.model('User_blockchain', userBlockchainSchema)