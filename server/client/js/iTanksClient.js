var iTanksClient = {
    init: function () {
        transportClient.init();
    }
};
var transportClient = {
    host: 'http://localhost:8008',
    init: function () {
        var socket = io.connect(this.host);
        // var name = 'Пётр_' + (Math.round(Math.random() * 10000));


        socket.on('connecting', function () {
            console.log('Соединение...');
        });

        socket.on('connect', function () {
            console.log('Соединение установленно!');

            //socket.emit("getListGames");

            // socket.emit("addGame", "111111");
            // socket.emit("addGame", "222222");
            // socket.emit("joinToGame", "111111");


            socket.emit("getListGames");

        });
        socket.on('setListGames', function (data) {
            console.log("setListGames", data);
        });
        // socket.on('message', function (data) {
        //     console.log("message", data);
        // });
        socket.on('errorJoinToGame', function (data) {
            console.log("errorJoinToGame", data);
        });
        socket.on('successJoinToGame', function (data) {
            console.log("successJoinToGame", data);
        });

        // function safe(str) {
        //     return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // }
    }
};