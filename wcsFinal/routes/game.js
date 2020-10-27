/**
 * Created by Yoonji on 2015-09-07.
 */
var express = require('express');
var router = express.Router();
var io = require('../bin/www');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/*mysql 모듈*/
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: '14.32.66.104',
    user: 'ServiceManager',
    database: 'WCS',
    password: '12345678'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('game');
});

router.get('/codeInsert/:player/:code/:player2/:code2', function(req,res){
    var player = req.params.player;
    var code = req.params.code;
    var player2 = req.params.player2;
    var code2 = req.params.code2;
    console.log("@@@@@@@@@@@@@@@@@@@@@@",code, player);

    if(code == "keyBoard"){
        var sql = "select codecontent,codename from tbl_code where codename=? and userid=?";

        pool.getConnection(function (err, connection) {
            connection.query(sql, [code2,player2], function (err, rows){
                console.log("code!!!!!!!! : " + JSON.stringify(rows));
                res.render('game',{rows: rows, keyBoard: "true"});
                //res.redirect('/game');
                connection.release();
            });

        });
    }else {
        var sql = "select codecontent,codename from tbl_code where (codename=? and userid=?) or (codename=? and userid=?)";

        pool.getConnection(function (err, connection) {
            connection.query(sql, [code,player,code2,player2], function (err, rows){
                console.log("code!!!!!!!! : " + JSON.stringify(rows));
                res.render('game',{rows: rows, keyBoard:"false"});
                //res.redirect('/game');
                connection.release();
            });

        });
    }

});




module.exports = router;

