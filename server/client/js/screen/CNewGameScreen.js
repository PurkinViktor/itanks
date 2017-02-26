var CNewGameScreen = function (gameMenu, iTankClient) {
    var self = this;
    this.layOut = $("<div class='NewGameScreenLayOut'>" +

        "<input type='button' class='btnCancel' value='Cancel'>" +
        "<div class='NewGameScreenContent'>" +
        "<input type='text' placeholder='Name game' class='inputNameGame'>" +
        "<label for='idPercentFill'>Percent Fill</label>" +

        "<input type='number' id='idPercentFill' min='20' max='90' value='50' class='inputPercentFill'>" +
        "<input type='button' class='btnAddGame' value='Add'>" +
        "</div>" +

        "</div>");


    this.show = function (set) {
        this.layOut.show();
        gameMenu.onSuccessJoinToGame.bind(this.showTeamsScreen, this);
        gameMenu.setCurentScreen(this);
    };

    this.goBack = function () {
        gameMenu.cancel();
    };
    this.hide = function () {
        this.layOut.hide();
        gameMenu.onSuccessJoinToGame.unBind(this.showTeamsScreen);
    };

    this.showTeamsScreen = function () {
        gameMenu.showTeams(self);
    };
    this.init = function () {

        var btnCancel = this.layOut.find(".btnCancel");
        btnCancel.on("click", function () {
            self.goBack();
        });

        var inputNameGame = this.layOut.find(".inputNameGame");
        var btnAddGame = this.layOut.find(".btnAddGame");
        var inputPercentFill = this.layOut.find(".inputPercentFill");
        inputPercentFill.on("focusout", function () {
            var percentFill = inputPercentFill.val();
            percentFill = Math.max(percentFill, 20);
            percentFill = Math.min(percentFill, 90);
            inputPercentFill.val(percentFill);

        });
        btnAddGame.on("click", function () {
            var nameGame = inputNameGame.val();
            var percentFill = inputPercentFill.val();

            iTankClient.newGame({nameGame: nameGame, settingsMap: {percentFill: percentFill}});

            // console.log("nameGame",nameGame);
        });


    };
    gameMenu.layOut.append(this.layOut);
    this.init();
};

