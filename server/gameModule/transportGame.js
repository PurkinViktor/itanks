var transportGame = {
    io: null,

    setDataOfGame: function (gemaName, gamedataOfGame) {// обновить список игр у всех
        // this.io.sockets.in(data.gameId).emit('playerJoinedRoom', data);
        this.io.sockets.in(gemaName).emit('setDataOfGame', gamedataOfGame);
    },
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
    getClientsOfGame: function (nameGame) {// получение списка игроков
        // this.io.sockets.in(data.gameId).emit('playerJoinedRoom', data);
        var clients = this.io.rooms["/" + nameGame];
        return clients;// this.io.sockets.in(nameGame);
    },
    sendUpdateDataItem: function (gemaName, item) {//

        this.io.sockets.in(gemaName).emit('updateDataTank', item);
    },
    init: function (serverGame, io, options) {
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
            //disconnectClientIfError
            var hundlerEvents = function (func) {

                return function () {
                    try {
                        func.apply(this, arguments);

                    } catch (e) {

                        console.log(e);
                        console.error(e.stack);
                        client.emit('debugError', e.stack);
                       // client.disconnect();
                        // client.leave(data.room);
                    }

                };
            };
            client.on('getListGames', hundlerEvents(function () {

                var list = serverGame.getListGames();
                console.log("list", list);
                client.emit('setListGames', list);


            }));

            client.on('setActiveKey', hundlerEvents(function (data) {
                // {action: action, value: value}
                console.log("setActiveKey", data);
                serverGame.setActiveKey(client, data);

                // client.emit('setListGames', list);


            }));


            client.on('addGame', hundlerEvents(function (nameGame) {
                serverGame.addGame(client, nameGame);
                console.log("addGame", nameGame);
            }));

            client.on('joinToGame', hundlerEvents(function (nameGame) {
                //client.room
                serverGame.joinToGame(client, nameGame);
                //console.log("joinToGame", r);
                //client.emit('joinToGame', r);
            }));

            client.on('startGame', hundlerEvents(function (nameGame) {
                serverGame.startGame(client, nameGame);
                console.log("startGame", nameGame);
            }));

            client.on('disconnect', function () {
                // remove the username from global usernames list
                // delete usernames[socket.username];
                // update list of users in chat, client-side
                //io.sockets.emit('updateusers', usernames);
                // echo globally that this client has left
                //socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
                var arrRoom = client.manager.roomClients[client.id];
                for (var i in arrRoom) {
                    if (arrRoom[i]) {
                        client.leave(i);
                        //console.log("disconnect room ", i);
                    }
                }

                //var list = serverGame.getListGames();
                //console.log("-----------list", list);

            });

        });
    }

};

module.exports = transportGame;