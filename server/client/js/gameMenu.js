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
            teams[client.teamId].push(client);
        }


        var i = 0;
        for (var idTeam in teams) {
            this.teams[i].updateList(teams[idTeam]);
            i++;
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
        listTeamUI.getValueItem = function (item) {
            return item.login;
        }
        this.teams.push(listTeamUI);
        return t;
    },
    getListTeamsLayOut: function () {

        var listTeamsLayOut = $("<div class='ListTeamsLayOut'><div");
        listTeamsLayOut.append(this.getListTeamLayOut());
        listTeamsLayOut.append(this.getListTeamLayOut());
        listTeamsLayOut.append("<input type='button' class='btnStartGame' value='Start Game'>");

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
