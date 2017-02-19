var pingWorker = {};

addEventListener('message', function (e) {
    var data = e.data;

    postMessage({"получил": data});
}, false);