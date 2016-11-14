var iTanksClient = {
    // listGamesMenu: null,
    init: function () {
        gameMenu.init(this);
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
    switchToTeam: function (teamId) {
        transportClient.switchToTeam(teamId);
    },
    battleArea: {},
    //tanks: [],
    items: [],
    initGame: function (data) {
        setTimeout(function () {
            gameMenu.hideAll();
        }, 100);
        //gameMenu.hideAll();
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
    onErrorMessage: function (data) {
        alert("Error: " + data.text);
    },
    updateListGamesMenu: function (list) {
        gameMenu.updateListGame(list);
        //gameMenu.layOut.
        // var set = {items: [], location: ".allContent"};
        // for (var i in list) {
        //     var nameGame = list[i];
        //     set.items.push({title: "Игра: " + nameGame, itemCode: i, value: nameGame});
        // }
        // if (this.listGamesMenu) {
        //     this.listGamesMenu.destroy();
        // }
        //
        // this.listGamesMenu = new CListUI(set);
        // this.listGamesMenu.onItemSelected.bind(this.joinGame, this);
        // this.listGamesMenu.show();
    },
    updateTeams: function (data) {

        gameMenu.updateTeams(data);
        // console.log();
    },
    successJoinToGame: function (data) {
        this.nameGame = data.nameGame;
        gameMenu.showTeams();
        //this.startGame(this.nameGame);
    },
    startGame: function () {
        transportClient.startGame(this.nameGame);
    },
    onGameOver: function (data) {
        console.log("onGameOver", data);
        if (data.winner) {
            alert("YOU WIN !!! )))");
        } else {
            alert("You lose (((.");
        }

        renderingSystem.destroy();
        gameMenu.showListGames();
    },
    keyHundler: {
        87: {action: "top", stateKey: false},
        83: {action: "bottom", stateKey: false},
        65: {action: "left", stateKey: false},
        68: {action: "right", stateKey: false},
        32: {action: "fire", stateKey: false},
    },

    setActiveKey: function (keyCode, value) {

        var actionKey = this.keyHundler[keyCode];

        if (actionKey && actionKey.stateKey != value) {
            actionKey.stateKey = value;
            // var action = actionKey.action;
            //console.log(action);
            transportClient.setActiveKey(actionKey.action, actionKey.stateKey);
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
                    this.startGame();

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