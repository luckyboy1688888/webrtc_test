////////third module
var express 	= require("express");
var fs 			= require("fs");
//var http 		= require('http');
var http 		= require('http');
var path 		= require("path");

const SERVERPORT=8080;

////////custom class 
var socket_manager = require("./server/socket_manager/socket_manager.js");
var db_helper = require("./server/db_helper/db_helper.js");

var app = express();

app.use(express.static('public'));
var server = http.createServer(app);
app.get("/ipc", function(req, res){
	res.sendFile("public/view/ipc.html",{ root: __dirname });
});

app.get("/ui", function(req, res){
    res.sendFile("public/view/ui.html",{ root: __dirname });
});


server.listen(SERVERPORT,function(){
	console.log("Server up and running at %s port", SERVERPORT);
});


///////setup pgdb
var db_helper = new db_helper();
db_helper.initDB();
// setTimeout(function(){
// 	db_helper.queryData('select * from users');
// }, 1500, 'funky');


///////setup socket io
var Socket_manager = new socket_manager(db_helper);
Socket_manager.setSocketIoServer(server);
Socket_manager.initSocketIoLinscener();



