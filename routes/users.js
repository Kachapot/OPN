var express = require('express');
var router = express.Router();
var {auth} = require('../auth')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/regis',auth,async(req,res)=>{
  try {
    const body = req.body
    
  } catch (error) {
    console.log(error);
    res.json({status:200,message:'catch!',data:[]})
  }
})


module.exports = router;
