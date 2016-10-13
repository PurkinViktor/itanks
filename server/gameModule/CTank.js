var EnumDirection = require('./../GeneralClass/const.js').EnumDirection;
var CEvent = require('./CEvent.js');
var helper = require('./helper.js');
var extend = require('extend');
var rules = require('./rules.js');
var CBullet = require('./CBullet.js');


var CTank = function (settings) {
    var callee = arguments.callee;

    var renderingSystem = settings.renderingSystem;

    settings = settings || {};
    this.name = settings.name;
    this.ownerId = settings.ownerId;
    this.width = settings.width || callee.width;
    this.height = settings.height || callee.height;
    this.position = settings.position || {x: 30, y: 30};
    this.direction = EnumDirection.top;
    this.speed = 5;
    this.delayBetweenShots = 300;

    this.onFire = new CEvent();
    this.onKill = new CEvent();// было без new
    this.onHit = new CEvent();

    this.onTop = null;
    this.onBottom = null;
    this.onLeft = null;
    this.onRight = null;
    this.typeObject = settings.typeObject || ["plaerTank", "plaerTank_"];

    this.bullets = [];
    this.countBullet = settings.countBullet || 1;// одновременных выстрелов
    this.timeInterval = 50;
    this.actionIntervalId = null;
    this.destroy = function () {
        this.setActivat(false);
        renderingSystem.destroyItem(this);
    };
    //this.testAray = new Array(1200000000);
    this.init = function () {
        this.durationAnimate = this.timeInterval;
        this.initActiveKey();

    };
    this.isActive = false;
    this.setActivat = function (value) {
        this.isActive = value;
        if (this.isActive) {
            this.render();
            this.actionIntervalId = setInterval(this.getHandler(this.callAction), this.timeInterval);
        } else {
            clearInterval(this.actionIntervalId);
            this.actionIntervalId = null;
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
    this.onRender = settings.onRender || new CEvent();
    this.render = function () {
        this.onRender(this);
        //this.renderingSystem.renderItem(this);


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
        this.direction = action;
        return false;
    };
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

        this.callEvent(this.onHit, [this, bullet]);

        if (this.hp === 0) {
            this.isKill = true;
            this.callEvent(this.onKill, [this, bullet]);
        }
    };
    //this.onMove = new CEvent();
    this.rulesMovement = function (newPos) {
        if (!rules.rulesMovement(this, newPos)) {
            // колизий в правилах не было
            //this.onMove(this);
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
        this.activeKey[action].active = value;
        if (value) {
            this.activeKey[action].timePress = +new Date();
        }
    };
    this.callAction = function () {

        var actionMove = false;
        for (var action in this.activeKey) {
            if (this.activeKey[action].active || this.activeKey[action].timePress > this.activeKey[action].timeLastCall) {
                if (action === "fire") {
                    var data = +new Date();
                    if (this.activeKey[action].timeLastCall + this.delayBetweenShots <= data) {
                        this.runActivKey(action);
                    }

                } else {
                    if (!actionMove || this.activeKey[action].timePress > this.activeKey[actionMove].timePress) {
                        actionMove = action;
                    }
                }
            }
        }

        if (actionMove) {
            this.runActivKey(actionMove);
            this.render();
        }
    };
    this.runActivKey = function (action) {
        this.activeKey[action].On();
        this.activeKey[action].timeLastCall = +new Date();
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

module.exports = CTank;