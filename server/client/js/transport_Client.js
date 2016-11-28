var transportClient = {
    host: '/',
    socket: null,
    newGame: function (nameGame) {
        this.socket.emit("addGame", nameGame);
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
    addBootToTeam: function (teamId) {
        this.socket.emit("addBootToTeam", {
            nameGame: iTanksClient.nameGame,
            teamId: teamId
        });
    },
    setActiveKey: function (action, value) {
        console.log("setActiveKey", value);
        this.socket.emit("setActiveKey", {
            nameGame: iTanksClient.nameGame,
            data: {action: action, value: value}
        });
    },
    init: function (query) {

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

            //socket.emit("getListGames");

            //socket.emit("addGame", "111111");
            //socket.emit("addGame", "222222");
            // socket.emit("joinToGame", "111111");


            socket.emit("getListGames");

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

            iTanksClient.onUpdateDataItem(item);


        });
        this.socket.on('destroyItem', function (item) {
            //console.log("updateDataItem", item.position);
            iTanksClient.onDestroyItem(item);
        });
        this.socket.on('renderExplosion', function (item) {
            iTanksClient.onRenderExplosion(item);
        });


        // function safe(str) {
        //     return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // }
    }
};