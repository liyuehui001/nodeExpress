var express = require('express');
var mysql = require('mysql');
var app = require('../app');
var sd = require('silly-datetime');
var router = express.Router();

/* GET users listing. */

var body = "";
var addParams=[];

router.post('/register', function(req, res, next) {

    
    //设置响应头部信息和编码
    var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

    if(req.body.username=="" || req.body.password =="" ){
         res.json({"resultCode":"0","message":"register error"});
    }else{
        addParams.push(req.body.username);
        addParams.push(req.body.password);
        addParams.push(time);
        insertData(res);
    }
});


function insertData(res){
    
    var addsql = "INSERT INTO user(Id,Username,Password,RegisterTime) values(0,?,?,?)";

    app.connection.query(addsql,addParams,function(err,result){

        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            res.json({"resultCode":"0","message":"register error"});
        }else{
            console.log('INSERT ID:',result);
            res.json({"resultCode":"1","message":"success"});
        }
        addParams = [];
        
    });

}


router.post('/login',function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;

    var selectUserNum = "SELECT count(*) as num FROM user WHERE `Username` = ? AND `Password`=?";
    var selectParams =[];
    selectParams.push(username);
    selectParams.push(password);

    app.connection.query(selectUserNum,selectParams,function(err,result,fields){
        if(err){
            console.log('[select ERROR] - ',err.message);
            res.json({"resultCode":"0","message":"register error"});
        }else{
            if(result[0]['num'] > 0){
                returnData(res,selectParams);
            }else{
                res.json({"resultCode":"0","message":"login error"});
            }
        }


    })

});


function returnData(res,selectParams){
    var selectUser = "SELECT * FROM user WHERE `Username` = ? AND `Password`=?";
    app.connection.query(selectUser,selectParams,function(err,result){
        if(err){
            console.log('[select ERROR] - ',err.message);
            res.json({"resultCode":"0","message":"register error"});
        }else{
            console.log("返回信息:userid---"+result[0]['Id']);
            res.json({"resultCode":"1","message":"success"});
        }
    })
}

module.exports = router;
