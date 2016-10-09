var module = {
    exports: {},
    init: function () {
        for(var k in this.exports){
            var objectModule = this.exports[k];
            window[k] = objectModule;
        }
    },
};
$(document).ready(function () {
    module.init();
});


// module.exports = {};