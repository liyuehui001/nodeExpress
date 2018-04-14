var express = require('express');
var mysql = require('mysql');
var app = require('../app');
var router = express.Router();
var async = require('async');

router.post('/getlist',function(req,res,next){
	var userId = req.body.userId;

	var selectSql = "SELECT * FROM `info_main` WHERE `UserId` = ?";
	var selectImageUrls = "SELECT * FROM `image_urls` WHERE `InfoMainId` = ?";
	var returnObj = new Object();
	returnObj.mainlists = new Array();

	async.waterfall([
		function(callBack){
			app.connection.query(selectSql,[userId],function(err,result1,feilds1){
				if(err){
					console.log('[select ERROR] - ',err.message);
            		res.json({"resultCode":"0","message":"select userid error"});
				}else{
					console.log("userid="+userId);
					console.log(result1.length);
					for(var i = 0;i < result1.length; i++){
						var mainItem = new Object();
						mainItem.time = result1[i]['Time'];
						mainItem.text = result1[i]['Text'];
						mainItem.zannum = result1[i]['ZanNum'];
						mainItem.id = result1[i]['Id'];
						returnObj.mainlists.push(mainItem);	
					}
					callBack(err,returnObj);
				}
				
				
			});
		},
		function(mainItem,callBack){
			app.connection.query(selectImageUrls,[mainItem.id],function(err,result2,feilds1){
				mainItem.image_urls = new Array();
				for(var j=0; j < result2.length; j++){
					mainItem.image_urls.push(result2[j]['ImageUrl']);
				}
				
			})
		}	
	],function(err,result){
		console.log(returnObj);
		res.json(returnObj);

	});
	
})

module.exports = router;