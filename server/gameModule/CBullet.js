var extend = require('extend');
var CEvent = require('./CEvent.js');
var CTank = require('./CTank.js');
var EnumDirection = require('./../GeneralClass/const.js').EnumDirection;
var rules = require('./../GeneralClass/rules.js');
var EnumBarrier = require('./../GeneralClass/const.js').EnumBarrier;
var generator = require('./../GeneralClass/idGenerator.js');

var CBullet = function (settings, tank) {
    this.id = generator.getID();
    settings.ownerId = tank.id;
    settings.teamId = tank.teamId;
    settings.position = extend({}, tank.position);
    //settings.position.x += Math.floor((tank.width - 15) / 2);
    settings.direction = tank.direction;

    var renderingSystem = settings.renderingSystem;// отправляет данные о обьекте между клиентами игры

    settings = settings || {};
    this.width = 8;
    this.height = 10;
    this.position = settings.position || {x: 30, y: 30};
    this.direction = settings.direction;
    this.speed = 16;
    this.intervalId = null;
    this.timeInterval = 50;


    this.ownerId = settings.ownerId;
    this.teamId = settings.teamId;


    this.typeObject = ["bullet"];//

    //this.removeBullet
    //this.onDestroy = null;
    this.onHit = new CEvent();
    var self = this;
    this.rules = function (newPos) {
        //var self = this;
        if (rules.battleAreaRule(this, this.position)) {
            if (this.onHit) {
                this.onHit(this);
            }
        } else {
            var hitInBullet = rules.rulesMovementBullet(this, this.position, this.ownerId);
            if (hitInBullet) {
                if (this.onHit) {
                    this.onHit(this, hitInBullet);
                }
                return;
            }

            var exeptionsTank = function (tank) {
                return tank.teamId == self.teamId;
            };
            var hitInTank = rules.rulesMovementTank(this, this.position, this.ownerId, exeptionsTank);
            if (hitInTank) {
                if (this.onHit) {
                    this.onHit(this, hitInTank);
                }
                return;
            }


            function exceptionsBarriers(bar) {
                return bar.type === EnumBarrier.water || bar.type === EnumBarrier.forest;
            }

            var arrBarriers = rules.rulesBarriers(this, this.position, exceptionsBarriers);

            if (arrBarriers.length > 0) {
                var barrier = arrBarriers[0];
                if (barrier.teamId !== self.teamId) {
                    // если барьер не своей команды то уничтожаем его
                    var areaBlast = this.areaBlast();
                    arrBarriers = rules.rulesBarriers(areaBlast, areaBlast.position, exceptionsBarriers);
                    for (var i in arrBarriers) {

                        arrBarriers[i].hit();
                    }
                }
                if (this.onHit) {
                    this.onHit(this);
                }
                return;
            }
        }

        this.position = newPos;
    };

    this.areaBlast = function () {
        var tempBullet = {position: {}};
        tempBullet.position.x = this.position.x;
        tempBullet.position.y = this.position.y;
        tempBullet.height = this.height;
        tempBullet.width = this.width;

        var delta = CTank.width;
        if (this.direction === EnumDirection.left || this.direction === EnumDirection.right) {
            var newH = delta;
            var y = Math.floor((newH - tempBullet.height) / 2);
            tempBullet.height = newH;
            tempBullet.position.y -= y;
            //console.log(tempBullet);

        }
        if (this.direction === EnumDirection.top || this.direction === EnumDirection.bottom) {
            var newW = delta;
            var x = Math.floor((newW - tempBullet.width + 2) / 2);
            tempBullet.width = newW;
            tempBullet.position.x -= x;
            //console.log(tempBullet);

        }
        return tempBullet;
    };
    this.hit = function () { // походу используется только тогда когда снаряд в снаряд попадает
        if (this.onHit) {// типа врезался в когото но никого не убил типа в стенку
            this.onHit(this);
        }

    };
    this.callAction = function () {
        var newPos = extend({}, this.position);
        switch (this.direction) {
            case EnumDirection.top:
                newPos.y -= this.speed;
                break;
            case EnumDirection.bottom:
                newPos.y += this.speed;
                break;
            case EnumDirection.left:
                newPos.x -= this.speed;
                break;
            case EnumDirection.right:
                newPos.x += this.speed;
                break;
        }
        this.rules(newPos);
        this.render();
    };
    this.render = function () {
        renderingSystem.renderItem(this);
    };
    this.destroy = function () {
        //var self = this;
        clearInterval(this.intervalId);
        renderingSystem.destroyItem(this);
//		if (this.onDestroy) {
//			this.onDestroy();
//		}

//		setTimeout(function() {
//			game.removeBullet(self);
//		}, 100);
        //

    };
    this.getHandler = function (func) {
        var self = this;
        return function () {
            func.apply(self, arguments);
        };
    };
    this.init = function () {
        this.durationAnimate = this.timeInterval;
        this.initPosition();
        this.render();
        this.intervalId = setInterval(this.getHandler(this.callAction), this.timeInterval);


    };
    this.initPosition = function () {
        if (this.direction === EnumDirection.top || this.direction === EnumDirection.bottom) {
            this.position.x += Math.floor((tank.width - this.width) / 2);
        }
        if (this.direction === EnumDirection.left || this.direction === EnumDirection.right) {
            this.position.y += Math.floor((tank.height - this.height) / 2);
        }
        if (this.direction === EnumDirection.bottom) {
            this.position.y += Math.floor((tank.height));//- this.width
        }
        if (this.direction === EnumDirection.right) {
            this.position.x += Math.floor((tank.width));//- this.width
        }
    };

    this.init();


};

// var renderingSystem = { // заглушка
//     renderItem: function () {
//
//     },
//     destroyItem: function () {
//
//     }
//
// };
module.exports = CBullet;