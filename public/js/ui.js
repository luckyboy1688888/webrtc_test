
var gbIsInitiator = false;

var socket = io.connect('/ui');
setupSocketIo();

$( document ).ready(function() {
    remoteVideoDiv = document.getElementById('remoteVideoDiv');
});

/****************************************************************************
 * setupSocketIo
 ****************************************************************************/
function setupSocketIo() {

    socket.on('start_course', function (obj) {
        console.log('start_course: ', obj);
    });

    socket.on('log', function (array) {
        console.log.apply(console, array);
    });

    socket.on('msg', function (msg) {
        console.log('Client received msg: ' + msg.type);
        fSignalingMessageCallback(msg);
    });
}

var g_ipc_uuid=null;
function fSignalingMessageCallback(msg) {
    g_ipc_uuid=msg.ipc_uuid;
    //////////////////////////////////peer connection//////////////////////////////////////////////////
    if (msg.data.type === 'renegotiate') {
        fStartConnection();
    }
    if (msg.data.type === 'offer') {
        peerConn.setRemoteDescription(new RTCSessionDescription(msg.data), function () {}, fLogError);
        peerConn.createAnswer(fOnLocalSessionCreated, fLogError);
        console.log(msg.data.sdp);
    } else if (msg.data.type === 'answer') {
        console.log('recieve answer');
        console.log(msg.data.sdp);
        peerConn.setRemoteDescription(new RTCSessionDescription(msg.data), function () {}, fLogError);

    } else if (msg.data.type === 'candidate') {
        peerConn.addIceCandidate(new RTCIceCandidate({
            candidate: msg.data.candidate
        }));
        console.log('recieve candiate');
        console.log(msg.data.candidate);
        console.log(msg.data.id);
    }else if (msg.data.type === 'ready') {
        fCreatePeerConnection();
    }
}


function fSendToServer(data) {
    try {
        socket.emit('msg', {ipc_uuid:g_ipc_uuid, data:data});
    } catch (err) {
        console.log(command);
        console.log(parameter);
    }
}


/****************************************************************************
 * PeerConnection
 ****************************************************************************/

function fCreatePeerConnection() {
    console.log("Creat Peer connection");
    peerConn = new RTCPeerConnection(CONFIGURATION);
    peerConn.onicecandidate = fSendCandidate;
    peerConn.oniceconnectionstatechange = fStateChange;
    peerConn.onaddstream = fGetRemoteStream;
    peerConn.onremovestream = fRemoteStreamRemoved;


    fCreateDataChannel();

    if (gbIsInitiator) {
        fStartConnection();
    }
}

var sdpConstraints = {
    'mandatory': {
        'OfferToReceiveAudio': false,
        'OfferToReceiveVideo': false
    }
};

function fStartConnection() {
    console.log("Creating an offer");
    peerConn.createOffer(fOnLocalSessionCreated, fLogError, sdpConstraints);
}

function fOnLocalSessionCreated(desc) {
    peerConn.setLocalDescription(desc, function () {
        console.log('sending local desc: '+ desc);
        fSendToServer(peerConn.localDescription);
        console.log('peerConn.localDescription='+peerConn.localDescription);
    }, fLogError);
}

function fLogError(err) {
    console.log(err.toString());
}

function fRenegotiate() {
    if (gbIsInitiator) {
        fStartConnection();
    } else {
        fSendToServer({
            type: 'renegotiate',
        });
    }
}

/****************************************************************************
 * PeerConnection calllback
 ****************************************************************************/

function fSendCandidate() {
    if (event.candidate) {
        fSendToServer({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
        });
    } else {
        console.log('End of candidates.');
    }
}

var gbStateDisconnected = false;

function fStateChange(event) {
    console.log('iceConnection state change: ' + peerConn.iceConnectionState);
    if (peerConn.iceConnectionState === 'disconnected') {
        gbStateDisconnected = true;
        //remoteVideo_UI.src = '';
    } else if (peerConn.iceConnectionState === 'completed' || peerConn.iceConnectionState === 'connected') {
        if (gbStateDisconnected) {
            console.log('set remote video');
            // var video_e = document.createElement("video");
            // remoteVideoDiv.appendChild(video_e);
            // video_e.srcObject = gRemoteStream;
            gbStateDisconnected = false;
        }
    }
}

var remoteVideoDiv;
var remoteVideoArray=[];
var remoteSdpArray=[];


//event.currentTarget.remoteDescription.sdp



function fRemoteStreamRemoved(event) {
    console.log('remote stream removed');
    //remoteVideo_UI.src = '';
}

var gRemoteStream;

function fGetRemoteStream(event) {
    console.log('get remote stream');
    gRemoteStream = event.stream;
    var video_e = document.createElement("VIDEO");
    video_e.setAttribute("width", "320");
    video_e.setAttribute("height", "240");
    video_e.autoplay = true;
    video_e.srcObject = gRemoteStream;
    //video_e.load();
    remoteVideoDiv.appendChild(video_e);
}


/****************************************************************************
 * CreateDataChannel
 ****************************************************************************/

function fCreateDataChannel() {

    // if (gbIsInitiator) {
    //     go_dataChannel_fileTranfer = peerConn.createDataChannel("fileTransfer");
    //     fSetFileTranferDataChannel(go_dataChannel_fileTranfer);
    //     go_dataChannel_canvas = peerConn.createDataChannel("canvas");
    //     fSetCanvasDataChannel(go_dataChannel_canvas);
    //     dataChannel_chat = peerConn.createDataChannel("chat");
    //     fSetChatDataChannel(dataChannel_chat);
    //     dataChannel_pdf = peerConn.createDataChannel("pdf");
    //     fSetPdfDataChannel(dataChannel_pdf);
    //     dataChannel_pdf_control = peerConn.createDataChannel("pdf_control");
    //     fSetPdfControlDataChannel(dataChannel_pdf_control);
    //     go_dataChannel_picUpload = peerConn.createDataChannel("uploadPic");
    //     fSetUploadPicDataChannel(go_dataChannel_picUpload);
    //     go_dataChannel_tabSwitch = peerConn.createDataChannel("tabSwitch");
    //     fSetTabSwitchDataChannel(go_dataChannel_tabSwitch);
    //
    //     go_dataChannel_canvasScrollBar = peerConn.createDataChannel("canvasScrollBar");
    //     fSetCanvasScrollBarDataChannel(go_dataChannel_canvasScrollBar);
    // } else {
    //     peerConn.ondatachannel = function (event) {
    //
    //         if (event.channel.label == "fileTransfer") {
    //             go_dataChannel_fileTranfer = event.channel;
    //             fSetFileTranferDataChannel(go_dataChannel_fileTranfer);
    //         } else if (event.channel.label == "canvas") {
    //             go_dataChannel_canvas = event.channel;
    //             fSetCanvasDataChannel(go_dataChannel_canvas);
    //         } else if (event.channel.label == "chat") {
    //             dataChannel_chat = event.channel;
    //             fSetChatDataChannel(dataChannel_chat);
    //         } else if (event.channel.label == "pdf") {
    //             dataChannel_pdf = event.channel;
    //             fSetPdfDataChannel(dataChannel_pdf);
    //         } else if (event.channel.label == "pdf_control") {
    //             dataChannel_pdf_control = event.channel;
    //             fSetPdfControlDataChannel(dataChannel_pdf_control);
    //         } else if (event.channel.label == "uploadPic") {
    //             go_dataChannel_picUpload = event.channel;
    //             fSetUploadPicDataChannel(go_dataChannel_picUpload);
    //         } else if (event.channel.label == "tabSwitch") {
    //             go_dataChannel_tabSwitch = event.channel;
    //             fSetTabSwitchDataChannel(go_dataChannel_tabSwitch);
    //         } else if (event.channel.label == "canvasScrollBar") {
    //             go_dataChannel_canvasScrollBar = event.channel;
    //             fSetCanvasScrollBarDataChannel(go_dataChannel_canvasScrollBar);
    //         }
    //
    //     };
    // }
}