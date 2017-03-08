var iTanksClient = {
    // listGamesMenu: null,
    init: function () {
        gameMenu.init(this);
        //var q = 'login=viktor&password=temp1';
        var q = document.location.search.substr(1);
        transportClient.init(q);

        $(window).on("keydown", this.getHandler(this.keydownHundle));
        $(window).on("keyup", this.getHandler(this.keyupHundle));


    },
    login: false,
    //teamId: false,
    clientInfo: {
        teamId: false,
        login: false
    },
    onLogin: function (data) {
        this.login = data.login;
        this.clientInfo = data;
        console.log("LOGIN", this.clientInfo);
    },
    onLoginError: function (data) {

    },
    newGame: function (set) {
        transportClient.newGame(set);
    },
    nameGame: null,
    joinGame: function (menu, item) {
        transportClient.joinGame(item.value);

    },
    switchToTeam: function (teamId) {
        transportClient.switchToTeam(teamId);
    },
    getMaps: function (data) {
        transportClient.getMaps(data);
    },
    loadMapById: function (idMap) {
        transportClient.loadMapById(idMap);
    },
    onUpdateListMaps: new CEvent(),

    battleArea: {},
    //tanks: [],
    items: {},
    tankOfClient: null,
    initGame: function (data) {
        setTimeout(function () {
            gameMenu.hideAll();
        }, 100);
        //gameMenu.hideAll();
        this.battleArea = data.battleArea;

        for (var i in data.tanks) {
            var tank = data.tanks[i];
            if (tank.ownerId == "player_id_player_" + this.clientInfo.login) {
                tank.isMyTank = true;
                this.tankOfClient = tank;
                break;
            }
        }
        var arrTemp = data.tanks.concat(data.battleArea.barriers) || [];
        for (var i in arrTemp) {
            var item = arrTemp[i];
            this.items[item.id] = item;
        }
        gameMenu.initGame();
    },
    getItem: function (newData) {
        var item = this.items[newData.id];
        if (item) {
            return $.extend(item, newData);
        }

        this.items[newData.id] = newData;
        return newData;

    },

    onDestroyItem: function (dataItem) {
        var t = this.getItem(dataItem);
        //console.log("delete  ", t.id);
        renderingSystem.setAction(t, renderingSystemEnum.DELETE);
    },

    onRenderExplosion: function (dataItem) {
        dataItem.id = "explosion" + new Date().getTime();
        var t = this.getItem(dataItem);
        renderingSystem.setAction(t, renderingSystemEnum.EXPLOSION);
    },
    onUpdateDataItem: function (newDataItem) {

        var t = this.getItem(newDataItem);
        renderingSystem.setAction(t, renderingSystemEnum.UPDATE);

    },
    pingMamager: {},
    onUpdateAllDataForRendering: function (data) {
        if (data.pingMamager) {
            this.pingMamager = data.pingMamager;
        }

    },
    // callInWraper: function (f, t) {
    //     requestAnimationFrame(function (a) {
    //         return function () {
    //
    //             console.time(GNAME_TIME);
    //             //renderingSystem[f](a);
    //             f.call(renderingSystem, a);
    //             console.timeEnd(GNAME_TIME);
    //         }
    //     }(t));
    //
    // },
    onErrorMessage: function (data) {
        alert("Error: " + data.text);
    },
    updateListGamesMenu: function (list) {
        gameMenu.updateListGame(list);

    },
    teamsInGame: [],
    updateTeams: function (data) {
        // console.log("updateTeams",data);
        for (var i in data.players) {
            var player = data.players[i];
            if (player.login == this.login) {
                $.extend(this.clientInfo, player);
                break;
            }
        }
        this.teamsInGame = data.teams;
        for (var i in data.teams) {
            var team = data.teams[i];
            if (team.id == this.clientInfo.teamId) {
                this.clientInfo.team = team;
                break;
            }
        }
        console.log("this.clientInfo", this.clientInfo);
        //console.log("this.clientInfo", this.clientInfo);
        gameMenu.updateTeams(data);
        // console.log();
    },
    successJoinToGame: function (data) {
        this.nameGame = data.nameGame;
        gameMenu.OnSuccessJoinToGame();
        //this.startGame(this.nameGame);
    },
    startGame: function () {
        transportClient.startGame(this.nameGame);
    },
    addBootToTeam: function (indexTeam) {
        var team = this.teamsInGame[indexTeam];
        if (team) {
            transportClient.addBootToTeam(team.id);
        }
    },
    kickPlayer: function (playerInfo) {

        transportClient.kickPlayer(playerInfo);

    },
    onKickOurFromGame: function (data) {
        gameMenu.showListGamesScreen();
    },
    destroyGame: function () {
        gameMenu.destroyGame();
    },
    onGameOver: function (data) {
        gameMenu.gameOver(data);
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
    setActiveKeyTouch: function (action, stateKey) {
        transportClient.setActiveKey(action, stateKey);
        console.log(action, stateKey);
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

