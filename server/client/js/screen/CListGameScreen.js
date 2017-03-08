var CListGameScreen = function (gameMenu, iTankClient) {
    var self = this;
    this.layOut = $("<div class='ListGameLayOut'>" +
        "<div class=' topPanel'>" +
        "<input type='button' class='btnLoadMap' value='Load Map'>" +
        "<div class='title'>THE TANKS</div>" +
        "</div>" +
        "<div class='list'></div>" +
        "<div class='gameListPanel'>" +
        //"<input type='text' placeholder='Name game' class='inputNameGame'>" +
        "<input type='button' class='btnAddGame' value='Add'>" +
        "</div>" +
        "<div");

    this.show = function () {
        this.layOut.show();
        gameMenu.onSuccessJoinToGame.bind(this.showTeamsScreen, this);
        gameMenu.setCurentScreen(this);
    };
    this.hide = function () {
        this.layOut.hide();
        gameMenu.onSuccessJoinToGame.unBind(this.showTeamsScreen);
    };
    this.showTeamsScreen = function () {
        gameMenu.showTeams(self);
    };
    this.goBack = function () {

    };
    this.init = function () {
        var listGameLayOyt = this.layOut;

       // var inputNameGame = listGameLayOyt.find(".inputNameGame");
        var btnAddGame = listGameLayOyt.find(".btnAddGame");
        var btnLoadMap = listGameLayOyt.find(".btnLoadMap");
        // var self = this;
        btnLoadMap.on("click", function (e) {

            gameMenu.showMapsScreen(self);
            // console.log("nameGame",nameGame);
            return false;
        });
        btnAddGame.on("click", function () {
            gameMenu.showNewGameScreen(self);

            // var nameGame = inputNameGame.val();
            // iTankClient.newGame(nameGame);

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
        this.listGamesUI.onItemSelected.bind(iTankClient.joinGame, iTankClient);

    };
    this.updateList = function (list) {
        var items = [];
        for (var i in list) {
            var gameInfo = list[i];
            items.push(Utils.getInfoGameExtend(gameInfo));
        }
        this.listGamesUI.updateList(items);
    };
    gameMenu.layOut.append(this.layOut);
    this.init();
};

