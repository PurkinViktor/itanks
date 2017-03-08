var CITanksClient = function () {
    this.init = function () {

    };
    this.tankOfClient = null;
    this.items = {};
    this.clientInfo = {
        teamId: false,
        login: false
    };
    this.onLogin = function (data) {
        this.login = data.login;
        this.clientInfo = data;
        console.log("LOGIN", this.clientInfo);
    };
    this.onLoginError = function (data) {

    };
    this.initGame = function (data) {

        this.battleArea = data.battleArea;

        for (var i in data.tanks) {
            var tank = data.tanks[i];
            if (tank.ownerId == "player_id_player_" + this.clientInfo.login) {
                tank.isMyTank = true;
                this.tankOfClient = tank;
                break;
            }
        }
        var arrTemp = data.tanks.concat(data.battleArea.barriers) || [];
        for (var i in arrTemp) {
            var item = arrTemp[i];
            this.items[item.id] = item;
        }

    };
    this.onUpdateDataItem = function (data) {
        if (data.id == tankControl.id) {
            //extend(delayCompensator, data);
            tankControl.position = data.position;
            tankControl.direction = data.direction;

        }

        //delayCompensator.onUpdateDataItem(f.eventName, data);
    };
    this.init();
};

