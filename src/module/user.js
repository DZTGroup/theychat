var connection = require("./mysqlconnect");
var CODES = {
    USER_EXIST:100,
    USER_NOTFOUND:404,
    PASSWORD_UNCORRECT:500
};

var User = {
    exist:function(user){
        var query = 'select * from XMPP.USER where User="'+user+'"';
        connection.query(query,function(err,rows,fields){
            cb(error,!!rows.length);
        });

    },
    auth:function(user, password ,cb){
        var query = 'select * from XMPP.USER where User="'+user+'" and password=password("'+ password+'")';
        connection.query(query,function(err,rows,fields){
            var suc = false,
                error = err;
            if(!rows.length) {
                error = new Error('login failed');
            }else {
                suc = true;
            }
            if(error){
                console.log(error);
            }
        });
    },
    register:function(user,password,cb){
        this.exist(function(err,exist){
            if(err){
                cb(err,false);
            }else {
                if(exist){
                    var error = new Error('user exist');
                    error.code = 100;
                    cb(error,false);
                }else {
                    cb(null,true);
                }
            }
        });

    }
};

module.exports = User;
