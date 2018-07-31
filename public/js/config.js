/*jshint esnext: true */


/****************************************************************************
 * teach page tab
 ****************************************************************************/
const TAB1_PDF = 0;
const TAB2_UPLOADPIC = 1;
const TAB3_CHALKBOARD = 2;
const TAB4_INTERNET = 3;

const SWITCHTAB1_INTERNET = '0';
const SWITCHTAB2_PDF = '1';
const SWITCHTAB3_UPLOADPIC = '2';
const SWITCHTAB4_CHALKBOARD = '3';

/****************************************************************************
 * LOG
 ****************************************************************************/

const LOG_DISABLE = 0;
const LOG_CRITICAL = 1;
const LOG_ERROR = 2;
const LOG_WARNING = 3;
const LOG_DEBUG = 4;
const LOG_INFO = 5;

const LOG_LEVEL = LOG_INFO;
const ENABLE_WEB_LOG = true;

/****************************************************************************
 * src
 ****************************************************************************/

const OPENING_PDF = 'res/AlphaEduOpenPDF.pdf';

/****************************************************************************
 * config
 ****************************************************************************/


//const CONFIGURATION = {
//  'iceServers': [{
//      'url': 'stun:stun.l.google.com:19302'
//    }]
//};

const CONFIGURATION = {
  'iceServers': [{
      'url': 'stun:stun.l.google.com:19302'
    }, {
      'url': 'stun:stun01.sipphone.com'
    }, {
      'url': 'stun:stun.ekiga.net'
    }, {
      'url': 'stun:stun.fwdnet.net'
    }, {
      'url': 'stun:stun.ideasip.com'
    }, {
      'url': 'stun:stun.iptel.org'
    }, {
      'url': 'stun:stun.rixtelecom.se'
    }, {
      'url': 'stun:stun.schlund.de'
    }, {
      'url': 'stun:stun1.l.google.com:19302'
    }, {
      'url': 'stun:stun2.l.google.com:19302'
    }, {
      'url': 'stun:stun3.l.google.com:19302'
    }, {
      'url': 'stun:stun4.l.google.com:19302'
    }, {
      'url': 'stun:stunserver.org'
    }, {
      'url': 'stun:stun.softjoys.com'
    }, {
      'url': 'stun:stun.voiparound.com'
    }, {
      'url': 'stun:stun.voipbuster.com'
    }, {
      'url': 'stun:stun.voipstunt.com'
    }, {
      'url': 'stun:stun.voxgratia.org'
    }, {
      'url': 'stun:stun.xten.com'
    }]
    // {
    //   'url': 'turn:numb.viagenie.ca',
    //   'credential': 'muazkh',
    //   'username': 'webrtc@live.com'
    // }, {
    //   'url': 'turn:192.158.29.39:3478?transport=udp',
    //   'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    //   'username': '28224511:1379330808'
    // }, {
    //   'url': 'turn:192.158.29.39:3478?transport=tcp',
    //   'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
    //   'username': '28224511:1379330808'
    // }]
};
