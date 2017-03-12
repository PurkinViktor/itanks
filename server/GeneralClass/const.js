if (module && module.require) { // значит подключается сервером
    var CEnum = require('./CEnum.js');
}

var EnumDirection = {
    top: 0,
    bottom: 1,
    left: 2,
    right: 3
};


var CEnumBarrier = function () {


    this.default = 0;
    this.armor = 1;
    this.water = 2;
    this.forest = 3;
    this.igl = 4;
    CEnum.apply(this, arguments);

    this.getClass = function (type) {
        var classes = ["default", "armor", "water", "forest", "igl"];
        var pref = "barrier";
        var style =classes[+type];
        if (style) {
            return pref + " " + style;
        } else
            return classes[0];
    };


};
CEnumBarrier.prototype = Object.create(CEnum.prototype);
CEnumBarrier.prototype.constructor = CEnumBarrier;

var EnumBarrier = new CEnumBarrier();

if (module && module.exports) {// подключается сервером


    module.exports.EnumBarrier = EnumBarrier;
    module.exports.EnumDirection = EnumDirection;
}

// {
//     default: 0,
//     armor: 1,
//     water: 2,
//     forest: 3,
//     igl: 4,
//     getClass: function (type) {
//     var classes = ["default", "armor", "water", "forest", "igl"];
//     var pref = "barrier";
//     if (classes[type]) {
//         return pref + " " + classes[type];
//     } else
//         return classes[0];
// }
// };