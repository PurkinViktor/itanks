importScripts('./CBaseWorker.js');
importScripts('./CCounter.js');
//importScripts('./CAdapter.js');
importScripts('../../../GeneralClass/helper.js');
importScripts('../../../GeneralClass/rules.js');
importScripts('../../../GeneralClass/idGenerator.js');
importScripts('../../../GeneralClass/CEnum.js');
// importScripts('./rules.js');

importScripts('../lib/extend.js');
importScripts('../lib/CEvent.js');



var module = {exports: {}};
importScripts('../../../GeneralClass/const.js');

importScripts('/socket.io/socket.io.js');
//var socket = io.connect('/');

var EnumDirection = module.exports.EnumDirection;
var EnumBarrier = module.exports.EnumBarrier;

importScripts('./CPingManager.js');
importScripts('./CTankControl.js');
importScripts('./CTransportWorker.js');


importScripts('./CITanksClient.js');
var iTanksClient = new CITanksClient();

// var CManager = function (louncher) {
//     CBaseWorker.apply(this, arguments);
//
// };
//
// CManager.prototype = Object.create(CBaseWorker.prototype);
// CManager.prototype.constructor = CManager;
// var manager = new CManager(new CAdapter());
