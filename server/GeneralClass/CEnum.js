var CEnum = function (aEnum) {
    this.init();

};
CEnum.prototype.init = function () {
    var keys = Object.keys(this);
    this.keys = {};
    for (var i in keys) {
        var key = keys[i];
        var value = this[key];
        var itemEnum = new CItemEnum(key, value);
        this[key] = itemEnum;
        this.keys[key] = itemEnum;
    }
};
CEnum.prototype.getEnumItems = function () {
    return this.keys;
};
CEnum.prototype.get = function (aValue) {
    var keys = Object.keys(this);
    for (var i in keys) {
        var key = keys[i];
        var value = this[key];

        if (aValue == value || aValue == value.toString()) {
            return value;
        }
        // this[key] = new CItemEnum(key, value);

    }
};


var CItemEnum = function (key, value) {
    this.key = key;
    this.value = value;
    this.valueOf = function () {
        return this.value;
    };
    this.toString = function () {
        return this.key;
    };
};


if (module && module.exports) {// подключается сервером
    module.exports = CEnum;
}