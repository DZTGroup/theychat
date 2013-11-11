var mysqlConnection = require("./mysql");

var User = {
    auth:function(user, password ,cb){
        mysqlConnection.connect();
        var query = 'select * from XMPP.USER where User="'+user+'" and password=password("'+ password+'")';
        mysqlConnection.query(query,function(err,rows,fields){
            cb(!!rows.length);
        });
        mysqlConnection.end();
    }
};

module.exports = User;
