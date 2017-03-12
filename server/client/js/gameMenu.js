var gameMenu = {
    layOut: null,
    init: function (iTankClient) {
        this.iTankClient = iTankClient;
        this.layOut = $('<div class="gameMenuLayOut">' +
            '' +
            '</div>');
        $(".allContent").append(this.layOut);


        this.createStatisticsScreen();


        this.mainScreen = new CMainScreen(this, this.iTankClient);
        this.mapsScreen = new CMapsScreen(this, this.iTankClient);
        this.listGameScreen = new CListGameScreen(this, this.iTankClient);
        this.listTeamsScreen = new CListTeamsScreen(this, this.iTankClient);
        this.newGameScreen = new CNewGameScreen(this, this.iTankClient);
        this.createMapScreen = new CCreateMapScreen(this, this.iTankClient);

        this.createJoystick();

        this.showListGamesScreen();

        android.onBack.bind(this.goBackScreen, this);

    },
    initGame: function () {
        this.joystickControl.onScalingEnd.bind(function () {
            this.joystickControl.onScalingEnd.clear();
            android.startTouch();
        }, this);
        renderingSystem.run(this.iTankClient);
        this.joystickControl.show();
        this.clearSteckScreen();
        android.onBack.unBind(this.goBackScreen);
    },
    gameOver: function (data) {
        console.log("onGameOver", data);

        android.stopTouch();
        this.joystickControl.setViewControll(false);
        this.showStatistics(data);
        renderingSystem.stop();

    },
    destroyGame: function () {
        renderingSystem.destroy();

        this.joystickControl.hide();
        this.showListGamesScreen();
        android.onBack.bind(this.goBackScreen, this);
    },
    goBackScreen: function () {
        var screen = this.getCurentScreen();
        if (screen) {
            screen.goBack();
        }
    },
    steckScreens: [],
    setCurentScreen: function (screen) {
        if (this.isPushScreen) {


            this.steckScreens.push(screen);
        }

    },
    getCurentScreen: function () {
        var sc = this.steckScreens[this.steckScreens.length - 1];
        if (sc) {
            return sc;
        }
        return false;
    },
    clearSteckScreen: function () {
        this.steckScreens = [];
    },
    isPushScreen: true,
    cancel: function () {
        //this.hideAll();
        var screen = this.steckScreens.pop();

        if (screen) {
            screen.hide();
        }
        screen = this.getCurentScreen();
        if (screen) {
            this.isPushScreen = false;
            screen.show(true);
            this.isPushScreen = true;
        }


    },
    updateTeams: function (data) {
        this.listTeamsScreen.updateTeams(data);
    },
    onSuccessJoinToGame: new CEvent(),
    OnSuccessJoinToGame: function () {
        this.onSuccessJoinToGame();
    },
    joystickControl: new CJoystickControlTouchV4(),
    createJoystick: function () {
        this.joystickControl.init(this);
        this.joystickControl.hide();
        this.joystickControl.onActiveKey.bind(this.iTankClient.setActiveKeyTouch, this.iTankClient);
    },
    createStatisticsScreen: function () {

        var lo = $("<div class='StatisticsLayOut'>" +
            "<div class='wrapperStatisticsLayOut'>" +
            "<div class='title'>Statistics of Game</div>" +
            "<div class='statisticsContent'></div>" +
            "<div class='statisticsPanel'>" +
            "<input type='button' class='btnContinue' value='Continue'>" +
            "</div>" +
            "</div>" +
            "<div");
        var self = this;
        lo.find(".btnContinue").on("click", function () {
            self.iTankClient.destroyGame();
        });

        this.statisticsUI = lo;
        this.statisticsUI.hide();
        this.layOut.append(this.statisticsUI);
    },

    updateListGame: function (list) {
        this.listGameScreen.updateList(list);
    },
    hideAll: function () {
        this.mainScreen.hide();
        this.mapsScreen.hide();
        this.listGameScreen.hide();
        this.listTeamsScreen.hide();
        this.newGameScreen.hide();
        this.createMapScreen.hide();

        this.layOut.find(".StatisticsLayOut").hide();
    },
    showMainScreen: function () {
        this.hideAll();
        this.mainScreen.show();
    },
    showMapsScreen: function (screen) {
        this.hideAll();
        this.mapsScreen.show(screen);
    },

    showNewGameScreen: function (screen) {
        this.hideAll();
        this.newGameScreen.show(screen);
    },
    showCreateMapScreen: function (screen) {
        this.hideAll();
        this.createMapScreen.show(screen);
    },

    showTeams: function (screen) {
        this.hideAll();
        this.listTeamsScreen.show(screen);
    },
    showStatistics: function (data) {
        this.hideAll();
        var msg = "You lose (((.";
        if (data.winner) {
            msg = "YOU WIN !!! )))";

        }
        this.statisticsUI.find(".statisticsContent").text(msg);
        this.statisticsUI.show();
    },
    showListGamesScreen: function (screen) {
        this.hideAll();
        this.listGameScreen.show(screen);
    }
};
