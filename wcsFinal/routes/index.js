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


/* GET home page. */
router.get('/', function(req, res, next) {

  pool.getConnection(function (err, connection) {
    // Use the connection
    var sqlSelectQuery = "SELECT bno, title, writer, viewcnt, replycnt FROM tbl_board ORDER BY bno DESC LIMIT 0, 20";

    connection.query(sqlSelectQuery, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.render('index', {rows: rows});
      connection.release();

      // Don't use the connection here, it has been returned to the pool.
    });
  });

});

/*router.get('/', function(req, res, next) {

  res.render('index',  {userId: req.cookies.userId});

});*/

//-----------------------------------
//chat
//-----------------------------------



//-----------------------------------
//checkId(ID중복검사)
//-----------------------------------
router.post('/checkId', function(req,res){

  pool.getConnection(function (err, connection)
  {

    // Use the connection
    var sqlForCheckId = "SELECT COUNT(userid) FROM tbl_user where userid = ? ";
    connection.query(sqlForCheckId, req.body.id, function (err, result) {
      if (err) console.error("err : " + err);
      console.log("count : " + JSON.stringify(result));

      if(result[0]["COUNT(userid)"]==0){
        res.send("success");
      } else {
        res.send("fail");
      }
      connection.release();

      // Don't use the connection here, it has been returned to the pool.
    });
  });

});





//-----------------------------------
//register(회원가입)
//-----------------------------------
router.post('/register', multipartMiddleware, function(req,res,next){
  console.log("★★★★★★★★★★★★★★");

  console.log("회원가입 신청");

  var userId = req.body.id;
  var userPw = req.body.pw;
  var userName = req.body.name;

  pool.getConnection(function (err, connection)
  {
    var datas = [userId, userPw, userName];
    // Use the connection
    var sqlForInsertBoard = "insert into tbl_user(userid, userpw, username) values(?,?,?)";
    connection.query(sqlForInsertBoard,datas, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send("success");

      connection.release();
      // Don't use the connection here, it has been returned to the pool.
    });
  });


  if(typeof req.files.file != "undefined") {
    console.log("음하하하");
    var filePath = req.files.file.path;
    var stream = fs.createReadStream(filePath);

    stream.on('data', function(userPhoto) {
      var datas = [userPhoto, userId];
      pool.getConnection(function (err, connection)
      {
        console.log("사진 집어넣기");

        var sql = "update tbl_user set userphoto = ? where userid = ?";
        connection.query(sql, datas, function (err, rows) {

          connection.release();

        });
      });
    });
  }


});

//-----------------------------------
//login
//-----------------------------------
router.post('/login', function(req,res){

  pool.getConnection(function(err, connection){
    var sql = "select userid, userpw from tbl_user where userid=?";
    //rows[0]["userid"]

    connection.query(sql, [req.body.id], function(err, rows){

      if(typeof rows[0] != "undefined"){ //undefined에러가 떠서 넣음.
        if(rows[0] !="undefined" && req.body.pw == rows[0]["userpw"]) {
          //console.log("비밀번호가 같습니다.");
          res.cookie('userId', req.body.id, { expires: new Date(Date.now() + 900000)} );
          res.send("success"); //로그인 성공
        } else if(rows[0] != "undefined" && rows[0]["userid"]==" "){
          res.send("fail");
        } else{
          //console.log("비밀번호가 다릅니다.");
          res.send("false");

        }
      } else {
        res.send("fail");
      }

      connection.release();

    });
  });
});
//-----------------------------------
//logout
//-----------------------------------
router.post('/logout', function(req,res){
  res.clearCookie("userId");
  //createCookie(cookie_name,"",-1);
  res.send("로그아웃 성공");
});

//-----------------------------------
//랭킹
//-----------------------------------
router.get('/rank', function(req,res,next){
  pool.getConnection(function(err, connection){
    var sql = "select uno,userid, userscore, win, lose, userphoto from tbl_user order by userscore desc limit 0, 15";
    connection.query(sql, function(err, rows){
      console.log(JSON.stringify(rows));
      res.send({rows:rows});

      connection.release();
    });
  });
});

router.get('/rankScroll', function(req,res,next){
  var uno = Number.parseInt(req.param("lastUno"));
  console.log("lastUno: " + uno);
  pool.getConnection(function(err, connection){
    var sql = "select uno, userid, userscore, win, lose, userphoto from tbl_user order by userscore desc limit ?, 15";
    connection.query(sql, uno, function(err, rows){
      console.log("★★★★★★★★★",JSON.stringify(rows));
      res.send({rows:rows});

      connection.release();
    });
  });

});


//-----------------------------------
//마이페이지
//-----------------------------------
router.post('/myPage', function(req,res,next){

  pool.getConnection(function(err, connection){
    var sql = "select userid, username, win, lose, userphoto,userscore from tbl_user where userid= ?"

    connection.query(sql, [req.body.cookie], function(err, rows){
      console.log(JSON.stringify(rows));
      res.send({rows:rows});
      connection.release();
    });
  });
});


//-----------------------------------
//비번 변경
//-----------------------------------
router.post('/updatePw', function(req,res,next){

  pool.getConnection(function(err, connection) {

    var myId = req.body.cookie;
    var currentPw = req.body.currentPw;
    var newPw = req.body.newPw;

    var checkPwSql = "select userpw from tbl_user where userid=?"
    var updatePwSql = "update tbl_user set userpw=? where userid=?"

    connection.query(checkPwSql, myId, function (err, rows) {
      //console.log(JSON.stringify(rows));

      if(currentPw==rows[0]["userpw"] && newPw != ""){
        connection.query(updatePwSql, [newPw, myId], function(err, result) {
          res.send("success");
        })
      }else{
        res.send("fail");
      }

      connection.release();

    });
  });
});

//-----------------------------------
//게시판
//-----------------------------------

/* WRITE  */
router.post('/write', function(req, res, next) {

  console.log("ajax /write");
  var writer = req.body.writer;
  var title = req.body.title;
  var content = req.body.content;
  var datas = [title, content, writer];
  console.log(writer + " / " + title + " / " + content);

  var sqlInsertQuery = "INSERT INTO tbl_board(title, content, writer) VALUES(?, ?, ?)";
  var sqlSelectQuery = "SELECT bno, title, writer, viewcnt, replycnt FROM tbl_board ORDER BY bno DESC LIMIT 0, 20";

  pool.getConnection(function (err, connection) {

    connection.query(sqlInsertQuery, datas);
    connection.query(sqlSelectQuery, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();

      // Don't use the connection here, it has been returned to the pool.
    });
  });

});

/* READ */
router.post('/read', function(req, res, next) {

  var bno = req.body.bno;

  //console.log("post /read: " + bno);

  var sqlReadQuery = "SELECT writer, title, content FROM tbl_board WHERE bno = ?";

  pool.getConnection(function (err, connection) {

    connection.query(sqlReadQuery, bno, function (err, rows) {

      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();

    });
  });

});

/* UPDATE */
router.post('/update', function(req, res, next) {

  var bno = req.body.bno;
  var writer = req.body.writer;
  var title = req.body.title;
  var content = req.body.content;
  var datas = [writer, title, content, bno];

  console.log("ajax /update로 넘어온 값들: " + bno + " / " + writer + " / " + title + " / " + content);

  var sqlUpdateQuery = "update tbl_board set writer=?, title=?, content=? where bno=?";
  var sqlSelectQuery = "SELECT bno, title, writer, viewcnt, replycnt FROM tbl_board ORDER BY bno DESC LIMIT 0, 20";

  pool.getConnection(function (err, connection) {

    connection.query(sqlUpdateQuery, datas);
    connection.query(sqlSelectQuery, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();

      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

/* DELETE */
router.post('/delete', function(req, res, next) {

  var bno = req.body.bno;

  var sqlDeleteQuery = "DELETE FROM tbl_board WHERE bno=?";
  var sqlSelectQuery = "SELECT bno, title, writer, viewcnt, replycnt FROM tbl_board ORDER BY bno DESC LIMIT 0, 20";

  pool.getConnection(function (err, connection) {

    connection.query(sqlDeleteQuery, bno);
    connection.query(sqlSelectQuery, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();

      // Don't use the connection here, it has been returned to the pool.
    });
  });

});

/* WRITE REPLY */
router.post('/writereply', function(req, res, next){

  var bno = req.body.bno;
  var replyer = req.body.replyer;
  var replytext = req.body.replytext;
  var datas = [bno, replyer, replytext];

  var sqlInsertReplyQuery = "INSERT INTO tbl_reply(bno, replyer, replytext) VALUES(?, ?, ?)";
  var sqlReadReplyQuery = "SELECT rno, bno, replyer, replytext, DATE_FORMAT(replydate,'%Y-%m-%d') replydate FROM tbl_reply WHERE bno=? ORDER BY rno DESC LIMIT 0, 5";

  pool.getConnection(function (err, connection) {

    connection.query(sqlInsertReplyQuery, datas);
    connection.query(sqlReadReplyQuery, bno, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();
    });
  });

});


/* REPLY MODAL */
router.post('/replymodal', function(req, res, next) {

  var rno = req.body.rno;

  var sqlSearchReplyQuery = "SELECT * FROM tbl_reply WHERE rno=?";

  pool.getConnection(function (err, connection) {

    connection.query(sqlSearchReplyQuery, rno, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();
    });
  });

});

/* UPDATE REPLY */
router.post('/updatereply', function(req, res, next) {

  var bno = req.body.bno;
  var rno = req.body.rno;
  var replyer = req.body.replyer;
  var replytext = req.body.replytext;
  var datas = [replytext, rno];

  var sqlUpdateReplyQuery = "UPDATE tbl_reply SET replytext=? WHERE rno=?";
  var sqlReadReplyQuery = "SELECT rno, bno, replyer, replytext, DATE_FORMAT(replydate,'%Y-%m-%d') replydate FROM tbl_reply WHERE bno=? ORDER BY rno DESC LIMIT 0, 5";

  pool.getConnection(function (err, connection) {

    connection.query(sqlUpdateReplyQuery, datas);
    connection.query(sqlReadReplyQuery, bno, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();
    });
  });

});

/* DELETE REPLY */
router.post('/deletereply', function(req, res, next) {

  var rno = req.body.rno;
  var bno = req.body.bno;

  var sqlDeleteQuery = "DELETE FROM tbl_reply WHERE rno=?";
  var sqlReadReplyQuery = "SELECT rno, bno, replyer, replytext, DATE_FORMAT(replydate,'%Y-%m-%d') replydate FROM tbl_reply WHERE bno=? ORDER BY rno DESC LIMIT 0, 5";

  pool.getConnection(function (err, connection) {

    connection.query(sqlDeleteQuery, rno);
    connection.query(sqlReadReplyQuery, bno, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();
    });
  });

});

/* LOAD REPLY */
router.post('/loadreply', function(req, res, next){

  var rno = Number.parseInt(req.body.rno);
  var bno = Number.parseInt(req.body.bno);
  var datas = [bno, rno];

  console.log("rno: " + rno + typeof rno);
  console.log("bno: " + bno + typeof bno);

  var sqlReadReplyQuery = "SELECT rno, bno, replyer, replytext, DATE_FORMAT(replydate,'%Y-%m-%d') replydate FROM tbl_reply WHERE bno=? ORDER BY rno DESC LIMIT ?, 5";

  pool.getConnection(function (err, connection) {

    connection.query(sqlReadReplyQuery, datas, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();
    });
  });

});

router.post('/readReplies', function(req, res, next){

  var bno = req.body.bno;

  var sqlReadReplyQuery = "SELECT rno, bno, replyer, replytext, DATE_FORMAT(replydate,'%Y-%m-%d') replydate FROM tbl_reply WHERE bno=? ORDER BY rno DESC LIMIT 0, 5";

  pool.getConnection(function (err, connection) {

    connection.query(sqlReadReplyQuery, bno, function (err, rows) {
      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();
    });
  });

});

/* LOAD LIST */
router.post('/loadlist', function(req, res, next){

  var bno = Number.parseInt(req.body.bno);

  console.log(bno);

  var sqlLoadListQuery = "SELECT bno, title, writer, viewcnt, replycnt FROM tbl_board ORDER BY bno DESC LIMIT ?, 20";

  pool.getConnection(function (err, connection) {
    connection.query(sqlLoadListQuery, bno, function (err, rows) {

      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();

    });
  });

});

/* VIEWCNT RENEWAL */
router.post('/viewcntrenewal', function(req, res, next){

  var bno = Number.parseInt(req.body.bno);

  var sqlAddViewcntQuery = "UPDATE tbl_board SET viewcnt=viewcnt+1 WHERE bno=?";
  var sqlLoadListQuery = "SELECT bno, title, writer, viewcnt, replycnt FROM tbl_board ORDER BY bno DESC LIMIT 0, 20";

  pool.getConnection(function (err, connection) {
    connection.query(sqlAddViewcntQuery, bno);
    connection.query(sqlLoadListQuery, function (err, rows) {

      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();

    });
  });

});

/* REPLYCNT INCREASE */
router.post('/replycntinc', function(req, res, next){

  var bno = Number.parseInt(req.body.bno);

  var sqlReplycntIncQuery = "UPDATE tbl_board SET replycnt=replycnt+1 WHERE bno=?";
  var sqlLoadListQuery = "SELECT bno, title, writer, viewcnt, replycnt FROM tbl_board ORDER BY bno DESC LIMIT 0, 20";

  pool.getConnection(function (err, connection) {
    connection.query(sqlReplycntIncQuery, bno);
    connection.query(sqlLoadListQuery, function (err, rows) {

      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();

    });
  });

});

/* REPLYCNT DECREASE */
router.post('/replycntdec', function(req, res, next){

  var bno = Number.parseInt(req.body.bno);

  var sqlReplycntDecQuery = "UPDATE tbl_board SET replycnt=replycnt-1 WHERE bno=?";
  var sqlLoadListQuery = "SELECT bno, title, writer, viewcnt, replycnt FROM tbl_board ORDER BY bno DESC LIMIT 0, 20";

  pool.getConnection(function (err, connection) {
    connection.query(sqlReplycntDecQuery, bno);
    connection.query(sqlLoadListQuery, function (err, rows) {

      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();

    });
  });

});

//-----------------------------------
//코드작성 페이지
//-----------------------------------

/* LOAD USER CODE */
router.post('/loadcode', function(req, res, next){

  var userid = req.body.userid;

  var sqlLoadCodeQuery = "SELECT * FROM tbl_code WHERE userid=?";

  pool.getConnection(function (err, connection) {
    connection.query(sqlLoadCodeQuery, userid, function (err, rows) {

      if (err) console.error("err : " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.send({rows: rows});
      connection.release();

    });
  });

});

/* SAVE USER CODE */
router.post('/savecode', function(req, res, next){

  var userid = req.body.userid;
  var codenames = req.body.codenames;
  var codecontents = req.body.codecontents;

  var sqlDeleteCodeQuery = "DELETE FROM tbl_code WHERE userid=?";
  var sqlInsertCodeQuery = "INSERT INTO tbl_code(userid, codename, codecontent) VALUES(?, ?, ?)";

  pool.getConnection(function (err, connection) {
    connection.query(sqlDeleteCodeQuery, userid);

    if(codenames==null && codecontents==null){

      console.log("not data");
      res.send('저장된 데이터가 없습니다. 처음부터 다시 시작해주세요.');
      connection.release();

    }else {

      if(Array.isArray(req.body.codenames)==true) {
        for (var i = 0; i < codenames.length; i++) {
          var datas = [userid, codenames[i], codecontents[i]];
          connection.query(sqlInsertCodeQuery, datas);
        }
      }else{
        var datas = [userid, codenames, codecontents];
        connection.query(sqlInsertCodeQuery, datas);
      }
      res.send('수정이 완료되었습니다.');
      connection.release();

    }
  });

});

//-----------------------------------
//게임플레이
//-----------------------------------

router.post('/gamePlay', function(req,res){
  var userid = req.body.user;
  var sql = "select * from tbl_code where userid=?";
  console.log("gamePlay.............",userid);
  pool.getConnection(function (err, connection) {
    connection.query(sql, userid, function (err, rows){
      console.log("userid!!!!!!!! : " + JSON.stringify(rows));
      res.send({rows: rows});
      connection.release();
    });

  });
});

router.post('/enemyInfo', function(req,res){
  var userid = req.body.user;
  var sql = "select * from tbl_user where userid=?";

  pool.getConnection(function (err, connection) {
    connection.query(sql, userid, function (err, rows){

      res.send({rows: rows});
      connection.release();
    });

  });
});


module.exports = router;