var socketIO = require("socket.io");
var _ = require("lodash");
var uuid = require("node-uuid");

module.exports = function(db_helper) {
    var io;
    var db_helper=db_helper;
    this.setSocketIoServer = function(server) {
		io=socketIO.listen(server);        
    };


    var socket_UI=null;
    this.initSocketIoLinscener_UI = function(){
		io.of('/ui').on("connection", function(socket){
            socket_UI=socket;
			console.log("ui connected");
			setupSocketIoLinscener_UI(socket);
		});
    };

    var socketArrayIPC=[];
    this.initSocketIoLinscener_IPC = function(){
        io.of('/ipc').on("connection", function(socket){
            console.log("ipc connected");
            var id=uuid.v1();
            socketArrayIPC.push({ipc_uuid:id, socket:socket});
            socket.emit('connect_server',{ipc_uuid:id});
            setupSocketIoLinscener_IPC(socket);
        });
    };


    setupSocketIoLinscener_UI = function(socket){
        socket.on("msg", function(in_data){
            console.log('client_say:');
            console.log(in_data);
            var socket_ipc=_.find(socketArrayIPC,{ipc_uuid:in_data.ipc_uuid});
            socket_ipc.socket.emit('msg',in_data);
        });
    };

    setupSocketIoLinscener_IPC = function(socket){
        socket.on("msg", function(in_data){
            console.log('client_say:');
            console.log(in_data);
            socket_UI.emit('msg', in_data);
        });
    };


};

