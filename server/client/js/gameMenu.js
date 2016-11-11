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
                arrPlayers.push({login: " --- ", teamId : team.id});
            }
            team.arrPlayers = arrPlayers;

        }


        for (var i in data.teams) {
            var clientArr = data.teams[i].arrPlayers;
            this.teams[i].updateList(clientArr);
        }

    },
    getListTeamLayOut: function () {

        var t = $("<div class='getListTeamLayOut'>" +
            "<ul class='list'>" +
            // "<li></li>" +
            "</ul>" +
            "<div class='gameListPanel'>" +
            "<input type='button' class='btnAddPlayer' value='Add Player'>" +
            "</div>" +
            "<div");

        var set = {items: [], location: t.find(".list")};
        var listTeamUI = new CListUI(set);
        listTeamUI.onItemSelected.bind(this.changeTeam, this);
        listTeamUI.getValueItem = function (item) {
            return item.login;
        }
        this.teams.push(listTeamUI);
        return t;
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
        listTeamsLayOut.append(this.getListTeamLayOut());
        listTeamsLayOut.append(this.getListTeamLayOut());
        listTeamsLayOut.append(this.getBtnStartGame());

        return listTeamsLayOut;
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
            var nameGame = list[i];
            items.push({title: "Игра: " + nameGame, itemCode: i, value: nameGame});
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
