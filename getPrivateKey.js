const keythereum = require('keythereum');
const account = "0xf49d1a5ca03116c30b9f4456853781a78d53afc3";
const password = "ornab1";
// const path = require('./blockchain/data')

const keyObject = keythereum.importFromFile(account, "./blockchain/data");
var privateKey = keythereum.recover(password, keyObject);
console.log(privateKey.toString('hex'));