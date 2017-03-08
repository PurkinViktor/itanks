var helper = require('./../GeneralClass/helper.js');
var transportGame = require('./transportGame.js');

module.exports = function (game) {
    this.game = game;
    //this.nameGame;
    this.renderItem = function (item) {

        //var socketId = tank.ownerId;

        //var data = helper.cutInObj(item, ["id", "name", "ownerId", "width", "height", "position", "direction", "speed", "typeObject"]);
        // var d = new Date();
        // console.log("renderItem  ", data.position, d, " ", d.getMilliseconds());

        item.getListFielsForSend = function () {
            return ["id", "position", "direction"];
        };
        this.sendRequest(transportGame.sendUpdateDataItem, item);
        item.getListFielsForSend = this.getListFielsForSend;
        this.sendRequest(transportGame.sendUpdateDataItem, item);
        // transportGame.sendUpdateDataItem(this.game.nameGame, data);
        // transportGame.sendData(data);
    };
    this.getListFielsForSend = function () {
        return ["id", "teamId", "hp", "timeIntervalMove", "timeIntervalFire", "countBullet", "name", "ownerId", "width", "height", "position", "direction", "speed", "typeObject"];
    };
    this.sendRequest = function (f, item) {

        if (this.game.isStart) {
            var argv = [];
            item.getListFielsForSend = item.getListFielsForSend || this.getListFielsForSend;
            var listFielsForSend = item.getListFielsForSend();
            // if (item.getListFielsForSend == null) {
            //     listFielsForSend = this.getListFielsForSend();
            // }else{
            //
            // }
            var data = helper.cutInObj(item, listFielsForSend);

            argv.push(this.game.nameGame);
            argv.push(data);
            f.apply(transportGame, argv);
        }
    };
    this.destroyItem = function (item) {
        item.getListFielsForSend = function () {
            return ["id"];
        };
        this.sendRequest(transportGame.destroyItem, item);
        // var data = helper.cutInObj(item, ["id", "name", "ownerId", "width", "height", "position", "direction", "speed", "typeObject"]);
        // transportGame.destroyItem(this.game.nameGame, data);
    };
    this.renderExplosion = function (item) {
        this.sendRequest(transportGame.renderExplosion, item);


        // var data = helper.cutInObj(item, ["id", "name", "ownerId", "width", "height", "position", "direction", "speed", "typeObject"]);
        //
        //
        // transportGame.renderExplosion(this.game.nameGame, data);
    };


};