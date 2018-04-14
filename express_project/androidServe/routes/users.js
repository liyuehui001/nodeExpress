var express = require('express');
var router = express.Router();

/* GET users listing. */
 router.get('/test2', function(req, res, next) {
  res.send('respond with a resource');
}); 

router.get('/hello1', function(req, res, next) {
  res.send('respond with a hello');
});


module.exports = router;
