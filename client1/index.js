var mqtt = require('mqtt')
let clientId = 'd_aa'  //不能冲突,设备的唯一码
let topic1 = `downParam/${clientId}`
var client  = mqtt.connect('mqtt://127.0.0.1',{clientId: clientId, username: 'mimi',password: '123456'})

client.on('connect', function () {
  //订阅下发参数的主题
  client.subscribe(topic1,{ qos:1 },function(err, granted) {
    if (err) console.log(err)
    console.log(`订阅${topic1}主题成功`)
  })
  //定时pub数据,模拟传感器采集值
  setInterval(() => {
    let val = parseInt(Math.random()*100) + 'm'
    let param = {
      id: clientId,
      val: val
    }
    client.publish('upData', JSON.stringify(param))
  }, 2000)
})

//接收订阅的消息
client.on('message', function (topic, message, packet) {
  if (topic === topic1) {
    console.log('收到控制参数: ' + message.toString())
  }
  // client.end()
})