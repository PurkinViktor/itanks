var helper = require('./helper.js');
var transportGame = require('./transportGame.js');

module.exports = function (game) {
    this.game = game;
    //this.nameGame;
    this.renderItem = function (item) {

        //var socketId = tank.ownerId;

        var data = helper.cutInObj(item, ["id", "name", "ownerId", "width", "height", "position", "direction", "speed", "typeObject"]);
        // var d = new Date();
        // console.log("renderItem  ", data.position, d, " ", d.getMilliseconds());


        transportGame.sendUpdateDataItem(this.game.nameGame, data);
    };
    this.destroyItem = function () {

    };
    this.renderExplosion = function () {

    };
};