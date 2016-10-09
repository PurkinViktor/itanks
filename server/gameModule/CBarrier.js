var EnumBarrier = require('./../GeneralClass/const.js').EnumBarrier;
var CEvent = require('./CEvent.js');
// var extend = require('./node_modules/extend');
var extend = require('extend');
var helper = require('./helper.js');

var CBarrier = function (set) {
    var callee = arguments.callee;

    this.width = callee.width;
    this.height = callee.height;
    this.position = {x: 30, y: 30};
    this.typeObject = ["barrier"];
    //this.classes = ["barrier"];

    this.type = EnumBarrier.default;
    this.init = function () {
        extend(this, set);
        this.typeObject = [EnumBarrier.getClass(this.type)];
        this.position.x = this.cellX * this.width;
        this.position.y = this.cellY * this.height;

    };
    this.onHit = new CEvent();// походу пока не использую
    //this.onKill = null;
    this.onDestroy = new CEvent();
    this.destroy = function () {
        if (this.onDestroy) {
            this.onDestroy(this);
        }
    };
    this.hit = function (bullet) {
        if (this.onHit) {
            this.onHit(this, bullet);
        }
        if (this.type === EnumBarrier.default || this.type === EnumBarrier.igl) {
            this.destroy();
        }

//		if (this.onKill) {
//			this.onKill(this, bullet);
//		}

    };
    this.init();

};
CBarrier.create = function (x, y, type) {
    return helper.createCellOfMap(x, y, type);
};
CBarrier.width = 20;
CBarrier.height = 20;
module.exports = CBarrier;
