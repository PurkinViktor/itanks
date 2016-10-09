module.exports.EnumDirection = {
    top: 0,
    bottom: 1,
    left: 2,
    right: 3
};

module.exports.EnumBarrier = {
    default: 0,
    armor: 1,
    water: 2,
    forest: 3,
    igl: 4,
    getClass: function (type) {
        var classes = ["default", "armor", "water", "forest", "igl"];
        var pref = "barrier";
        if (classes[type]) {
            return pref + " " + classes[type];
        } else
            return classes[0];
    }
};