var CITanksClient = function () {
    this.init = function () {

        this.pingMamager = new CPingManager(transportWorker);
    };

    this.sendUpdateDataForRendering = function (aData) {
        var data = {};

        data.pingMamager = helper.cutInObj(this.pingMamager, ["maxPing", "minPing", "ping", "averagePing"]);
        transportWorker.sendToUI.sendUpdateAllDataForRendering(data);

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
        this.tanks = data.tanks;

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

        rules.init(helper.cutInObj(this, ["battleArea", "tanks"]));

    };
    this.getItem = function (newData) {
        var item = this.items[newData.id];
        if (item) {
            return extend(item, newData);
        }

        this.items[newData.id] = newData;
        return newData;

    };

    this.onDestroyItem = function (dataItem) {
        var where = function (item, i, arr) {
            if (item.id == dataItem.id) {
                arr.splice(i, 1);
                return item;
            }
        };
        var tank = helper.findObjByWhere(this.tanks, where);
        var barier = helper.findObjByWhere(this.battleArea.barriers, where);


        // if (this.items[dataItem.id]) {
        //     delete this.items[dataItem.id]
        // }

        // rules.init(helper.cutInObj(this, ["battleArea", "tanks"]));


        //console.log("delete  ", t.id);
        // renderingSystem.setAction(t, renderingSystemEnum.DELETE);
    };

    // this.onRenderExplosion= function (dataItem) {
    //     dataItem.id = "explosion" + new Date().getTime();
    //     var t = this.getItem(dataItem);
    //     renderingSystem.setAction(t, renderingSystemEnum.EXPLOSION);
    // };

    this.onUpdateDataItem = function (newDataItem) {

        if (newDataItem.id == tankControl.id) {
            //extend(delayCompensator, data);
            tankControl.position = newDataItem.position;
            tankControl.direction = newDataItem.direction;
            tankControl.timeIntervalMove = newDataItem.timeIntervalMove;
            tankControl.timeIntervalFire = newDataItem.timeIntervalFire;
        } else {
            // var t = this.getItem(newDataItem);


            // var item = this.items[newDataItem.id];
            if (newDataItem.typeObject) {
                if (newDataItem.typeObject.indexOf("player") >= 0) {
                    var tank = helper.findObjByWhere(this.tanks, function (item) {
                        return item.id == newDataItem.id;
                    });
                    if (tank) {
                        extend(tank, newDataItem);
                    } else {
                        this.tanks.push(newDataItem);
                    }
                } else if (newDataItem.typeObject.indexOf("barrier") >= 0) {
                    var barier = helper.findObjByWhere(this.battleArea.barriers, function (item) {
                        return item.id == newDataItem.id;
                    });
                    if (barier) {
                        extend(barier, newDataItem);
                    } else {
                        this.battleArea.barriers.push(barier);
                    }
                }
            }
        }

        //renderingSystem.setAction(t, renderingSystemEnum.UPDATE);

        //delayCompensator.onUpdateDataItem(f.eventName, data);
    };
    //this.init();
};


