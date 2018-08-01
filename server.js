////////third module
var express 	= require("express");
var fs 			= require("fs");
var https 		= require('http');
var path 		= require("path");

const SERVERPORT = process.env.PORT || 8001;

////////custom class 
var socket_manager = require("./server/socket_manager/socket_manager.js");
var db_helper = require("./server/db_helper/db_helper.js");

var app = express();

app.use(express.static('public'));
var server = https.createServer(app);
app.get("/ipc", function(req, res){
    ///////setup socket io
    Socket_manager.initSocketIoLinscener_IPC();
	res.sendFile("public/view/ipc.html",{ root: __dirname });
});

app.get("/ui", function(req, res){
    ///////setup socket io
    Socket_manager.initSocketIoLinscener_UI();
    res.sendFile("public/view/ui.html",{ root: __dirname });

});


server.listen(SERVERPORT,function(){
	console.log("Server up and running at %s port", SERVERPORT);
});


///////setup pgdb
//var db_helper = new db_helper();
//db_helper.initDB();
// setTimeout(function(){
// 	db_helper.queryData('select * from users');
// }, 1500, 'funky');


var Socket_manager = new socket_manager(db_helper);
Socket_manager.setSocketIoServer(server);




