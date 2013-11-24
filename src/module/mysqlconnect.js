var mysql = require("mysql");
var connection = mysql.createConnection({
    host:"localhost",
    database:"theychat",
    port:"3306",
    user:"root",
    password:"root"
});

module.exports = connection;
