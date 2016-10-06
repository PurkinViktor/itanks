var serverGame = {
    games: [],
    io: null,
    start: function (io) {
        this.io = io;
        transportGame.init(io, {});
    },
    addGame: function (client, nameGame) {

        var list = this.getListGames();
        if (list.indexOf(nameGame) < 0) {
            client.join(nameGame);
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
    }
};

exports.serverGame = serverGame;
var transportGame = {
    io: null,

    successJoinToGame: function (client, nameGame, text) {//  успех присоединения к игре
        text = text || "Success Join To Game";
        client.emit('successJoinToGame', {text: text, nameGame: nameGame});
    },
    errorJoinToGame: function (client, nameGame, text) {// сообщение об ошибки присоединение к игре
        client.emit('errorJoinToGame', {text: text, nameGame: nameGame});
    },
    errorAddNewGame: function (client, nameGame, text) {// сообщение об ошибки присоединение к игре
        client.emit('errorAddNewGame', {text: text, nameGame: nameGame});
    },
    updateListGames: function (list) {// обновить список игр у всех
        // this.io.sockets.in(data.gameId).emit('playerJoinedRoom', data);
        this.io.sockets.emit('setListGames', list);
    },
    init: function (io, options) {
        this.io = io;
        io.sockets.on('connection', function (client) {
            // client.on('message', function (message) {
            //     try {
            //         client.emit('message', message); // отправка себе
            //         client.broadcast.emit('message', message); // отправка всем кроме себя
            //     } catch (e) {
            //         console.log(e);
            //         client.disconnect();
            //     }
            // });

            client.on('getListGames', function (message) {
                try {
                    var list = serverGame.getListGames();
                    console.log("list", list);
                    client.emit('setListGames', list);

                } catch (e) {
                    console.log(e);
                    client.disconnect();
                }
            });

            client.on('addGame', function (nameGame) {
                try {
                    serverGame.addGame(client, nameGame);
                    console.log("addGame", nameGame);
                    //client.emit('addGame', r);

                } catch (e) {
                    console.log(e);
                    client.disconnect();
                }
            });

            client.on('joinToGame', function (nameGame) {
                //client.room
                try {
                    serverGame.joinToGame(client, nameGame);
                    //console.log("joinToGame", r);
                    //client.emit('joinToGame', r);

                } catch (e) {
                    console.log(e);
                    client.disconnect();
                }
            });

            client.on('disconnect', function () {
                // remove the username from global usernames list
                // delete usernames[socket.username];
                // update list of users in chat, client-side
                //io.sockets.emit('updateusers', usernames);
                // echo globally that this client has left
                //socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
                client.leave(client.room);
            });

        });
    }

};