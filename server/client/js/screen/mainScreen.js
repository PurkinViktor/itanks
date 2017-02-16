var CMainScreen = function (gameMenu, iTankClient) {
    //self.iTankClient
    this.layOut = $("<div class='MainScreenLayOut'>" +
        "<input type='button' class='btnCreateJoin' value='Create / Join'>" +
        "<input type='button' class='btnLoadMap' value='Load Map'>" +
        "</div>");

    this.show = function () {
        this.layOut.show();
    };
    this.hide = function () {
        this.layOut.hide();

    };
    this.init = function () {
        var btnCreateJoin = this.layOut.find(".btnCreateJoin");
        var btnLoadMap = this.layOut.find(".btnLoadMap");
        var self = this;
        btnCreateJoin.on("click", function () {
            gameMenu.showListGames();
            //self.iTankClient.newGame(nameGame);

        });
        btnLoadMap.on("click", function () {
            //console.log("btnLoadMap");
            gameMenu.showMapsScreen();
            //self.iTankClient.getMaps();
            //self.iTankClient.newGame(nameGame);

        });
        gameMenu.layOut.append(this.layOut);
    };
    this.init();
};

