var gameMenu = {
    layOut: null,
    init: function (iTankClient) {
        this.iTankClient = iTankClient;
        this.layOut = $('<div class="gameMenuLayOut">' +
            '' +
            '</div>');
        $(".allContent").append(this.layOut);

        this.createListGame();
        this.createListTeams();
        this.createJoystick();

    },
    teams: [],
    updateTeams: function (data) {


        var teams = {};
        for (var i in data.players) {
            var client = data.players[i];
            if (!teams[client.teamId]) {
                teams[client.teamId] = [];
            }

            //client.itemCode = i;
            teams[client.teamId].push(client);
        }


        for (var idTeam in data.teams) {// дополняем массив игроков до максимального пустыми значениями
            var team = data.teams[idTeam];
            var arrPlayers = teams[team.id];
            if (!arrPlayers) {
                arrPlayers = [];
            }
            for (; arrPlayers.length < team.maxCountPlayers;) {
                arrPlayers.push({login: " --- ", teamId: team.id});
            }
            team.arrPlayers = arrPlayers;

        }


        for (var i in data.teams) {
            var clientArr = data.teams[i].arrPlayers;
            this.teams[i].updateList(clientArr);
        }

    },
    getHundlerBtnAddBoot: function (indexTeam) {
        var self = this;
        return function (e) {
            self.iTankClient.addBootToTeam(indexTeam);
            // self.onAddBootToTeam(indexTeam);
        }
    },
    getListTeamLayOut: function () {

        var self = this;
        var t = $("<div class='getListTeamLayOut'>" +
            "<div class='list'>" +
            // "<li></li>" +
            "</div>" +
            "<div class='gameListPanel'>" +
            "<input type='button' class='btnAddPlayer' value='Add Player'>" +
            "</div>" +
            "<div");
        var indexTeam = this.teams.length;
        t.find(".btnAddPlayer").on("click", this.getHundlerBtnAddBoot(indexTeam));

        var set = {items: [], location: t.find(".list")};
        var listTeamUI = new CListUI(set);
        listTeamUI.onItemSelected.bind(this.changeTeam, this);
        listTeamUI.getValueItem = function (item) {
            return item.login;
        };

        listTeamUI.curentConstructionItem = function (li, item, index, items) {

            if (self.iTankClient.clientInfo.login == item.login) {
                li.addClass("selfClient");
            }
            console.log(item);
            if (item.id !== undefined) {
                /// если id есть то это игрок или бот
                // id :"R80H8RXJKVLz_Mm3l6I8"
                // login                    :                    "vasa"
                // teamId                    :                    "team1"
                var btnKick = $('<div class="btnKickPlayer"></div>');
                li.append(btnKick);
                btnKick.on("click", self.getHundlerBtnKick(item))

            }

            return li;
        };
        this.teams.push(listTeamUI);
        return t;
    },
    // onAddBootToTeam: new CEvent(),
    getHundlerBtnKick:function (item) {
        var self = this;
        return function (e) {
            e.preventDefault();
            e.stopPropagation();
            self.iTankClient.kickPlayer(item);
        };

    },
    changeTeam: function (menu, item) {
        //this.iTankClient.joinGame
        //console.log("menu", menu, item);//itemCode

        this.iTankClient.switchToTeam(item.teamId);
    },
    getBtnStartGame: function () {
        var btn = $("<input type='button' class='btnStartGame' value='Start Game'>");
        var self = this;
        btn.on("click", function (e) {
            self.iTankClient.startGame();
        });
        return btn;
    },
    getListTeamsLayOut: function () {

        var listTeamsLayOut = $("<div class='ListTeamsLayOut'><div");
        //console.log(this.iTankClient.teamsInGame);
        var team = {};
        var t = this.getListTeamLayOut();
        // t.find(".btnAddPlayer").on("click", function (e) {
        //
        //     self.onAddBootToTeam();
        // });
        listTeamsLayOut.append(t);
        listTeamsLayOut.append(this.getListTeamLayOut());
        listTeamsLayOut.append(this.getBtnStartGame());

        return listTeamsLayOut;
    },
    createJoystick: function () {
        // this.joystickUI = $('<div class="Joystick"></div>');
        // this.fireUI = $('<div class="FireArea"></div>');


        // this.layOut.append(this.joystickUI);
        // this.layOut.append(this.fireUI);


        joystickControlTouch.init(this);
        joystickControlTouch.hide();
        joystickControlTouch.onActiveKey.bind(this.iTankClient.setActiveKeyTouch, this.iTankClient);


        // joystickControl.init(this.joystickUI);
        // joystickControl.onActiveKey.bind(this.iTankClient.setActiveKeyTouch, this.iTankClient);
        // this.joystickUI.on("mousedown", function (e) {
        //     joystickControl.OnMouseDown(e);
        // });
        // this.joystickUI.on("mousemove", function (e) {
        //     joystickControl.OnMouseMove(e);
        // });
        // this.joystickUI.on("mouseup", function (e) {
        //     joystickControl.OnMouseUp(e);
        // });
    },
    createListTeams: function () {
        this.listTeamsUI = this.getListTeamsLayOut();
        this.listTeamsUI.hide();
        this.layOut.append(this.listTeamsUI);
    },

    getListGameLayOut: function () {
        return $("<div class='ListGameLayOut'>" +
            "<div class='list'></div>" +
            "<div class='gameListPanel'>" +
            "<input type='text' placeholder='Name game' class='inputNameGame'>" +
            "<input type='button' class='btnAddGame' value='Add'>" +
            "</div>" +
            "<div");
    },
    createListGame: function () {
        var listGameLayOyt = this.getListGameLayOut();

        var inputNameGame = listGameLayOyt.find(".inputNameGame");
        var btnAddGame = listGameLayOyt.find(".btnAddGame");
        var self = this;
        btnAddGame.on("click", function () {
            var nameGame = inputNameGame.val();
            self.iTankClient.newGame(nameGame);
            // console.log("nameGame",nameGame);
        });
        this.layOut.append(listGameLayOyt);

        var set = {items: [], location: listGameLayOyt.find(".list")};
        // for (var i in list) {
        //     var nameGame = list[i];
        //     set.items.push({title: "Игра: " + nameGame, itemCode: i, value: nameGame});
        // }
        // if (this.listGamesMenu) {
        //     this.listGamesMenu.destroy();
        // }

        this.listGamesUI = new CListUI(set);
        this.listGamesUI.onItemSelected.bind(this.iTankClient.joinGame, this.iTankClient);
        //this.listGamesUI.show();
    },
    updateListGame: function (list) {
        var items = [];
        for (var i in list) {
            var gameInfo = list[i];
            //teamsOfGame
            //team.countPlayers < team.maxCountPlayers
            var maxPlayers = 0;
            var countPlayers = 0;
            var textTeamsInfo = "";
            for (var t in gameInfo.teamsOfGame) {
                var team = gameInfo.teamsOfGame[t];
                maxPlayers += team.maxCountPlayers;
                countPlayers += team.countPlayers;
                if (textTeamsInfo != "") {
                    textTeamsInfo = textTeamsInfo + "x";
                }
                textTeamsInfo += team.maxCountPlayers;
            }
            var textCountPlayers = "(" + countPlayers + '/' + maxPlayers + ")";
            var textTeamsInfo = "[" + textTeamsInfo + "]";


            items.push({
                title: "" + gameInfo.nameGame + " " + textTeamsInfo + " - " + textCountPlayers,
                value: gameInfo.nameGame
            });
        }
        this.listGamesUI.updateList(items);
    },
    hideAll: function () {
        this.layOut.find(".ListTeamsLayOut, .ListGameLayOut").hide();
        //this.listTeamsUI.hide();
    },
    showTeams: function () {
        this.hideAll();
        this.layOut.find(".ListTeamsLayOut").show();
    },
    showListGames: function () {
        this.hideAll();
        this.layOut.find(".ListGameLayOut").show();
    }
};
