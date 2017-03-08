var transportClient = {
    host: '/',
    socket: null,
    // send: function (msg, data) {
    //     this.socket.emit(msg, data);
    // },
    // on: function (event, handler) {
    //
    //     this.socket.on(event, function (data) {
    //         // console.log("event: " + event, data);
    //         handler(data);
    //     });
    // },
    newGame: function (set) {
        this.workerMovement.postMessage("addGame", set);
    },
    joinGame: function (nameGame) {
        this.workerMovement.postMessage("joinToGame", nameGame);
    },
    startGame: function (nameGame) {
        this.workerMovement.postMessage("startGame", nameGame);
    },
    switchToTeam: function (teamId) {
        this.workerMovement.postMessage("switchToTeam", {
            nameGame: iTanksClient.nameGame,
            teamId: teamId
        });
    },
    getMaps: function (data) {
        data.nameGame = iTanksClient.nameGame;
        this.workerMovement.postMessage("getMaps", data);
    },
    loadMapById: function (idMap) {
        this.workerMovement.postMessage("loadMapById", {
            nameGame: iTanksClient.nameGame,
            idMap: idMap
        });
    },
    addBootToTeam: function (teamId) {
        this.workerMovement.postMessage("addBootToTeam", {
            nameGame: iTanksClient.nameGame,
            teamId: teamId
        });
    },
    kickPlayer: function (data) {
        data.nameGame = iTanksClient.nameGame;
        this.workerMovement.postMessage("kickPlayer", data);
    },
    setActiveKey: function (action, value) {
        console.log("setActiveKey", value);
        var dataAction = {action: action, value: value};
        var data = {
            nameGame: iTanksClient.nameGame,
            data: dataAction
        };
        // this.socket.emit("setActiveKey", data);
        this.workerMovement.postMessage("setActiveKey", data);
    },
    getUpdateDataForRendering: function (data) {

        this.workerMovement.postMessage("getUpdateDataForRendering");
    },
    // runActiveKey: function (aData) {
    //     console.log("runActiveKey", aData);
    //
    //     var data = {
    //         nameGame: iTanksClient.nameGame,
    //         data: aData
    //     };
    //     this.socket.emit("runActiveKey", data);
    //
    // },
    workerMovement: new CWorker('js/worker/worker.js'),
    init: function (query) {
        var self = this;

        //this.socket = io.connect(this.host, {query: query});
        this.workerMovement.postMessage("init",  {query: query});
        //'login=viktor&password=temp1'


        // this.workerMovement.on('connect', function () {
        //     //console.log('Соединение установленно!');
        //     socket.emit("getListGames");
        //
        // });
        this.workerMovement.on('kickOurFromGame', function (data) {
            console.log("ongoToLayerListOfGames", data);
            iTanksClient.onKickOurFromGame(data);
        });

        this.workerMovement.on('login', function (data) {
            console.log("onLogin", data);
            iTanksClient.onLogin(data);
        });
        this.workerMovement.on('loginError', function (data) {
            console.log("onLoginError", data);
            iTanksClient.onLoginError(data);
        });

        this.workerMovement.on('setListGames', function (data) {
            console.log("setListGames", data);
            iTanksClient.updateListGamesMenu(data);
        });

        this.workerMovement.on('updateTeams', function (data) {
            console.log("updateTeams", data);
            iTanksClient.updateTeams(data);
        });

        // socket.on('message', function (data) {
        //     console.log("message", data);
        // });
        this.workerMovement.on('errorJoinToGame', function (data) {
            console.log("errorJoinToGame", data);
        });

        this.workerMovement.on('errorMessage', function (data) {
            iTanksClient.onErrorMessage(data);
            console.log("errorMessage", data);
        });
        this.workerMovement.on('successJoinToGame', function (data) {
            iTanksClient.successJoinToGame(data);

            console.log("successJoinToGame", data);
        });
        this.workerMovement.on('errorAddNewGame', function (data) {
            console.log("errorAddNewGame", data);
        });
        this.workerMovement.on('setDataOfGame', function (data) {

            console.log("setDataOfGame", data);
            iTanksClient.initGame(data);
           // self.workerMovement.postMessage("init", iTanksClient.tankOfClient);

        });
        // this.workerMovement.on('updateDataItem', function (dataTank) {
        //
        //     console.log("onUpdateDataTank", dataTank);
        //     iTanksClient.onUpdateDataTank(dataTank);
        // });

        this.workerMovement.on('gameOver', function (data) {


            iTanksClient.onGameOver(data);


        });
        // this.socket.on('updateDataItem', function (item) {
        //
        //     //console.log("updateDataItem", item.position);
        //
        //     // iTanksClient.onUpdateDataItem(item);
        //     self.workerMovement.postMessage("onUpdateDataItem", item);
        //
        //
        // });

        this.workerMovement.on("onUpdateDataItem", function (data) {

            // iTanksClient.onUpdateDataItem(item);
           // console.log("on.onUpdateDataItem", data);


            iTanksClient.onUpdateDataItem(data);


        }, {});

        this.workerMovement.on("onUpdateAllDataForRendering", function (data) {


            console.log("on.onUpdateAllDataForRendering", data);


            iTanksClient.onUpdateAllDataForRendering(data);


        }, {});

        // this.workerMovement.on("runActivKey", function (data) {
        //
        //     // iTanksClient.onUpdateDataItem(item);
        //     console.log("on.runActivKey", data);
        //
        //
        //     this.runActiveKey(data);
        //
        //
        // }, this);

        this.workerMovement.on("updatePosition", function (data) {

            // iTanksClient.onUpdateDataItem(item);
            console.log("on.updatePosition", data);

            $.extend(iTanksClient.tankOfClient, data);
            iTanksClient.onUpdateDataItem(iTanksClient.tankOfClient);


        }, {});
        this.workerMovement.on('destroyItem', function (item) {
            //console.log("updateDataItem", item.position);
            iTanksClient.onDestroyItem(item);
        });
        this.workerMovement.on('renderExplosion', function (item) {
            iTanksClient.onRenderExplosion(item);
        });
        this.workerMovement.on('updateListMaps', function (item) {
            iTanksClient.onUpdateListMaps(item);
        });

        // function safe(str) {
        //     return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // }
    }
};