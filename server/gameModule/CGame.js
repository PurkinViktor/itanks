var CBattleArea = require('./CBattleArea.js');
var generator = require('./idGenerator.js');
var CTank = require('./CTank.js');
var rules = require('./rules.js');
var helper = require('./helper.js');
var transportGame = require('./transportGame.js');


module.exports = function (set) {
    this.nameGame = set.nameGame;
    this.teems = [{title: "Команда IGL", id: "teem1"}];
    this.tanks = [];
    this.battleArea = new CBattleArea();
    //this.onInit();
    this.init = function (arrIdClients) {
        this.battleArea.init();
        rules.init(helper.cutInObj(this, ["battleArea", "tanks"]));
        this.initClients(arrIdClients);

    };
    this.players = {};
    this.createPlayer = function (id) {
        this.players[id] = {
            id: id,
            tank: null
        };
        return this.players[id];
    };
    this.setActiveKeyInToTank = function (client, data) {

        this.players[client.id].tank.setActiveKey(data.action, data.value);

    };
    this.createTank = function (set) {
        var tank = this.addTank({
            keyHundler: {87: "top", 83: "bottom", 65: "left", 68: "right", 32: "fire"},
            position: {x: 500, y: 0},
            name: "Player " + set.ownerId,
            ownerId: "player_" + set.ownerId,
            hp: 10,
            countBullet: 3,// количество выстрелов одновреммено
            typeObject: ["player1", "player1_"],
//			width: 26,
//			height: 26
        });
        this.setInFreePlace(tank);

        return tank;
    };
    this.setInFreePlace = function (tank) {
        var pos = tank.position;
        for (; rules.rulesMovement(tank, pos);) {
            pos = this.getRandPosition();
        }

    };
    this.getRandPosition = function () {
        return helper.getRandPosition(0, this.battleArea.w, 0, this.battleArea.h);
    };
    this.initClients = function (arrIdClients) {
        for (var i in arrIdClients) {
            var client = this.createPlayer(arrIdClients[i]);
            client.tank = this.createTank({ownerId: client.id})
            //this.tanks.push(tank);
        }
    };
    this.sendUpdateDataTank = function (tank) {
        console.log("Передвижение ", tank);
        //var socketId = tank.ownerId;

        var data = helper.cutInObj(tank, ["id", "name", "ownerId", "width", "height", "position", "direction", "speed"]);
        transportGame.sendUpdateDataTank(this.nameGame, data);
    };
    this.addTank = function (settings) {
        //settings.onRender = renderingSystem.getHandler(renderingSystem.renderItem);
        var tank = new CTank(settings);
        tank.id = generator.getID();

        tank.onMove.bind(this.sendUpdateDataTank, this);
        // tank.onKill.bind(this.killTank, this);// = this.getHandler(this.killTank);
        //tank.onKill.bind(function (tank, bullet) {
        //    statistics.collectStat(EnumStat.killed, bullet.ownerId);
        //    statistics.collectStat(EnumStat.died, tank.id);
        //});
        // tank.onHit.bind(function (tank, bullet) {
        //     statistics.collectStat(EnumStat.hit, bullet.ownerId);
        // });
        // tank.onFire.bind(function (tank) {
        //     statistics.collectStat(EnumStat.fire, tank.id);
        // });

        this.tanks.push(tank);


        return tank;
    };
    this.start = function (ownerId) {
        for (var i in this.tanks) {
            var tank = this.tanks[i];
            tank.setActivat(tank);
        }
    };

    // this.init();
};
//exports = CGame;