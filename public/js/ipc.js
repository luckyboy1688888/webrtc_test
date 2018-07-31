
var localVideo_UI;
var bt_connect;
var gLocalStream;
var gbIsInitiator = true;

var socket = io.connect();
setupSocketIo();

function startConnection() {
    var data={type:'move', content:{x:1, y:2}};
    socket.emit('ready', data);
}

$( document ).ready(function() {
    localVideo_UI = document.getElementById('localVideo');
    bt_connect = document.getElementById('bt_connect');
    console.log( "ready!" );
    fGrabWebCamVideo();
});

/****************************************************************************
 * Get User media
 ****************************************************************************/
var gbIsGetUserMediaOK = false;

const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};

function gotStream(stream) {
    //trace('Received local stream');
    localVideo_UI.srcObject = stream;
    gLocalStream = stream;
}

function fGrabWebCamVideo() {
    navigator.mediaDevices
        .getUserMedia({
            audio: true,
            video: true
        })
        .then(gotStream)
        .catch(e => alert(`getUserMedia() error: ${e.message}`));
}


/****************************************************************************
 * setupSocketIo
 ****************************************************************************/
function setupSocketIo() {

    socket.on('start_course', function (obj) {
        console.log('start_course: ', obj);
    });

    socket.on('ready', function (result) {
        console.log('ready', result);
        fCreatePeerConnection();
    });

    socket.on('log', function (array) {
        console.log.apply(console, array);
    });

    socket.on('message', function (message) {
        console.log(message);
        fSignalingMessageCallback(message);
    });
}

function fSignalingMessageCallback(message) {

    //////////////////////////////////peer connection//////////////////////////////////////////////////
    if (message.type === 'renegotiate') {
        fStartConnection();
    }
    if (message.type === 'offer') {
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function () {}, fLogError);
        peerConn.createAnswer(fOnLocalSessionCreated, fLogError);
        console.log(message.sdp);
    } else if (message.type === 'answer') {
        console.log('recieve answer');
        console.log(message.sdp);
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function () {}, fLogError);

    } else if (message.type === 'candidate') {
        peerConn.addIceCandidate(new RTCIceCandidate({
            candidate: message.candidate
        }));
        console.log('recieve candiate');
        console.log(message.candidate);
        console.log(message.id);
    }
}


function fSendToServer(command, parameter) {
    try {
        socket.emit(command, parameter);
    } catch (err) {
        console.log(command);
        console.log(parameter);
    }
}


/****************************************************************************
 * PeerConnection
 ****************************************************************************/

function fCreatePeerConnection() {
    console.log('Creat Peer connection');
    peerConn = new RTCPeerConnection(CONFIGURATION);
    peerConn.onicecandidate = fSendCandidate;
    peerConn.oniceconnectionstatechange = fStateChange;

    if (gLocalStream) {
        peerConn.addStream(gLocalStream);
    }

    fCreateDataChannel();

    if (gbIsInitiator) {
        fStartConnection();
    }
}

var sdpConstraints = {
    'mandatory': {
        'OfferToReceiveAudio': true,
        'OfferToReceiveVideo': true
    }
};

function fStartConnection() {
    console.log('Creating an offer');
    peerConn.createOffer(fOnLocalSessionCreated, fLogError, sdpConstraints);
}

function fOnLocalSessionCreated(desc) {
    peerConn.setLocalDescription(desc, function () {
        console.log('sending local desc: '+desc);
        fSendToServer("message", peerConn.localDescription);
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
        fSendToServer('message', {
            type: 'renegotiate',
        });
    }
}

/****************************************************************************
 * PeerConnection calllback
 ****************************************************************************/

function fSendCandidate() {
    if (event.candidate) {
        fSendToServer('message', {
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
        bt_connect.disabled=false;
    } else if (peerConn.iceConnectionState === 'completed' || peerConn.iceConnectionState === 'connected') {
        if (gbStateDisconnected) {
            console.log('set remote video');
            gbStateDisconnected = false;
            bt_connect.disabled=true;
        }
    }
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