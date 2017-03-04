var CBaseWorker = function () {
    var self = this;
    addEventListener('message', function (e) {
        var data = e.data;

        var event = data.event;
        var params = data.data;

        if (self[event]) {

            if (L[event]) {
                L[event](self, self[event], params);
            } else {
                self[event](params);
            }
        } else {
            self.log(["Not found method ", data.event, data.data]);
        }

    }, false);

    this.postMessage = function (event, data) {
        postMessage({event: event, data: data});
    };
    this.log = function (data) {
        self.postMessage("log", data);
    };
};

importScripts('/socket.io/socket.io.js');

var module = {exports: {}};
importScripts('lib/extend.js');
// var extend = function (o1, o2) {
//     return $.extend(o1, o2);
// };

importScripts('../../GeneralClass/const.js');

var rules = {
    rulesMovement: function (obj, newPos) {
        obj.position = newPos
        var isColision = false;
        return isColision;
    }
};
var helper = {
    cutInObj: function (obj, field) {
        var res = {};
        for (var i = 0; i < field.length; i++) {
            var key = field[i];
            res[key] = obj[key];
        }
        return res;
    },
};

var socket = io.connect('/');

var EnumDirection = module.exports.EnumDirection;

var Clouncher = function () {
    this.setActiveKey = function (obj, f, data) {
        f.call(obj, data.action, data.value);
    };
    this.init = function (delayCompensator, f, data) {
        //delayCompensator.position = data.position;
        delayCompensator.setActivat(false);
        data.activeKey = delayCompensator.activeKey;
        extend(delayCompensator, data);

        // delayCompensator.init();
        delayCompensator.setActivat(true);
    };
    this.onUpdateDataItem = function (delayCompensator, f, data) {
        if (data.id == delayCompensator.id) {
            //extend(delayCompensator, data);
            delayCompensator.position = data.position;
            delayCompensator.direction = data.direction;

        }
        delayCompensator.postMessage("onUpdateDataItem", data);

    };

};
var L = new Clouncher();

var DelayCompensator = function () {
    CBaseWorker.apply(this, arguments);
    this.position = {x: 30, y: 30};
    this.positionShift = 5;
    this.direction = EnumDirection.top;
    this.speed = 20;
    this.timeIntervalMove = 200;
    this.timeIntervalFire = 200;

    this.delayBetweenShots = 300;

    this.IntervalIdActionMove = null;
    this.IntervalIdActionFire = null;
    this.activeKey = {top: 'OnTop', bottom: 'OnBottom', left: 'OnLeft', right: 'OnRight', fire: 'OnFire'};
    this.init = function () {
        this.initActiveKey();
    };
    this.onUpdateDataItem = function () {


    };
    this.initActiveKey = function () {
        for (var key in this.activeKey) {
            var set = {active: false, timePress: 0, timeLastCall: 0};
            set.On = this.getHandler(this[this.activeKey[key]]);
            this.activeKey[key] = set;
        }
    };

    this.getHandler = function (func, arg) {
        var self = this;
        return function () {
            arguments = arg || arguments;
            func.apply(self, arguments);
        };
    };
    this.setActiveKey = function (action, value) {
        if (this.activeKey[action]) {
            this.activeKey[action].active = value;
            if (value) {
                this.activeKey[action].timePress = new Date().getTime();
                this.checkStateActiveKey(action);
            }
        }
    };
    this.checkStateActiveKey = function (action) {
        if (this.isActive) {
            if (action === "fire") {
                this.callActionFire();
                this.reStartIntervalFire();
            } else {
                if (!this.isMuving) {
                    this.callActionMove();
                    this.reStartIntervalMove();
                }
            }
        }
    };
    this.isActive = false;
    this.reStartIntervalMove = function () {
        if (this.isActive) {
            clearInterval(this.IntervalIdActionMove);
            this.IntervalIdActionMove = setInterval(this.getHandler(this.callActionMove), this.timeIntervalMove);
        } else {
            this.clearInterval(this.IntervalIdActionMove);
        }
    };
    this.reStartIntervalFire = function () {
        if (this.isActive) {
            clearInterval(this.IntervalIdActionFire);
            this.IntervalIdActionFire = setInterval(this.getHandler(this.callActionFire), this.timeIntervalFire);
        } else {
            this.clearInterval(this.IntervalIdActionFire);
        }
    };
    this.clearInterval = function (intId) {
        clearInterval(intId);
        intId = null;
    };
    this.setActivat = function (value) {
        this.isActive = value;
        if (this.isActive) {
            this.render();
            this.reStartIntervalMove();
            this.reStartIntervalFire();


        } else {
            this.clearInterval(this.IntervalIdActionMove);
            this.clearInterval(this.IntervalIdActionFire);
        }
    };
    this.callActionFire = function () {

        var action = "fire";
        if (this.activeKey[action].active) {
            var data = +new Date();
            if (this.activeKey[action].timeLastCall + this.delayBetweenShots <= data) {
                this.runActivKey(action);
            }
        }
    };
    this.isMuving = false;
    this.callActionMove = function () {
        var actionMove = false;
        for (var action in this.activeKey) {
            if (this.activeKey[action].active && action != "fire") {

                //&& this.activeKey[action].timePress > this.activeKey[action].timeLastCall

                if (!actionMove || this.activeKey[action].timePress > this.activeKey[actionMove].timePress) {
                    actionMove = action;


                }


            }
        }

        if (actionMove) {

            this.isMuving = true;
            this.runActivKey(actionMove);


            this.render();
        } else {
            this.isMuving = false;
        }

    };
    var self = this;
    this.counter = new CCounter(1000);
    this.counter.onEndTimeStamp = function (c, d) {
        self.log("Выполнился " + c + " раз за " + d + " ms");
    };
    this.runActivKey = function (action) {

        this.activeKey[action].timeLastCall = new Date().getTime();
        this.activeKey[action].On();
        //var data = extend({}, {}, this.activeKey[action]);
        //data.On = null;
        this.counter.count();
        var data = {};
        data.action = action;
        this.postMessage("runActivKey", data);
    };
    this.setDirection = function (action) {
        this.direction = action;
        return true;

    };
    this.onMove = function () {

    };


    this.render = function () {
        this.postMessage("updatePosition", helper.cutInObj(this, ["id", "position", "direction"]));
    };
    this.rulesMovement = function (newPos) {
        var oldPos = extend({}, this.position);
        if (!rules.rulesMovement(this, newPos)) {
            // колизий в правилах не было
            this.onMove(this, oldPos, newPos);
        }
    };
    this.OnTop = function () {
        //console.log("вверх");
        if (this.setDirection(EnumDirection.top)) {
            var newPos = extend({}, this.position);
            newPos.y -= this.speed;
            this.rulesMovement(newPos);
        }
        //this.callEvent(this.onTop);
    };
    this.OnBottom = function () {
        //console.log("вниз");
        if (this.setDirection(EnumDirection.bottom)) {
            var newPos = extend({}, this.position);
            newPos.y += this.speed;
            this.rulesMovement(newPos);
        }

        //this.callEvent(this.onBottom);
    };
    this.OnLeft = function () {
        //console.log("влво");
        if (this.setDirection(EnumDirection.left)) {
            var newPos = extend({}, this.position);
            newPos.x -= this.speed;
            this.rulesMovement(newPos);
        }
        //this.callEvent(this.onLeft);
    };
    this.OnRight = function () {
        //console.log("впрво");
        if (this.setDirection(EnumDirection.right)) {
            var newPos = extend({}, this.position);
            newPos.x += this.speed;
            this.rulesMovement(newPos);
        }
        //this.callEvent(this.onRight);
    };
    this.OnFire = function () {

    };
    this.init();
};

// Наследование
DelayCompensator.prototype = Object.create(CBaseWorker.prototype);
DelayCompensator.prototype.constructor = DelayCompensator;


var CCounter = function (stamp) {
    var _count = 0;
    var _time = null;
    this.count = function () {
        _count++;
        if (_time) {
            var now = new Date().getTime();
            var dif = now - _time;
            if (stamp < dif) {
                _time = now;
                this.onEndTimeStamp(_count, dif);
                _count = 0;
            }
        } else {
            _time = new Date().getTime();
        }
    };
    this.onEndTimeStamp = function (count, dif) {

    };
};


var delayCompensator = new DelayCompensator();