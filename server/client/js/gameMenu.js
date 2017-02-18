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

        this.createJoystick();

        this.showListGamesScreen();

    },
    cancel: function (screen) {
        this.hideAll();
        screen.show();
    },
    updateTeams: function (data) {
        this.listTeamsScreen.updateTeams(data);
    },
    onSuccessJoinToGame: new CEvent(),
    OnSuccessJoinToGame: function () {
        this.onSuccessJoinToGame();
    },
    joystickControl: new CJoystickControlTouchV1(),
    createJoystick: function () {
        // this.joystickUI = $('<div class="Joystick"></div>');
        // this.fireUI = $('<div class="FireArea"></div>');


        // this.layOut.append(this.joystickUI);
        // this.layOut.append(this.fireUI);


        this.joystickControl.init(this);
        this.joystickControl.hide();
        this.joystickControl.onActiveKey.bind(this.iTankClient.setActiveKeyTouch, this.iTankClient);


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
