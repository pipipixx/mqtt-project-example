var express = require('express');
var router = express.Router();
const { promisify } = require("util")
const SMEMBERS = promisify(redisClient.SMEMBERS).bind(redisClient)
const SADD = promisify(redisClient.SADD).bind(redisClient)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/allClients', function(req, res, next) {
  SMEMBERS('device').then(function(data) {
    // console.log(data)
    res.send(data)
  })
})

router.post('/addDevice',async function(req, res, next) {
  let { id } = req.body
  let addRes = await SADD('device', id)
  if (addRes === 1) {
    res.send({state: true})
  }else {
    res.send({state: false})
  }
  
})

module.exports = router;
