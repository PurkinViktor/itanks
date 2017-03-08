var transportGame = require('./transportGame.js');
var CGame = require('./CGame.js');
//var CBattleArea = require('./CBattleArea.js');
var helper = require('./../GeneralClass/helper.js');
var Map = require('../models/MapModel.js');

var serverGame = {
    games: [],
    io: null,
    start: function (io) {
        this.io = io;
        transportGame.init(this, io, {});
        //var battleArea = new CBattleArea();
        //battleArea.testNewArea();
    },
    addGame: function (client, set) {
        var nameGame = set.nameGame;

        var list = this.getListGames();
        if (list.indexOf(nameGame) < 0) {
            client.join(nameGame);
            //{nameGame: nameGame, settingsMap: {percentFill: 80}}
            var game = new CGame(set);
            game.onDestroy.bind(this.handlerDestroyGame, this);
            this.games[nameGame] = game;

            this.joinToGame(client, nameGame);
            this.updateListGamesOnClient();
            // transportGame.successJoinToGame(client, nameGame);
        } else {
            transportGame.errorAddNewGame(client, nameGame, "Game already exist");
        }


    },
    updateListGamesOnClient: function () {
        transportGame.updateListGames(this.getListGamesIsNotStart());
    },

    doUpdateTeamsForSleep: function (nameGame) {
        var self = this;
        return function () {
            self.doUpdateTeamsOnClients(nameGame);
        };
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
        this.updateListGamesOnClient();
        // transportGame.updateListGames(this.getListGamesIsNotStart());

    },
    getListGamesIsNotStart: function () {
        var arr = [];
        var listGame = this.getListGames();
        for (var i in listGame) {
            var nameGame = listGame[i];
            var game = this.games[nameGame];
            if (game && !game.getIsStart()) {
                var infoGame = {nameGame: nameGame, teamsOfGame: game.teamsOfGame};
                arr.push(infoGame);
            }
        }
        //console.log("----------------", arr);
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
    users: {},
    onDisconnet: function (client, nameGame) {
        delete this.users[client.login];
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

        setTimeout(this.doUpdateTeamsForSleep(nameGame), 100);
        console.error("onDisconnet", nameGame);
    },
    onConnect: function (client) {
        // проверяем логин может уже есть
        var user = {login: client.login, id: client.id};
        if (this.users[client.login] && this.users[client.login].id !== client.id) {
            user.text = "Login already exist";
            //transportGame.loginError(client, user);
            transportGame.errorMessage(client, user);

            //client.emit("disconnect");
            client.disconnect(true);
            return false;
        }
        this.users[client.login] = user;
        transportGame.login(client, user);

        // если есть уже в игре то присоединяем к игре
        for (var nameGame in this.games) {
            var game = this.games[nameGame];
            for (var i in game.players) {
                var player = game.players[i];
                if (player.login == client.login) {
                    client.emit('debugInfo', "типа вошел в игру " + nameGame + " игрок " + player.login);
                    var game = this.games[nameGame];

                    transportGame.successJoinToGame(client, nameGame);
                    client.join(nameGame);

                    client.teamId = player.teamId;
                    player.socketId = client.id;
                    this.doUpdateTeamsOnClients(nameGame);

                    //client.emit('debugInfo', player);

                    var tanks = this.getItemsToJSON(game.tanks, game.renderingSystem.getListFielsForSend());
                    var dataOfGame = {
                        battleArea: game.battleArea,
                        tanks: tanks
                    };
                    client.emit('setDataOfGame', dataOfGame);
                    // transportGame.setDataOfGame(game.nameGame, dataOfGame);


                    //this.joinToGame(client, nameGame);
                }
            }

        }
        return true;
    },

    getItemsToJSON: function (arr, list) {
        return helper.cutInObjFromArr(arr, list);
        // return helper.cutInObjFromArr(arr, ["id", "name", "ownerId", "width", "height", "position", "direction", "speed", "typeObject"]);


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
        if (this.games[nameGame]) {

            // var arrClients = transportGame.getClientsOfGame(nameGame);
            // var arrBoots = this.games[nameGame].getBoots();
            // var allPlayers = arrClients.concat(arrBoots);
            var arrClients = [];
            var allPlayers = this.getClientsAndBoots(nameGame, arrClients);
            if (arrClients.items.length > 0) {
                this.games[nameGame].doCountPlayersInTeams(allPlayers);
                var data = {};
                data.teams = this.games[nameGame].getTeams();
                data.players = helper.cutInObjFromArr(allPlayers, ["id", "login", "teamId"]);
                transportGame.updateTeams(nameGame, data);
            } else {
                this.updateListGamesOnClient();
            }
        }
    },
    getClientsAndBoots: function (nameGame, aClients) {
        // var arrClients = transportGame.getClientsOfGame(nameGame);
        var arrClients = transportGame.getClientsOfGame(nameGame);
        aClients = aClients || {};
        aClients.items = arrClients;


        var arrBoots = this.games[nameGame].getBoots();
        var allPlayers = arrClients.concat(arrBoots);
        return allPlayers;
    },
    onSwitchToTeam: function (client, data) {
        var isSwitch = this.games[data.nameGame].switchToTeam(client, data.teamId);
        if (isSwitch) {
            this.doUpdateTeamsOnClients(data.nameGame);
        }
    },
    onGetMaps: function (client, data) {
        // Map.getAll(function (err, items) {
        var limit = data.limit;
        var page = Math.max(0, data.indexPage);
        var criteria = {};
        //criteria.where = {skip: page * limit, limit: limit};
        Map.find(criteria, null, {skip: page * limit, limit: limit}, function (err, items) {
            if (err) {
                console.log("ERR", err);
            }

            Map.count({}, function (err, count) {
                if (err) {
                    console.log("ERR", err);
                }

                var arr = [];
                for (var i in items) {
                    items[i].value.battleArea = null;
                }


                transportGame.updateListMaps(client, {items: items, count: count});
            });


        });

        // this.games[data.nameGame]

    },
    onLoadMapById: function (client, data) {
        var crit = {_id: data.idMap};
        var self = this;
        Map.getData(crit, function (err, items) {
            if (err) {
                console.log("ERR", err);
            }
            // console.log(" Load Map By Id", crit, items);
            var map = items[0];
            if (map) {
                //map.value
                //console.log(map, map.value);
                var newNameGame = map.value.nameGame + client.login;
                //map.battleArea
                self.addGame(client, {nameGame: newNameGame});
                var game = self.games[newNameGame];
                game.loadMap(map);

            } else {
                console.log("Map Not Fount ", crit);

            }
            // transportGame.updateListMaps(client, items);
        });
        // this.games[data.nameGame]
    },
    onAddBootToTeam: function (client, data) {
        var allPlayers = this.getClientsAndBoots(data.nameGame);

        var isDo = this.games[data.nameGame].addBootToTeam(data.teamId, allPlayers);
        if (isDo) {
            this.doUpdateTeamsOnClients(data.nameGame);
        }

    },
    onKickPlayer: function (client, data) {

        // data.nameGame
        // data.login
        // data.id
        // data.teaamId
        if (data.id) {
            //id не пустой значит есть пользователь
            var clientForKick = transportGame.getClientById(data.id);
            if (clientForKick) {

                clientForKick.leave(data.nameGame);
                if (data.isHoster) {
                    clientForKick.emit("kickOurFromGame", {});
                }

            }


            //  client.leave(data.nameGame);
        } else {
            // значит бот
            this.games[data.nameGame].kickPlayer(data.teamId, data.login);
        }

        this.doUpdateTeamsOnClients(data.nameGame);


    },
    startGame: function (client, nameGame) {
        var game = this.games[nameGame];
        if (game && !game.getIsStart()) {
            var arrClients = transportGame.getClientsOfGame(nameGame);

            //client.emit('debugInfo', {arrIdClients_: arrClients});

            game.init(arrClients);//

            var dataMap = game.getMap();
            if (!dataMap.id) {
                Map.create(dataMap, function (err, map) {
                    if (err) {
                        console.log("ERR", err);
                    }

                });
            }

            var dataOfGame = {
                battleArea: game.battleArea,
                tanks: game.tanks
            };
            transportGame.setDataOfGame(game.nameGame, dataOfGame);
            game.start();
        } else {
            transportGame.errorMessage(client, {nameGame: nameGame, text: "Game not found, or allready start"});
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
    },
    runActiveKey: function (client, data) {

        var nameGame = data.nameGame;
        var activeKeyEventData = data.data;
        var game = this.games[nameGame];
        //console.log("setActiveKey game",game);
        if (game) {
            game.runActiveKeyInToTank(client, activeKeyEventData);
        }
    }
};

exports.__proto__ = serverGame;
