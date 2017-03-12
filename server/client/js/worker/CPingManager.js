var CPingManager = function (transportClient) {//
    // this.render = function () {
    //
    // };
    this.maxPing = 0;
    this.minPing = 10000000;
    this.ping = 0;
    this.averagePing = 0;
    this.arrPing = [];
    this.index = 0;
    this.countPingForAverageValue = 250;
    this.sendPing = function () {
        var data = {timeSend: new Date().getTime()};
        data.index = this.index++;
        this.arrPing[data.index] = data;

        if (this.index > this.countPingForAverageValue) {
            this.index = 0;
        }

        transportClient.send("CPingManager.sendPing", data);
    };
    var self = this;
    this.idInterval = new CInterval(this);
    this.recivePing = function (data) {
        data.timeRecive = new Date().getTime();
        data.ping = data.timeRecive - data.timeSend;
        this.arrPing[data.index] = data;

        this.ping = data.ping;
        if (this.maxPing < this.ping) {
            this.maxPing = this.ping
        }
        if (this.minPing > this.ping) {
            this.minPing = this.ping
        }

        var s = 0;
        var count = 0;
        for (var i in this.arrPing) {
            var p = this.arrPing[i];
            s = s + p.ping;
            count++;
        }
        this.averagePing = (s / count).toFixed(3);

    };
    this.onPing = new CEvent();
    this.onPing.bind(this.recivePing, this);
    this.init = function () {
        transportClient.on('CPingManager.onPing', this.onPing);
        this.idInterval.setSettings(this.sendPing, 1000);
        this.start();

    };
    this.start = function () {
        this.idInterval.start();
    };
    this.stop = function () {
        this.idInterval.stop();
    };
    this.init();
};

var CInterval = function (contecst) {
    this.id = null;
    this.onCall = new CEvent();
    this.intervalTime = 0;
    this.setSettings = function (f, sleep) {
        this.intervalTime = sleep;
        this.onCall.bind(f, contecst);
    };
    this.start = function () {
        this.stop();
        this.id = setInterval(this.onCall, this.intervalTime);
    };
    this.stop = function () {
        clearTimeout(this.id);
    };
};