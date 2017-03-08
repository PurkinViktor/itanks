var CTransportWorker = function () {
    CBaseWorker.apply(this, arguments);
    var _self = this;

    this.host = '/';
    this.socket = null;
    this.send = function (msg, data) {
        this.socket.emit(msg, data);
    };
    this.on = function (event, handler) {

        this.socket.on(event, function (data) {
            // console.log("event: " + event, data);
            handler(data);
        });
    };
    // вызываеется если в классе нет метода
    this.forAllNotExist = function (event, data) {
        this.socket.emit(event, data);
    };

    this.getUpdateDataForRendering = function (data) {
        iTanksClient.sendUpdateDataForRendering(data);
    };
    // this.newGame = function (set) {
    //     this.socket.emit("addGame", set);
    // };
    // this.joinGame = function (nameGame) {
    //     this.socket.emit("joinToGame", nameGame);
    // };
    // this.startGame = function (nameGame) {
    //     this.socket.emit("startGame", nameGame);
    // };
    // this.switchToTeam = function (teamId) {
    //     this.socket.emit("switchToTeam", {
    //         nameGame: iTanksClient.nameGame,
    //         teamId: teamId
    //     });
    // };
    // this.getMaps = function (data) {
    //     data.nameGame = iTanksClient.nameGame;
    //     this.socket.emit("getMaps", data);
    // };
    // this.loadMapById = function (idMap) {
    //     this.socket.emit("loadMapById", {
    //         nameGame: iTanksClient.nameGame,
    //         idMap: idMap
    //     });
    // };
    // this.addBootToTeam = function (teamId) {
    //     this.socket.emit("addBootToTeam", {
    //         nameGame: iTanksClient.nameGame,
    //         teamId: teamId
    //     });
    // };
    // this.kickPlayer = function (data) {
    //     data.nameGame = iTanksClient.nameGame;
    //     this.socket.emit("kickPlayer", data);
    // };
    this.setActiveKey = function (data) {
        iTanksClient.nameGame = data.nameGame;
        var action = data.data.action;
        var value = data.data.value;

        // var dataAction = {action: action, value: value};
        // var data = {
        //     nameGame: iTanksClient.nameGame,
        //     data: dataAction
        // };

        // this.socket.emit("setActiveKey", data);
        //this.workerMovement.postMessage("setActiveKey", dataAction);

        tankControl.setActiveKey(action, value);
    };
    this.runActiveKey = function (aData) {
        console.log("runActiveKey", aData);

        var data = {
            nameGame: iTanksClient.nameGame,
            data: aData
        };
        this.socket.emit("runActiveKey", data);

    };

    this.getListGames = function (aData) {
        this.socket.emit("getListGames");
    };

    this.sendToUI = {
        onUpdateDataItem: function (data) {
            _self.postMessage("onUpdateDataItem", data);
        },
        sendUpdateAllDataForRendering: function (data) {
            _self.postMessage("onUpdateAllDataForRendering", data);
        },

    };
    //this.workerMovement = new CWorker('js/worker/worker.js');
    this.init = function (query) {


        this.socket = io.connect(this.host, query);
        //'login=viktor&password=temp1'


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

            iTanksClient.init();

        });
        this.socket.on('kickOurFromGame', function (data) {
            _self.postMessage("kickOurFromGame", data);
            // console.log("ongoToLayerListOfGames", data);
            // iTanksClient.onKickOurFromGame(data);
        });

        this.socket.on('login', function (data) {
            _self.postMessage("login", data);
            _self.getListGames();
            // console.log("onLogin", data);
            iTanksClient.onLogin(data);
        });
        this.socket.on('loginError', function (data) {
            _self.postMessage("loginError", data);

            // console.log("onLoginError", data);
            // iTanksClient.onLoginError(data);
        });

        this.socket.on('setListGames', function (data) {
            _self.postMessage("setListGames", data);

            // console.log("setListGames", data);
            // iTanksClient.updateListGamesMenu(data);
        });

        this.socket.on('updateTeams', function (data) {
            _self.postMessage("updateTeams", data);

            // console.log("updateTeams", data);
            // iTanksClient.updateTeams(data);
        });

        // socket.on('message', function (data) {
        //     console.log("message", data);
        // });
        this.socket.on('errorJoinToGame', function (data) {
            _self.postMessage("errorJoinToGame", data);

            //console.log("errorJoinToGame", data);
        });

        this.socket.on('errorMessage', function (data) {
            _self.postMessage("errorMessage", data);

            // iTanksClient.onErrorMessage(data);
            // console.log("errorMessage", data);
        });
        this.socket.on('successJoinToGame', function (data) {
            _self.postMessage("successJoinToGame", data);

            // iTanksClient.successJoinToGame(data);
            //
            // console.log("successJoinToGame", data);
        });
        this.socket.on('errorAddNewGame', function (data) {
            _self.postMessage("errorAddNewGame", data);

            // console.log("errorAddNewGame", data);
        });
        this.socket.on('setDataOfGame', function (data) {
            _self.postMessage("setDataOfGame", data);

            // console.log("setDataOfGame", data);
            iTanksClient.initGame(data);
            // self.workerMovement.postMessage("init", iTanksClient.tankOfClient);
            adapterTankControl.init(iTanksClient.tankOfClient);
        });
        // this.socket.on('updateDataItem', function (dataTank) {
        //
        //     console.log("onUpdateDataTank", dataTank);
        //     iTanksClient.onUpdateDataTank(dataTank);
        // });

        this.socket.on('gameOver', function (data) {

            _self.postMessage("gameOver", data);

            // iTanksClient.onGameOver(data);
        });
        this.socket.on('updateDataItem', function (item) {

            //console.log("updateDataItem", item.position);

            iTanksClient.onUpdateDataItem(item);
            //_self.sendToUI.onUpdateDataItem(item);
        });


        this.socket.on('destroyItem', function (item) {
            //console.log("updateDataItem", item.position);
            _self.postMessage("destroyItem", item);

            iTanksClient.onDestroyItem(item);
        });
        this.socket.on('renderExplosion', function (item) {
            _self.postMessage("renderExplosion", item);

            // iTanksClient.onRenderExplosion(item);
        });
        this.socket.on('updateListMaps', function (item) {
            _self.postMessage("updateListMaps", item);

            //iTanksClient.onUpdateListMaps(item);
        });

    };

};

CTransportWorker.prototype = Object.create(CBaseWorker.prototype);
CTransportWorker.prototype.constructor = CTransportWorker;
var transportWorker = new CTransportWorker();