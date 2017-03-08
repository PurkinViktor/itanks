var EnumBarrier = require('./../GeneralClass/const.js').EnumBarrier;
var CEvent = require('./CEvent.js');
var CBarrier = require('./CBarrier.js');
// var extend = require('./node_modules/extend');
var extend = require('extend');
var helper = require('./../GeneralClass/helper.js');

// 2. Конструктор CIgl
var CIgl = function (set, renderingSystem) {
    var igl = new CBarrier(set);
    igl.onKilled = new CEvent();
    igl.hit = function (bullet) {
        if (this.onHit) {
            this.onHit(this, bullet);
        }
        this.typeObject.push("killed");
        renderingSystem.renderItem(this);
        this.onKilled(this);
    };
    return igl;
};

// 2.1. Наследование
//CIgl.prototype = Object.create(CBarrier.prototype);
//CIgl.prototype.constructor = CIgl;
module.exports = CIgl;
