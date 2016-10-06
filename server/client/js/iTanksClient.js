var iTanksClient = {
    listGamesMenu: null,
    init: function () {
        transportClient.init();
        $(window).on("keydown", this.getHandler(this.keydownHundle));
        //$(window).on("keyup", this.getHandler(this.keyupHundle));
    },
    newGame: function (nameGame) {
        transportClient.newGame(nameGame);
    },
    joinGame: function (menu, item) {
        transportClient.joinGame(item.value);
    },
    createListGamesMenu: function (list) {
        var set = {items: [], location: ".allContent"};
        for (var i in list) {
            var nameGame = list[i];
            set.items.push({title: "Игра: " + nameGame, itemCode: i, value: nameGame});
        }
        if (this.listGamesMenu) {
            this.listGamesMenu.destroy();
        }

        this.listGamesMenu = new CMenu(set);
        this.listGamesMenu.onItemSelected.bind(this.joinGame, this);
        this.listGamesMenu.show();
    },
    setActiveKey: function (keyCode, value) {
        for (var i = 0; i < this.tanks.length; i++) {
            var tank = this.tanks[i];
            if (tank) {
                var action = tank.keyHundler[keyCode];
                if (action) {
                    //console.log(action);
                    tank.setActiveKey(action, value);
                }
            }
        }
    },
    keydownHundle: function (event) {

        //this.setActiveKey(event.keyCode, true);
        if (event.ctrlKey) {
            event.preventDefault();

            //var charCode = "I".charCodeAt(0);
            switch (event.keyCode) {


                case "I".charCodeAt(0):
                    //statistics.toggleShow();
                    break;
                case "M".charCodeAt(0):
                    //gameMenu.show();
                    break;
                case "C".charCodeAt(0):
                    //var cmdArg = prompt("Команда пользователя", "stopGame");
                    var cmdArg = prompt("Команда admina", "setBootsCount");
                    if (cmdArg) {
                        var arrCmdArg = cmdArg.split(' ');
                        var cmd = arrCmdArg[0];
                        var arg = arrCmdArg.splice(1);
                        if (cmd) {
                            if (this[cmd]) {
                                this[cmd].apply(this, arg);
                            }
                        }
                    }
                    break;
                default:

                    break;
            }
        }
        if (event.altKey) {
            event.preventDefault();

            switch (event.keyCode) {
                case "N".charCodeAt(0):
                    var newGame = prompt("Новая игра ", "NewGame");
                    if (newGame) {
                        this.newGame(newGame);
                    }

                    break;

                default:

                    break;
            }
        }
    },
    getHandler: function (func) {
        var self = this;
        return function () {

            func.apply(self, arguments);
        };
    }
};