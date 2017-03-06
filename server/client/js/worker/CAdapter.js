var CAdapter = function () {
    this.setActiveKey = function (obj, f, data) {
        f.call(obj, data.action, data.value);
    };
    this.init = function (delayCompensator, f, data) {
        //delayCompensator.position = data.position;
        delayCompensator.setActivat(false);
        data.activeKey = delayCompensator.activeKey;
        extend(delayCompensator, data);

        // delayCompensator.init();
        delayCompensator.setActivat(true);
    };
    this.onUpdateDataItem = function (delayCompensator, f, data) {
        if (data.id == delayCompensator.id) {
            //extend(delayCompensator, data);
            delayCompensator.position = data.position;
            delayCompensator.direction = data.direction;

        }
        //"onUpdateDataItem"
        delayCompensator.postMessage(f.eventName, data);
    };

};