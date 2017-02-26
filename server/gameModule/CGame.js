var CBattleArea = require('./CBattleArea.js');
var generator = require('./idGenerator.js');
var CTank = require('./CTank.js');
var rules = require('./rules.js');
var helper = require('./helper.js');
var transportGame = require('./transportGame.js');
var CRenderingSystem = require('./CRenderingSystem.js');
var CEvent = require('./CEvent.js');
var CBrain = require('./CBrain.js');


module.exports = function (setGame) {
    this.isStart = false;
    this.nameGame = setGame.nameGame;
    this.teamsOfGame = [
        {
            title: "Команда IGL", id: "team1", maxCountPlayers: 5,
            IGLSettings: {
                x: 7, y: 0,
                // onKill: new CEvent()
            }
        },
        {
            title: "Команда Black IGL", id: "team2", maxCountPlayers: 5,
            IGLSettings: {
                // x: 14, y: 7,
                x: 7, y: 14,
                //onKill: new CEvent()
            }
        },

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
                // проверка id нужна для первого кто в иру присоединяется это исключение
                return false;
            }

        }


        for (var t in this.teamsOfGame) { //даем клиенту id команды если есть место
            var team = this.teamsOfGame[t];
            if (clientForJoin.teamId && clientForJoin.teamId != team.id) {
                continue;
            }

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


    this.init = function (arrClients) {
        //{percentFill: 35}
        this.battleArea.init(setGame.settingsMap);


        this.battleArea.onIglKilled.bind(this.handlerIglKilled, this);
        rules.init(helper.cutInObj(this, ["battleArea", "tanks"]));
        this.initClients(arrClients);

    };
    this.dataForSaveMapInDB = {};
    this.getMap = function () {
        //var data = {};
        this.dataForSaveMapInDB.teamsOfGame = this.teamsOfGame;
        this.dataForSaveMapInDB.battleArea = this.battleArea;
        this.dataForSaveMapInDB.nameGame = this.nameGame;

        return this.dataForSaveMapInDB;
    };

    this.loadMap = function (map) {
        this.dataForSaveMapInDB.id = map.id;
        this.battleArea.loadMap(map.value.battleArea);
    };


    this.players = {};
    this.boots = {};

    this.addBootToTeam = function (teamId, arrAll) {
        var login = "boot_" + generator.getID();
        //this.createBoot({});
        var boot = {
            id: false,// тут типа идентификатор сокета должен быть
            login: login,
            teamId: teamId,
            //isBoot: true,
            brain: null,
        };
        var f = this.joinToTeam(boot, arrAll);
        if (f) {
            this.boots[login] = boot;
        }
        return f;
    };
    this.kickPlayer = function (teamId, login) {
        delete this.boots[login];
        return true;
    };
    this.getBoots = function () {
        var res = helper.cutInObjFromArr(this.boots, ["id", "login", "teamId"]);
        return res;
    };
    // this.createBoot = function (settings) {
    //     this.players[settings.login] = {
    //         id: "id_boot_" + settings.login,// присвоим это чтоб не генерировать
    //         socketId: settings.id,
    //         //login: socket.login,
    //         teamId: settings.teamId,
    //         tank: null
    //     };
    //     return this.players[socket.login];
    // };
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

    this.handlerIglKilled = function (igl) {
        //console.log(igl, bulet);
        //    igl.teamId
        //transportGame.sendDebagInfo(this.nameGame, igl);
        var teams = this.getTeams();
        // var losingTeam = helper.getObjFromArr(teams, igl.teamId);
        //transportGame.sendDebagInfo(this.nameGame, losingTeam);

        for (var i in this.players) {
            var player = this.players[i];

            var resultGame = {winner: true};
            if (igl.teamId == player.teamId) {
                resultGame.winner = false;
            }
            transportGame.gameOver(player.socketId, resultGame);
        }
        this.gameStop();
    };
    this.onDestroy = new CEvent();
    this.gameStop = function () {

        for (var i in this.players) {
            var player = this.players[i];
            //player.tank.destroy();
            if (player.brain) {
                player.brain.setActivate(false);
            }
        }
        for (var i in this.tanks) {
            var tank = this.tanks[i];
            tank.setActivat(false);
        }
        this.OnDestroy(this);
    };
    this.OnDestroy = function () {
        for (var i in this.players) {
            var player = this.players[i];
            //player.tank.destroy();
            if (player.brain) {
                player.brain.destroy();
            }
        }
        for (; this.tanks.length > 0;) {
            var tank = this.tanks[0];
            this.deleteTank(tank);
        }
        this.onDestroy(this);
    };
    this.getIsStart = function () {
        return this.isStart;
    };
    this.setActiveKeyInToTank = function (client, data) {
        if (this.getIsStart()) {
            this.players[client.login].tank.setActiveKey(data.action, data.value);
        }

    };
    this.createTank = function (setTank) {
        var tank = this.addTank({
            keyHundler: {87: "top", 83: "bottom", 65: "left", 68: "right", 32: "fire"},
            position: {x: 500, y: 0},
            name: "Player " + setTank.ownerId,
            ownerId: "player_" + setTank.ownerId,
            hp: setTank.xp || 10,
            countBullet: 3,// количество выстрелов одновреммено
            typeObject: ["player", "player_"],
            teamId: setTank.teamId,
//			width: 26,
//			height: 26
        });
        //tank.position = this.getRandPositionAlign(this.battleArea.widthCell, 5, {});
        this.setInFreePlace(tank);

        return tank;
    };
    this.setInFreePlace = function (tank) {
        var posCell = {};
        var shift = tank.positionShift;
        var widthCell = this.battleArea.widthCell;
        var pos = this.getRandPositionAlign(widthCell, shift, posCell);

        for (; rules.rulesMovement(tank, pos);) {
            pos = this.getRandPositionAlign(widthCell, shift, posCell);
        }

        tank.posCell = posCell;
        // tank.posCell.x = (pos.x - 5) / widthCell;
        // tank.posCell.y = (pos.y - 5) / widthCell;

    };
    this.getRandPosition = function () {
        return helper.getRandPosition(0, this.battleArea.w, 0, this.battleArea.h);
    };
    this.getRandPositionAlign = function (multipleOf, shift, posCell) {
        var pos = helper.getRandPosition(0, this.battleArea.w, 0, this.battleArea.h);
        posCell.x = Math.floor(Math.floor(pos.x) / multipleOf);
        posCell.y = Math.floor(Math.floor(pos.y) / multipleOf);
        pos.x = posCell.x * multipleOf + shift;
        pos.y = posCell.y * multipleOf + shift;
        return pos;
    };
    this.initClients = function (arrIdClients) {
        for (var i in arrIdClients) {
            var client = this.createPlayer(arrIdClients[i]);
            client.tank = this.createTank({ownerId: client.id, teamId: client.teamId})
            //this.tanks.push(tank);
        }
        for (var i in this.boots) {

            var client = this.createPlayer(this.boots[i]);
            client.tank = this.createTank({ownerId: client.id, teamId: client.teamId, xp: 1})
            client.brain = new CBrain(client, this);
            //this.tanks.push(tank);
        }
    };


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
        // tank.destroy();
        // var index = this.tanks.indexOf(tank);
        // if (index >= 0) {
        //     delete this.tanks[index];
        //     this.tanks.splice(index, 1);
        // }
        this.deleteTank(tank);
    };
    this.deleteTank = function (tank) {
        tank.destroy();
        var index = this.tanks.indexOf(tank);
        if (index >= 0) {
            delete this.tanks[index];
            this.tanks.splice(index, 1);
        }
    };
    this.start = function () {

        for (var i in this.tanks) {
            var tank = this.tanks[i];
            tank.setActivat(true);
        }

        this.isStart = true;
    };

    // this.init();
};
//exports = CGame;