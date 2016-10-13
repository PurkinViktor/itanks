var transportGame = require('./transportGame.js');
var CGame = require('./CGame.js');
//var CBattleArea = require('./CBattleArea.js');

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
            this.games[nameGame] = game;
            transportGame.updateListGames(this.getListGames());
            transportGame.successJoinToGame(client, nameGame);
        } else {
            transportGame.errorAddNewGame(client, nameGame, "Game already exist");
        }


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
    joinToGame: function (client, nameGame) {
        var list = this.getListGames();
        if (list.indexOf(nameGame) >= 0) {
            client.join(nameGame);
            transportGame.successJoinToGame(client, nameGame);
        } else {
            transportGame.errorJoinToGame(client, nameGame, "Game not found");
        }
    },
    startGame: function (client, nameGame) {
        var game = this.games[nameGame];
        if (game) {
            var arrIdClients = transportGame.getClientsOfGame(nameGame);
            console.log("##### arrClients client of game", arrIdClients);

            game.init(arrIdClients);//передаем идентификаторы сокетов в комнате
            var dataOfGame = {
                battleArea: game.battleArea,
                tanks: game.tanks
            };
            transportGame.setDataOfGame(game.nameGame, dataOfGame);
            game.start();
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
