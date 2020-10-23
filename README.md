# mqtt-project-example
use mqtt.js,aedes,express. iot project example. 

## 使用到的框架和模块
服务端使用express框架,前端页面使用vue.js
redis数据库存储注册过的设备
mqtt的broker使用aedes模块
client端使用mqtt.js
## 实现的功能
client端模拟设备定时发送数据给订阅者,网页也是一个client端,可以实时展示数据,通过pub下发参数的主题将数据发送到设备端,实现网页到设备的双向实时通讯.
express服务端查询redis中已经注册过的设备数据,client端将clientId修改为已注册的信息,启动就可以通讯了.clientId必须使以d_开头注册,以区分这是一台设备.
