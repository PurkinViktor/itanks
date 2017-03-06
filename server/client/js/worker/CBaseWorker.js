var CBaseWorker = function (adapter) {
    adapter = adapter || {};
    var self = this;
    addEventListener('message', function (e) {
        var data = e.data;

        var event = data.event;
        var params = data.data;

        if (self[event]) {

            if (adapter[event]) {
                var f = self[event];
                f.eventName = event;
                adapter[event](self, f, params);
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