var EnumBarrier = require('./../GeneralClass/const.js').EnumBarrier;
var extend = require('extend');

module.exports = {
    randInt: function (min, max) {
        return Math.floor((Math.random() * max) + min);
    },
    getRandPosition: function (minX, maxX, minY, maxY) {
        var randInt = this.randInt;
        var pos = {x: randInt(minX, maxX), y: randInt(minY, maxY)};
        return pos;
    },
    findObjByWhere: function (arr, where) {
        for (var key in arr) {
            var obj = arr[key];
            if (where(obj)) {
                return obj;
            }
        }
    },
    macroCollision: function (obj1, obj2, newPosObj2) {
        var XColl = false;
        var YColl = false;

        if ((obj1.position.x + obj1.width > newPosObj2.x) && (obj1.position.x < newPosObj2.x + obj2.width))
            XColl = true;
        if ((obj1.position.y + obj1.height > newPosObj2.y) && (obj1.position.y < newPosObj2.y + obj2.height))
            YColl = true;

        if (XColl & YColl) {
            return true;
        }
        return false;
    },
    cutInObj: function (obj, field) {
        var res = {};
        for (var i = 0; i < field.length; i++) {
            var key = field[i];
            res[key] = obj[key];
        }
        return res;
    },
    createCellOfMap: function (x, y, type) {
        type = type || EnumBarrier.default;
        return {cellX: x, cellY: y, type: type};
    },
    createActiveKey: function (set) {
        var t = {active: false, timePress: 0, timeLastCall: 0};
        extend(t, set);
        return t
    }


};
