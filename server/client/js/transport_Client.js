var transportClient = {
    host: 'http://localhost:8008',
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

    setActiveKey: function (action, value) {
        console.log("setActiveKey", value);
        this.socket.emit("setActiveKey", {
            nameGame: iTanksClient.nameGame,
            data: {action: action, value: value}
        });
    },
    init: function () {

        this.socket = io.connect(this.host);
        var socket = this.socket;
        // var name = 'Пётр_' + (Math.round(Math.random() * 10000));


        this.socket.on('debugError', function (err) {
            console.error('debugError', err);
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
        this.socket.on('setListGames', function (data) {
            console.log("setListGames", data);
            iTanksClient.createListGamesMenu(data);
        });
        // socket.on('message', function (data) {
        //     console.log("message", data);
        // });
        this.socket.on('errorJoinToGame', function (data) {
            console.log("errorJoinToGame", data);
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

        this.socket.on('updateDataItem', function (item) {

            //console.log("updateDataItem", item.position);

            iTanksClient.onUpdateDataItem(item);


        });

        // function safe(str) {
        //     return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // }
    }
};