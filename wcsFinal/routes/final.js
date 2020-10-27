/**
 * Created by HongIl on 2015-09-09.
 */
var express = require('express');
var router = express.Router();

router.get('/gameStop/:AName/:AScore/:BName/:BScore', function(req, res, next) {

    var data = {};
    data.AName = req.params.AName;
    data.BName = req.params.BName;
    data.AScore = req.params.AScore;
    data.BScore = req.params.BScore;


    res.render('final', {result : data});
});

module.exports = router;