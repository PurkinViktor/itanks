var CListTeamsScreen = function (gameMenu, iTankClient) {
    var self = this;
    this.layOut = $("<div class='ListTeamsLayOut'>" +
        "<div class='topPanel'>" +
        "<input type='button' class='btnCancel' value='Cancel'>" +
        "<div   class='NameGame'></div>" +
        "</div>" +
        "</div>");
    this.parentScreen = [];
    this.show = function (screen) {
        if (screen) {
            this.parentScreen.push(screen);
        }
        this.layOut.show();
        this.updateScreen();
    };
    this.updateScreen = function () {
        var NameGame = this.layOut.find(".NameGame");
        NameGame.text(iTankClient.nameGame);
    };

    this.hide = function () {
        this.layOut.hide();


    };
    this.init = function () {


        var listTeamsLayOut = this.layOut;

        var btnCancel = this.layOut.find(".btnCancel");

        btnCancel.on("click", function () {
            gameMenu.cancel(self.parentScreen.pop());
            //self.iTankClient.newGame(nameGame);
        });

        var t = this.getListTeamLayOut();

        listTeamsLayOut.append(t);
        listTeamsLayOut.append(this.getListTeamLayOut());
        listTeamsLayOut.append(this.getBtnStartGame());


    };
    this.updateList = function (list) {
        var items = [];
        for (var i in list) {
            var gameInfo = list[i];
            items.push(Utils.getInfoGameExtend(gameInfo));
        }
        this.listGamesUI.updateList(items);
    };

    this.teams = [];
    this.updateTeams = function (data) {


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

    };
    this.getHundlerBtnAddBoot = function (indexTeam) {
        //var self = this;
        return function (e) {
            iTankClient.addBootToTeam(indexTeam);
            // self.onAddBootToTeam(indexTeam);
        }
    };
    this.getListTeamLayOut = function () {

        var self = this;
        var t = $("<div class='getListTeamLayOut'>" +
            "<div class='list'>" +
            "<input type='button' class='btnAddPlayer' value='+'>" +
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

            if (iTankClient.clientInfo.login == item.login) {
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
    };
    // onAddBootToTeam: new CEvent(),
    this.getHundlerBtnKick = function (item) {
        // var self = this;
        return function (e) {
            e.preventDefault();
            e.stopPropagation();
            iTankClient.kickPlayer(item);
        };

    };
    this.changeTeam = function (menu, item) {
        //this.iTankClient.joinGame
        //console.log("menu", menu, item);//itemCode

        iTankClient.switchToTeam(item.teamId);
    };
    this.getBtnStartGame = function () {
        var btn = $("<div class='bottomTeamScreen'>" +
            "<input type='button' class='btnStartGame' value='Start Game'>" +
            "</div>");
        // var self = this;
        btn.on("click", function (e) {
            iTankClient.startGame();
        });
        return btn;
    };
    // this.getListTeamsLayOut = function () {
    //
    //     var listTeamsLayOut = $("<div class='ListTeamsLayOut'><div");
    //
    //     var t = this.getListTeamLayOut();
    //     // t.find(".btnAddPlayer").on("click", function (e) {
    //     //
    //     //     self.onAddBootToTeam();
    //     // });
    //     listTeamsLayOut.append(t);
    //     listTeamsLayOut.append(this.getListTeamLayOut());
    //     listTeamsLayOut.append(this.getBtnStartGame());
    //
    //     return listTeamsLayOut;
    // };

    gameMenu.layOut.append(this.layOut);
    this.init();

};

