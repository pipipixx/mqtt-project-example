const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port1 = 1883
let clientIDs = [] //在线客户端
server.listen(port1, function () {
  console.log('mqtt server listening on port ', port1)
})

//端口不能和上面的冲突
const httpServer = require('http').createServer()
const ws = require('websocket-stream')
const port2 = 1884
ws.createServer({ server: httpServer }, aedes.handle)
httpServer.listen(port2, function () {
  console.log('websocket server listening on port ', port2)
})


//连接redis
const { promisify } = require("util")
var redis = require('redis')
var clientRedis = redis.createClient(6379, '127.0.0.1')
const getAsync = promisify(clientRedis.get).bind(clientRedis)
clientRedis.on('ready', function (res) {
  console.log('redis ready')
  //定时pub在线设备列表
  setInterval(() => {
    // console.log(clientIDs)
    aedes.publish({
      qos: 1,
      topic: 'onlineList',
      payload: JSON.stringify(clientIDs)
    })
  }, 2000)
  
})
clientRedis.on('end', function (err) {
  console.log('end');
})
clientRedis.on('error', function (err) {
  console.log(err);
})

// 客户端连接
aedes.on('client', function (client) {
  // client.close()  //主动关闭客户端
  let id = client.id
  console.log(`客户端上线: ${id}`)
  if (id.slice(0,2) === 'd_') {
    clientIDs.push(client.id)
  }
})

// 客户端断开
aedes.on('clientDisconnect', function (client) {
  console.log(`客户端下线: ${client.id}`)
  if (client.id.slice(0,2) === 'd_') {
    clientIDs.splice(clientIDs.findIndex(item => item === client.id), 1)
  }
})

aedes.on('publish', function (packet, client) {
  if (client) {      //确保不是刚链接或断开的pub
    // console.log(`${client.id}:${packet.topic}:`, packet.payload.toString())
  }
})

//用户名和密码验证
aedes.authenticate = function (client, username, password, callback) {
  //只验证了username
  callback(null, username === 'mimi')
}