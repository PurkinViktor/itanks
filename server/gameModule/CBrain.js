var helper = require('./helper.js');

var CBrain = function (settings) {
    this.intervalId = null;
    this.timeInterval = 800;
    this.init = function () {
        this.setActivat(true);
    };
    this.setActivat = function (value) {
        if (value) {
            clearInterval(this.intervalId);
            this.intervalId = setInterval(this.getHandler(this.callAction), this.timeInterval);
        }
        else {
            clearInterval(this.intervalId);
        }

    };
    this.destroy = function () {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.tank = null;
    };
    this.tank = settings.tank || null;
    this.keyHundler = {1: "top", 2: "bottom", 3: "left", 4: "right", 5: "fire"};
    this.callAction = function () {
        if (!this.tank.isKill) {
            var action = this.keyHundler[helper.randInt(1, 5)];
            this.tank.setActiveKey(action, !this.tank.activeKey[action].active);

            //this.tank.callAction();
        } else {
            this.destroy();
        }
    };
    this.qqqq = function () {

    };
    this.getHandler = function (func) {
        var self = this;
        return function () {
            func.apply(self, arguments);
        };
    };
    this.init();
};

module.exports = CBrain;