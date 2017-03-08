var EnumDirection = require('./../GeneralClass/const.js').EnumDirection;
var CEvent = require('./CEvent.js');
var helper = require('./../GeneralClass/helper.js');
var extend = require('extend');
var rules = require('./../GeneralClass/rules.js');
var CBullet = require('./CBullet.js');
var generator = require('./idGenerator.js');

var CTank = function (settings) {
    var callee = arguments.callee;
    this.id = generator.getID();

    var renderingSystem = settings.renderingSystem;

    settings = settings || {};
    this.name = settings.name;
    this.ownerId = settings.ownerId;
    this.teamId = settings.teamId;

    this.width = settings.width || callee.width;
    this.height = settings.height || callee.height;
    this.position = settings.position || {x: 30, y: 30};
    this.positionShift = 5;
    this.direction = EnumDirection.top;
    this.speed = 20;
    this.delayBetweenShots = 300;
    this.delayBetweenMove = 200;


    this.onFire = new CEvent();
    this.onKill = new CEvent();// было без new
    this.onHit = new CEvent();

    this.onTop = null;
    this.onBottom = null;
    this.onLeft = null;
    this.onRight = null;
    this.typeObject = settings.typeObject || ["plaerTank", "plaerTank_"];
    this.typeObject.push("playerTank");

    this.bullets = [];
    this.countBullet = 2;//settings.countBullet || 1;// одновременных выстрелов
    //this.timeInterval = 200;
    this.timeIntervalMove = 200;
    this.timeIntervalFire = 200;

    this.IntervalIdActionMove = null;
    this.IntervalIdActionFire = null;
    this.destroy = function () {
        this.setActivat(false);
        renderingSystem.destroyItem(this);
    };
    //this.testAray = new Array(1200000000);
    this.init = function () {
        this.durationAnimate = this.timeIntervalMove;
        this.initActiveKey();

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
            // this.reStartIntervalMove();
            // this.reStartIntervalFire();


        } else {
            // this.clearInterval(this.IntervalIdActionMove);
            // this.clearInterval(this.IntervalIdActionFire);
        }
    };
    this.keyHundler = settings.keyHundler || {};
    this.initActiveKey = function () {
        for (var key in this.activeKey) {
            var set = {};
            set.On = this.getHandler(this[this.activeKey[key]]);
            this.activeKey[key] = helper.createActiveKey(set);
        }
    };
    this.activeKey = {top: 'OnTop', bottom: 'OnBottom', left: 'OnLeft', right: 'OnRight', fire: 'OnFire'};
    //this.onRender = settings.onRender || new CEvent();
    this.render = function () {
        //this.onRender(this);
        renderingSystem.renderItem(this);
    };
    this.removeBullet = function (bullet) {
        //bullet.destroy();
        var index = this.bullets.indexOf(bullet);
        if (index >= 0) {
            bullet.destroy();
            this.bullets.splice(index, 1);
        }
    };
    this.setDirection = function (action) {
        if (this.direction == action) {

            return true;
        }

        var oldDirection = this.direction;
        this.direction = action;
        this.onChangeDirection(this, oldDirection, this.direction);
        return false;
    };
    this.onChangeDirection = new CEvent();
    this.onMove = new CEvent();
    this.OnFire = function () {
        //console.log("огонь");
        if (this.bullets.length < this.countBullet) {
            var setBullet = {renderingSystem: renderingSystem};
            var bullet = new CBullet(setBullet, this);
            bullet.onHit.bind(this.OnBulletHit, this);// = this.getHandler(this.OnBulletHit);


            this.bullets.push(bullet);
            this.onFire();
        }
    };
    this.OnBulletHit = function (bullet, target) {
        this.removeBullet(bullet);
        // анимация взрыва
        var set = {
            width: 20,
            height: 20,
            position: bullet.position,
            direction: bullet.direction,
            typeObject: ["explosion", "explosion1", "explosion2", "explosion3"]
        };
        renderingSystem.renderExplosion(set);

        if (target) {
            target.hit(bullet);
        }

    };


    this.hp = settings.hp || 1;
    this.hit = function (bullet) {// попадание в танк
        this.hp--;
        // this.timeIntervalMove -= 15;

        this.callEvent(this.onHit, [this, bullet]);

        if (this.hp === 0) {
            this.isKill = true;
            //this.callEvent(this.onKill, [this, bullet]);
            this.onKill(this, bullet);
        }
        this.render();
    };
    this.onMove = new CEvent();
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
    this.setActiveKey = function (action, value) {
        // if (this.activeKey[action]) {
        //     this.activeKey[action].active = value;
        //     if (value) {
        //         this.activeKey[action].timePress = new Date().getTime();
        //         this.checkStateActiveKey(action);
        //     }
        // }
    };
    this.checkStateActiveKey = function (action) {

        // if (action === "fire") {
        //     this.callActionFire();
        //     this.reStartIntervalFire();
        // } else {
        //     if (!this.isMuving) {
        //         this.callActionMove();
        //         this.reStartIntervalMove();
        //     }
        // }


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
    this.timeLastCallMovement = 0;
    this.timeLastPressMovement = 0;

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
            // var data = new Date().getTime();
            this.isMuving = true;
            this.runActivKey(actionMove);
            //this.runActivKey(actionMove);
            //this.timeLastPressMovement = this.activeKey[actionMove].timePress;
            //this.timeLastCallMovement = this.activeKey[actionMove].timeLastCall;


            //  this.render();
        } else {
            this.isMuving = false;
        }

    };
    this.runActivKey = function (action) {
        this.activeKey[action].On();
        this.activeKey[action].timeLastCall = new Date().getTime();
        if (action != "fire") {
            this.render();
        }
    };
    this.getHandler = function (func, arg) {
        var self = this;
        return function () {
            arguments = arg || arguments;
            func.apply(self, arguments);
        };
    };
    ///////// приватные
    this.callEvent = function (event, arg) {
        if (event) {
            arg = arg || [];
            event.apply(this, arg);
        }
    };
    ////// вызов
    this.init();
};
// var renderingSystem = { // заглушка
//     renderItem: function () {
//
//     },
//     destroyItem: function () {
//
//     },
//     renderExplosion: function () {
//
//     },
//
// };
CTank.height = 30;
CTank.width = 30;
module.exports.height = 30;
module.exports.width = 30;

module.exports = CTank;