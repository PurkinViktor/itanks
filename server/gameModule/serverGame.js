var transportGame = require('./transportGame.js');
var CGame = require('./CGame.js');
//var CBattleArea = require('./CBattleArea.js');
var helper = require('./helper.js');

var serverGame = {
    games: [],
    io: null,
    start: function (io) {
        this.io = io;
        transportGame.init(this, io, {});
        //var battleArea = new CBattleArea();
        //battleArea.testNewArea();
    },
    addGame: function (client, nameGame) {

        var list = this.getListGames();
        if (list.indexOf(nameGame) < 0) {
            client.join(nameGame);
            var game = new CGame({nameGame: nameGame});
            game.onDestroy.bind(this.handlerDestroyGame, this);
            this.games[nameGame] = game;
            transportGame.updateListGames(this.getListGamesIsNotStart());
            this.joinToGame(client, nameGame);
            // transportGame.successJoinToGame(client, nameGame);
        } else {
            transportGame.errorAddNewGame(client, nameGame, "Game already exist");
        }


    },
    onDisconnet: function (client, nameGame) {
        if (nameGame == "") {
            return;
        }

        nameGame = nameGame.substring(1);
        var arrClients = transportGame.getClientsOfGame(nameGame);
        // var list = this.getListGames();
        if (arrClients.length == 0 || arrClients.indexOf(client) >= 0 && arrClients.length == 1) {
            //значит все вышли из игры
            if (this.games[nameGame] && !this.games[nameGame].getIsStart()) {
                this.games[nameGame].gameStop();
            }
        }

        // var n = 0;
        // for (var i in this.games) {
        //     console.error("name game", i);
        //     n++;
        // }
        // //
        // console.error("countGame", n);

    },
    handlerDestroyGame: function (game) {
        // this.io.sockets.clients(game.nameGame).forEach(function (s) {
        //     s.leave(game.nameGame);
        // });
        console.error("game delete", game.nameGame);
        var arrClients = transportGame.getClientsOfGame(game.nameGame);
        for (var i in arrClients) {
            arrClients[i].leave(game.nameGame);
            console.error("leave", arrClients[i].id);
        }
        delete this.games[game.nameGame];
    },
    getListGamesIsNotStart: function () {
        var arr = [];
        var listGame = this.getListGames();
        for (var i in listGame) {
            var nameGame = listGame[i];
            if (this.games[nameGame] && !this.games[nameGame].getIsStart()) {
                arr.push(nameGame);
            }
        }
        console.log("----------------", arr);
        return arr;
    },
    getListGames: function () {
        //var rooms = this.io.sockets.manager.roomClients;
        var list = Object.keys(this.io.sockets.manager.rooms);
        var res = []
        for (var i = 0; i < list.length; i++) {
            var room = list[i];
            if (room == '') {
                continue;
            }
            res.push(room.substring(1));

        }


        return res;
        // return ["game1", " game2", "game n"];
    },
    onConnect: function (client) {
        for (var nameGame in this.games) {
            var game = this.games[nameGame];
            for (var i in game.players) {
                var player = game.players[i];
                if (player.login == client.login) {
                    client.emit('debugInfo', "типа вошел в игру " + nameGame + " игрок " + player.login);
                    var game = this.games[nameGame];
                    var tanks = this.getItemsToJSON(game.tanks);
                    var dataOfGame = {
                        battleArea: game.battleArea,
                        tanks: tanks
                    };
                    client.emit('setDataOfGame', dataOfGame);
                    // transportGame.setDataOfGame(game.nameGame, dataOfGame);

                    this.joinToGame(client, nameGame);
                }
            }

        }
    },

    getItemsToJSON: function (arr) {
        return helper.cutInObjFromArr(arr, ["id", "name", "ownerId", "width", "height", "position", "direction", "speed", "typeObject"]);
        // var items = [];
        // for (var i in arr) {
        //     var tank = arr[i];
        //     var t = helper.cutInObj(tank, ["id", "name", "ownerId", "width", "height", "position", "direction", "speed", "typeObject"]);
        //     items.push(t);
        // }
        // return items;


    },
    joinToGame: function (client, nameGame) {
        var list = this.getListGames();
        if (list.indexOf(nameGame) >= 0 && this.games[nameGame]) {


            var arrClients = transportGame.getClientsOfGame(nameGame);
            //var teams = this.games[nameGame].getTeams();
            var isJoin = this.games[nameGame].joinToTeam(client, arrClients);
            if (isJoin) {
                client.join(nameGame);
                transportGame.successJoinToGame(client, nameGame);
                // transportGame.getClientsOfGame(nameGame);
                // var data = {};
                // data.teams = this.games[nameGame].getTeams();
                // data.players = helper.cutInObjFromArr(transportGame.getClientsOfGame(nameGame), ["id", "login", "teamId"]);
                // transportGame.updateTeams(nameGame, data);
                this.doUpdateTeamsOnClients(nameGame);
                return;
            }

        }
        transportGame.errorJoinToGame(client, nameGame, "Game not found, or allready start");

    },
    doUpdateTeamsOnClients: function (nameGame) {
        var arrClients = transportGame.getClientsOfGame(nameGame);
        this.games[nameGame].doCountPlayersInTeams(arrClients);
        var data = {};
        data.teams = this.games[nameGame].getTeams();
        data.players = helper.cutInObjFromArr(transportGame.getClientsOfGame(nameGame), ["id", "login", "teamId"]);
        transportGame.updateTeams(nameGame, data);
    },
    onSwitchToTeam: function (client, data) {
        var isSwitch = this.games[data.nameGame].switchToTeam(client, data.teamId);
        if (isSwitch) {
            this.doUpdateTeamsOnClients(data.nameGame);
        }

    },
    startGame: function (client, nameGame) {
        var game = this.games[nameGame];
        if (game && !game.getIsStart()) {
            var arrClients = transportGame.getClientsOfGame(nameGame);

            //client.emit('debugInfo', {arrIdClients_: arrClients});

            game.init(arrClients);//
            var dataOfGame = {
                battleArea: game.battleArea,
                tanks: game.tanks
            };
            transportGame.setDataOfGame(game.nameGame, dataOfGame);
            game.start();
        } else {
            transportGame.errorMessage(client, {nameGame: game.nameGame, text: "Game not found, or allready start"});
        }
    },
    setActiveKey: function (client, data) {

        var nameGame = data.nameGame;
        var activeKeyEventData = data.data;
        var game = this.games[nameGame];
        //console.log("setActiveKey game",game);
        if (game) {
            game.setActiveKeyInToTank(client, activeKeyEventData);
        }
        //client.manager.roomClients[client.id]
        //this.games[client.id].setActiveKey(data.action, data.value);
    }
};

exports.__proto__ = serverGame;
