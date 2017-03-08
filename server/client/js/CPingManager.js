var CPingManager = function () {
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

        //transportClient.send("ping", data);
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

       // transportClient.on('ping', this.onPing);

        this.idInterval.start(this.sendPing, 1000);

    };
    this.init();
};

var CInterval = function (contecst) {
    this.id = null;
    this.onCall = new CEvent();
    this.start = function (f, sleep) {
        this.onCall.bind(f, contecst);
        this.id = setInterval(this.onCall, sleep);
    };
    this.stop = function () {
        clearTimeout(this.id);
    };
};