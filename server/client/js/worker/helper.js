var helper = {
    cutInObj: function (obj, field) {
        var res = {};
        for (var i = 0; i < field.length; i++) {
            var key = field[i];
            res[key] = obj[key];
        }
        return res;
    },
};