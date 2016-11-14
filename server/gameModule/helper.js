var EnumBarrier = require('./../GeneralClass/const.js').EnumBarrier;
var extend = require('extend');
var generator = require('./idGenerator.js');

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
    collision: function (obj1, obj2) {
        var XColl = false;
        var YColl = false;

        if ((obj1.position.x + obj1.width > obj2.position.x) && (obj1.position.x < obj2.position.x + obj2.width))
            XColl = true;
        if ((obj1.position.y + obj1.height > obj2.position.y) && (obj1.position.y < obj2.position.y + obj2.height))
            YColl = true;

        if (XColl & YColl) {
            return true;
        }
        return false;
    },

    macroCollision: function (obj1, obj2, newPosObj2) {
        return this.collision(obj1, {
            width: obj2.width,
            height: obj2.height,
            position: {x: newPosObj2.x, y: newPosObj2.y}
        });
        // var XColl = false;
        // var YColl = false;
        //
        // if ((obj1.position.x + obj1.width > newPosObj2.x) && (obj1.position.x < newPosObj2.x + obj2.width))
        //     XColl = true;
        // if ((obj1.position.y + obj1.height > newPosObj2.y) && (obj1.position.y < newPosObj2.y + obj2.height))
        //     YColl = true;
        //
        // if (XColl & YColl) {
        //     return true;
        // }
        // return false;
    },
    cutInObj: function (obj, field) {
        var res = {};
        for (var i = 0; i < field.length; i++) {
            var key = field[i];
            res[key] = obj[key];
        }
        return res;
    },
    cutInObjFromArr: function (arr, field) {
        var res = [];
        for (var i in arr) {
            res.push(this.cutInObj(arr[i], field));
        }
        return res;
    },
    createCellOfMap: function (x, y, type) {
        type = type || EnumBarrier.default;
        var id = generator.getID();
        return {id: id, cellX: x, cellY: y, type: type};
    },
    createActiveKey: function (set) {
        var t = {active: false, timePress: 0, timeLastCall: 0};
        extend(t, set);
        return t
    },
    getObjFromArr: function (arr, where) {

        var func = function (item) {
            return item.id == where;
        };

        if (typeof where == "function") {
            func = where;
        }
        for (var i in arr) {
            if (func(arr[i])) {
                return arr[i];
            }
        }
    }


};
