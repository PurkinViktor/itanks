if (module && module.require) { // значит подключается сервером
    var CEnum = require('./CEnum.js');
}

var CEnumTypePath = function () {


    this.MIN = 0;
    this.RND = 1;
    this.AVR = 2;
    this.MAX = 3;

    CEnum.apply(this, arguments);
};
CEnumTypePath.prototype = Object.create(CEnum.prototype);
CEnumTypePath.prototype.constructor = CEnumTypePath;

var EnumTypePath = new CEnumTypePath();


if (module && module.exports) {// подключается сервером
    module.exports = EnumTypePath;
}