var socketIO = require("socket.io");
var _ = require("lodash");

module.exports = function(db_helper) {
    var io;
    var db_helper=db_helper;
    this.setSocketIoServer = function(server) {
		io=socketIO.listen(server);        
    };

    this.initSocketIoLinscener = function(){
		io.on("connection", function(socket){
			console.log("socket connected");
			setupSocketIoLinscener(socket);
		});
    };

    var loginUserArray=[];
    setupSocketIoLinscener = function(socket){
        socket.on("message", function(in_data){
            //in_data=JSON.parse(in_data);
            console.log('client_say:');
            console.log(in_data);
            io.emit('message', in_data);
        });
        socket.on("ready", function(in_data){
            //in_data=JSON.parse(in_data);
            io.emit('ready', {});
        });
    };


};

