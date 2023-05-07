var ws = require("nodejs-websocket");
var { configure } = require('./src/utils/LC-00000001') 
var express = require('express');

var app = express();

//消息广播

function broadcast(server, msg) {

    server.connections.forEach(function (conn) {

        conn.sendText(msg)

    })

}

//建立websocket链接

var server = ws.createServer(function (connection) {

    connection.on('text', function (result) {
    })
    connection.on('connect', function (code) {
        console.log("开启链接", code);
    })
    connection.on('close', function (code) {
        console.log("关闭连接", code);
    })
    //socket监听端口
}).listen(8081);
 //建立接口链接，通过访问接口，触发socket发送数据

 app.get("/live", function (req, res) {
    res.append("Access-Control-Allow-Origin", "*");
    res.append("Content-Type", "text/event-stream");
    console.log(JSON.stringify(configure))
    broadcast(server,JSON.stringify(req.query.text)); //消息内容
    res.end("发送成功!")
  });
//接口监听端口
app.listen(8082)

console.log("WebSocket建立完毕");