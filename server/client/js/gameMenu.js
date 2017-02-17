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
    updateTeams: function (data) {
        this.listTeamsScreen.updateTeams(data);
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
    showMapsScreen: function () {
        this.hideAll();
        this.mapsScreen.show();
    },

    showTeams: function () {
        this.hideAll();
        this.listTeamsScreen.show();
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
    showListGamesScreen: function () {
        this.hideAll();
        this.listGameScreen.show();
    }
};
