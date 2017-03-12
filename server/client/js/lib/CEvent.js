var CEvent = function () {
    var f = function () {
        for (var i in arguments.callee.arr) {
            var set = arguments.callee.arr[i];
            var preventDef = set.callBack.apply(set.contect, arguments);
            if (preventDef === false) {
                break;
            }
        }

    };
    f.arr = {};
    var index = 0;
    f.bind = function (callBack, contect) {
        index++;
        f.arr[index] = {callBack: callBack, contect: contect};
        callBack.index = index;
        return index;
    };
    f.unBind = function (index) {
        if (typeof index === "function") {
            for (var i in f.arr) {
                if (f.arr[i].callBack == index) {
                    delete f.arr[i];
                }
            }
        } else {
            if (f.arr[index]) {
                delete f.arr[index];
            }
        }
    };
    f.clear = function () {
        for (var i in f.arr) {
            delete f.arr[i];
        }
    };
    f.getHandler = function () {
        var args = [];
        for (var i in arguments) {
            args.push(arguments[i]);
        }
        return function () {
            for (var i in arguments) {
                args.push(arguments[i]);
            }
            f.apply({}, args);
        };
    };
    return f;
};