var CWorker = function (fileJS, set) {
    var self = this;
    this.worker = new Worker(fileJS);
    this.worker.onerror = function (err) {
        console.error("CWorker ERR", err);
    };
    this.events = {};
    this.on = function (event, f, context) {
        var e = null;
        if (this.events[event]) {
            e = this.events[event];
        } else {
            e = new CEvent();
            this.events[event] = e;
        }

        e.bind(f, context);
    };
    this.worker.onmessage = function (e) {
        var event = e.data.event;
        var data = e.data.data;
        var f = self.events[event];
        if (f) {
            f(data);
        } else {
            console.log("Event did not regist", event, data);
        }
    };
    this.postMessage = function (event, data) {
        this.worker.postMessage({event: event, data: data});
    };

    this.on("log", function (data) {
        console.log(data);
    });
    // this.postMessage("test", {asdfsaf: "testovse datas"});
};