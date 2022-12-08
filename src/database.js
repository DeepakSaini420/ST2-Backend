const mysql = require('mysql'); 

const conn = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"password",
    database:"users"
}) 

module.exports = conn;