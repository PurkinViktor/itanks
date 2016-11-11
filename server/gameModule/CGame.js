var CBattleArea = require('./CBattleArea.js');
//var generator = require('./idGenerator.js');
var CTank = require('./CTank.js');
var rules = require('./rules.js');
var helper = require('./helper.js');
var transportGame = require('./transportGame.js');
var CRenderingSystem = require('./CRenderingSystem.js');

module.exports = function (set) {
    this.isStart = false;
    this.nameGame = set.nameGame;
    this.teamsOfGame = [
        {title: "Команда IGL", id: "team1", maxCountPlayers: 5},
        {title: "Команда Black IGL", id: "team2", maxCountPlayers: 5},
    ];
    this.getTeams = function () {
        return this.teamsOfGame;
    };
    this.doCountPlayersInTeams = function (arrClients) {
        for (var t in this.teamsOfGame) { //обнуляем счетчики
            var team = this.teamsOfGame[t];
            team.countPlayers = 0;
        }


        for (var i in arrClients) { // считаем игроков в каждой команде
            var client = arrClients[i];

            for (var t in this.teamsOfGame) {
                var team = this.teamsOfGame[t];
                if (team.id == client.teamId) {
                    team.countPlayers++;
                    break;
                }
            }
        }
    };
    this.joinToTeam = function (clientForJoin, arrClients) {
        this.doCountPlayersInTeams(arrClients);

        for (var i in arrClients) {
            var client = arrClients[i];
            if (client.id != clientForJoin.id && client.login == clientForJoin.login) {
                // проверка на уникальность клиента в одной игре 2 одинаковых логина не могут быть
                return false;
            }

        }


        for (var t in this.teamsOfGame) { //даем клиенту id команды если есть место
            var team = this.teamsOfGame[t];
            if (team.countPlayers < team.maxCountPlayers) {
                clientForJoin.teamId = team.id;
                team.countPlayers++;
                return true;
            }
        }
        return false;
        //maxCountPlayers
    };
    this.switchToTeam = function (client, teamId) {
        var res = false;
        var oldTeam = client.teamId;
        for (var t in this.teamsOfGame) { //даем клиенту id команды если есть место
            var team = this.teamsOfGame[t];
            if (team.id == teamId && team.countPlayers < team.maxCountPlayers) {
                client.teamId = team.id;
                team.countPlayers++;
                res = true;

            }
        }
        if (res) {
            for (var i in this.teamsOfGame) {
                var team = this.teamsOfGame[i];
                if (team.id == oldTeam) {
                    team.countPlayers--;
                }
            }
        }
        return res;
    };

    this.tanks = [];
    this.renderingSystem = new CRenderingSystem(this);
    this.battleArea = new CBattleArea(this);

    //this.onInit();
    this.init = function (arrClients) {
        this.battleArea.init();
        rules.init(helper.cutInObj(this, ["battleArea", "tanks"]));
        this.initClients(arrClients);

    };
    this.players = {};
    this.createPlayer = function (socket) {

        this.players[socket.login] = {
            id: "id_player_" + socket.login,// присвоим это чтоб не генерировать
            socketId: socket.id,
            login: socket.login,
            teamId: socket.teamId,
            tank: null
        };
        return this.players[socket.login];
    };
    this.getIsStart = function () {
        return this.isStart;
    };
    this.setActiveKeyInToTank = function (client, data) {
        if (this.getIsStart()) {
            this.players[client.login].tank.setActiveKey(data.action, data.value);
        }

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
            teamId: set.teamId,
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
            client.tank = this.createTank({ownerId: client.id, teamId: client.teamId})
            //this.tanks.push(tank);
        }
    };
    // this.sendUpdateDataTank = function (tank) {
    //     //console.log("Передвижение ", tank);
    //     //var socketId = tank.ownerId;
    //
    //     var data = helper.cutInObj(tank, ["id", "name", "ownerId", "width", "height", "position", "direction", "speed"]);
    //     transportGame.sendUpdateDataItem(this.nameGame, data);
    //    // console.log("Передвижение " + this.nameGame, data);
    // };

    this.addTank = function (settings) {
        //settings.onRender = renderingSystem.getHandler(renderingSystem.renderItem);
        settings.renderingSystem = this.renderingSystem;
        var tank = new CTank(settings);
        //tank.id = generator.getID();
        //tank.renderingSystem = this.renderingSystem;
        //tank.onRender.bind(this.sendUpdateDataTank, this);

        tank.onKill.bind(this.handlerOnKillTank, this);// = this.getHandler(this.killTank);
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
    this.handlerOnKillTank = function (tank, bullet) {
        tank.destroy();
        var index = this.tanks.indexOf(tank);
        if (index >= 0) {
            delete this.tanks[index];
            this.tanks.splice(index, 1);
            var temp = 0;
        }
    };

    this.start = function (ownerId) {
        for (var i in this.tanks) {
            var tank = this.tanks[i];
            tank.setActivat(tank);
        }

        this.isStart = true;
    };

    // this.init();
};
//exports = CGame;