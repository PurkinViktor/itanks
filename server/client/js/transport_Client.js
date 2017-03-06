var transportClient = {
    host: '/',
    socket: null,
    send: function (msg, data) {
        this.socket.emit(msg, data);
    },
    on: function (event, handler) {

        this.socket.on(event, function (data) {
            // console.log("event: " + event, data);
            handler(data);
        });
    },
    newGame: function (set) {
        this.socket.emit("addGame", set);
    },
    joinGame: function (nameGame) {
        this.socket.emit("joinToGame", nameGame);
    },
    startGame: function (nameGame) {
        this.socket.emit("startGame", nameGame);
    },
    switchToTeam: function (teamId) {
        this.socket.emit("switchToTeam", {
            nameGame: iTanksClient.nameGame,
            teamId: teamId
        });
    },
    getMaps: function (data) {
        data.nameGame = iTanksClient.nameGame;
        this.socket.emit("getMaps", data);
    },
    loadMapById: function (idMap) {
        this.socket.emit("loadMapById", {
            nameGame: iTanksClient.nameGame,
            idMap: idMap
        });
    },
    addBootToTeam: function (teamId) {
        this.socket.emit("addBootToTeam", {
            nameGame: iTanksClient.nameGame,
            teamId: teamId
        });
    },
    kickPlayer: function (data) {
        data.nameGame = iTanksClient.nameGame;
        this.socket.emit("kickPlayer", data);
    },
    setActiveKey: function (action, value) {
        console.log("setActiveKey", value);
        var dataAction = {action: action, value: value};
        var data = {
            nameGame: iTanksClient.nameGame,
            data: dataAction
        };
        // this.socket.emit("setActiveKey", data);
        this.workerMovement.postMessage("setActiveKey", dataAction);
    },
    runActiveKey: function (aData) {
        console.log("runActiveKey", aData);

        var data = {
            nameGame: iTanksClient.nameGame,
            data: aData
        };
        this.socket.emit("runActiveKey", data);

    },
    workerMovement: new CWorker('js/worker/worker.js'),
    init: function (query) {
        var self = this;

        this.socket = io.connect(this.host, {query: query});
        //'login=viktor&password=temp1'
        var socket = this.socket;
        // var name = 'Пётр_' + (Math.round(Math.random() * 10000));


        this.socket.on('debugError', function (err) {
            console.error('debugError', err);
        });
        this.socket.on('debugInfo', function (info) {
            console.info('debugInfo', info);
        });

        this.socket.on('connecting', function () {
            console.log('Соединение...');
        });

        this.socket.on('connect', function () {
            console.log('Соединение установленно!');
            socket.emit("getListGames");

        });
        this.socket.on('kickOurFromGame', function (data) {
            console.log("ongoToLayerListOfGames", data);
            iTanksClient.onKickOurFromGame(data);
        });

        this.socket.on('login', function (data) {
            console.log("onLogin", data);
            iTanksClient.onLogin(data);
        });
        this.socket.on('loginError', function (data) {
            console.log("onLoginError", data);
            iTanksClient.onLoginError(data);
        });

        this.socket.on('setListGames', function (data) {
            console.log("setListGames", data);
            iTanksClient.updateListGamesMenu(data);
        });

        this.socket.on('updateTeams', function (data) {
            console.log("updateTeams", data);
            iTanksClient.updateTeams(data);
        });

        // socket.on('message', function (data) {
        //     console.log("message", data);
        // });
        this.socket.on('errorJoinToGame', function (data) {
            console.log("errorJoinToGame", data);
        });

        this.socket.on('errorMessage', function (data) {
            iTanksClient.onErrorMessage(data);
            console.log("errorMessage", data);
        });
        this.socket.on('successJoinToGame', function (data) {
            iTanksClient.successJoinToGame(data);

            console.log("successJoinToGame", data);
        });
        this.socket.on('errorAddNewGame', function (data) {
            console.log("errorAddNewGame", data);
        });
        this.socket.on('setDataOfGame', function (data) {

            console.log("setDataOfGame", data);
            iTanksClient.initGame(data);
            self.workerMovement.postMessage("init", iTanksClient.tankOfClient);

        });
        // this.socket.on('updateDataItem', function (dataTank) {
        //
        //     console.log("onUpdateDataTank", dataTank);
        //     iTanksClient.onUpdateDataTank(dataTank);
        // });

        this.socket.on('gameOver', function (data) {


            iTanksClient.onGameOver(data);


        });
        this.socket.on('updateDataItem', function (item) {

            //console.log("updateDataItem", item.position);

            // iTanksClient.onUpdateDataItem(item);
            self.workerMovement.postMessage("onUpdateDataItem", item);


        });

        this.workerMovement.on("onUpdateDataItem", function (data) {

            // iTanksClient.onUpdateDataItem(item);
            console.log("on.onUpdateDataItem", data);


            iTanksClient.onUpdateDataItem(data);


        }, {});
        this.workerMovement.on("runActivKey", function (data) {

            // iTanksClient.onUpdateDataItem(item);
            console.log("on.runActivKey", data);


            this.runActiveKey(data);


        }, this);

        this.workerMovement.on("updatePosition", function (data) {

            // iTanksClient.onUpdateDataItem(item);
            console.log("on.updatePosition", data);

            $.extend(iTanksClient.tankOfClient, data);
            iTanksClient.onUpdateDataItem(iTanksClient.tankOfClient);


        }, {});
        this.socket.on('destroyItem', function (item) {
            //console.log("updateDataItem", item.position);
            iTanksClient.onDestroyItem(item);
        });
        this.socket.on('renderExplosion', function (item) {
            iTanksClient.onRenderExplosion(item);
        });
        this.socket.on('updateListMaps', function (item) {
            iTanksClient.onUpdateListMaps(item);
        });

        // function safe(str) {
        //     return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // }
    }
};