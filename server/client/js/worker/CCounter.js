var CCounter = function (stamp) {
    var _count = 0;
    var _time = null;
    this.count = function () {
        _count++;
        if (_time) {
            var now = new Date().getTime();
            var dif = now - _time;
            if (stamp < dif) {
                _time = now;
                this.onEndTimeStamp(_count, dif);
                _count = 0;
            }
        } else {
            _time = new Date().getTime();
        }
    };
    this.onEndTimeStamp = function (count, dif) {

    };
};
