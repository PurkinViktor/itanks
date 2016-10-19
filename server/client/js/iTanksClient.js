var iTanksClient = {
    listGamesMenu: null,
    init: function () {
        transportClient.init();
        $(window).on("keydown", this.getHandler(this.keydownHundle));
        $(window).on("keyup", this.getHandler(this.keyupHundle));
    },
    newGame: function (nameGame) {
        transportClient.newGame(nameGame);
    },
    nameGame: null,
    joinGame: function (menu, item) {
        transportClient.joinGame(item.value);
    },
    battleArea: {},
    //tanks: [],
    items: [],
    initGame: function (data) {
        this.battleArea = data.battleArea;
        this.items = data.tanks.concat(data.battleArea.barriers) || [];
        renderingSystem.run(this);
    },
    getItem: function (newData) {
        for (var i in this.items) {
            var t = this.items[i];
            if (t.id == newData.id) {
                return $.extend(t, newData);
            }
        }
        this.items.push(newData);
        return newData;

    },
    //items: {},
    // getItem: function (item) {
    //
    //     var t = this.items[item.id];
    //
    //     //var t = this.getTank(item);
    //     if (!t) {
    //         this.items[item.id] = item;
    //         t = this.items[item.id];
    //     }
    //     $.extend(t, item);
    //     return t;
    // },
    // onUpdateDataTank: function (tank) {
    //     var t = this.getTank(tank);
    //     renderingSystem.renderItem(t);
    //     //console.log("", tank);
    //     // renderingSystem.run(this);
    // },

    onDestroyItem: function (dataItem) {

        for (var i in this.items) {
            var t = this.items[i];
            if (t.id == dataItem.id) {
                renderingSystem.destroyItem(t);
                this.items.slice(i, 1);
            }
        }
        //console.log("", tank);
        // renderingSystem.run(this);
    },
    onRenderExplosion: function (dataItem) {

        renderingSystem.renderExplosion(dataItem);

    },
    onUpdateDataItem: function (newDataItem) {

        var t = this.getItem(newDataItem);
        renderingSystem.renderItem(t);
        //console.log("", tank);
        // renderingSystem.run(this);
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
    successJoinToGame: function (data) {
        this.nameGame = data.nameGame;
        //this.startGame(this.nameGame);
    },
    startGame: function (nameGame) {
        transportClient.startGame(nameGame);
    },
    keyHundler: {87: "top", 83: "bottom", 65: "left", 68: "right", 32: "fire"},
    setActiveKey: function (keyCode, value) {

        var action = this.keyHundler[keyCode];
        if (action) {
            //console.log(action);
            transportClient.setActiveKey(action, value);
        }

    },
    keydownHundle: function (event) {

        this.setActiveKey(event.keyCode, true);
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
                case "M".charCodeAt(0):
                    this.startGame(this.nameGame);

                    break;

                default:

                    break;
            }
        }
    },
    keyupHundle: function (event) {
        this.setActiveKey(event.keyCode, false);
    },
    getHandler: function (func) {
        var self = this;
        return function () {

            func.apply(self, arguments);
        };
    }
};