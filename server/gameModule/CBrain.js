var helper = require('./../GeneralClass/helper.js');
var EnumBarrier = require('./../GeneralClass/const.js').EnumBarrier;

var CBrain = function (settings, game) {
    this.intervalId = null;
    this.timeInterval = 200;
    this.game = game;
    this.init = function () {

        //this.calcPath();
        setTimeout(this.getHandler(function () {

            this.arrPath = this.calcPath();
            this.setActivate(true);
            this.tank.setActiveKey("fire", true);

        }), 1000);

    };
    this.setActivate = function (value) {
        if (value) {

            this.tank.onMove.bind(this.handlerOnMoveTank, this);
            // clearInterval(this.intervalId);
            // this.intervalId = setInterval(this.getHandler(this.callAction), this.timeInterval);
            this.callAction();
        }
        else {
            clearInterval(this.intervalId);
        }

    };
    this.destroy = function () {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.tank = null;
    };
    this.tank = settings.tank || null;

    this.keyHundler = {1: "top", 2: "bottom", 3: "left", 4: "right", 5: "fire"};

    this.handlerOnMoveTank = function (t, oldPos, newPos) {
        var cell = this.arrPath[0];
        if (t.position.x - t.positionShift == cell.x * game.battleArea.widthCell &&
            t.position.y - t.positionShift == cell.y * game.battleArea.widthCell) {

            this.tank.posCell = this.arrPath.shift();
            this.callAction();
        }

    };
    this.curentAction = "";
    this.callAction = function () {
        if (!this.tank.isKill) {


            var cell = this.arrPath[0];

            var action = "";
            if (cell) {
                if (cell.x != this.tank.posCell.x) {

                    if (cell.x > this.tank.posCell.x) {
                        action = this.keyHundler[4];
                    } else {
                        action = this.keyHundler[3];
                    }
                }
                else if (cell.y != this.tank.posCell.y) {

                    if (cell.y > this.tank.posCell.y) {
                        action = this.keyHundler[2];
                    } else {
                        action = this.keyHundler[1];
                    }
                }

            } else {
                this.tank.setActiveKey(this.keyHundler[1], false);
                this.tank.setActiveKey(this.keyHundler[2], false);
                this.tank.setActiveKey(this.keyHundler[3], false);
                this.tank.setActiveKey(this.keyHundler[4], false);
                this.tank.setActiveKey(this.keyHundler[5], true);

            }

            if (this.curentAction != action) {
                //var action = this.keyHundler[helper.randInt(1, 5)];
                this.tank.setActiveKey(this.curentAction, false);
                this.curentAction = action;
                this.tank.setActiveKey(action, true);
            }
            //this.tank.callAction();
        } else {
            this.destroy();
        }
    };
    this.qqqq = function () {

    };
    this.getHandler = function (func) {
        var self = this;
        return function () {
            func.apply(self, arguments);
        };
    };
    this.init();
};

CBrain.prototype.calcPath = function () {
    var map = this.getMap();

    var startPos = {x: 0, y: 0};
    startPos = this.tank.posCell;
    console.log("startPos", startPos);
    var arrVisit = [];
    var startCell = this.getCell(map, startPos);
    startCell.visit = true;
    arrVisit.push(startCell);
    for (; arrVisit.length > 0;) {
        var cellA = arrVisit.shift();


        var cellL = this.getCell(map, {x: cellA.x - 1, y: cellA.y});
        var cellR = this.getCell(map, {x: cellA.x + 1, y: cellA.y});
        var cellT = this.getCell(map, {x: cellA.x, y: cellA.y - 1});
        var cellB = this.getCell(map, {x: cellA.x, y: cellA.y + 1});

        this.visitCell(arrVisit, cellA, cellL);
        this.visitCell(arrVisit, cellA, cellR);
        this.visitCell(arrVisit, cellA, cellT);
        this.visitCell(arrVisit, cellA, cellB);

    }

    //var goalPos = {x: 9, y: 14};
    var goalPos = {x: 7, y: 0};
    for (var i in this.game.teamsOfGame) {
        var team = this.game.teamsOfGame[i];
        if (team.id != this.tank.teamId) {
            goalPos = team.IGLSettings
        }
    }


    var arrPath = this.getPathTo(map.aria, goalPos);
    this.printMap(map.aria);
    this.printArr(arrPath);
    return arrPath;


};
CBrain.prototype.getPathTo = function (arr, goalPos) {
    var cell = arr[goalPos.x][goalPos.y];

    var arrPath = [];
    for (; cell && cell.value != 0;) {
        arrPath.unshift(cell);
        //arrPath.unshift(cell);
        cell = cell.fromCell;
    }
    return arrPath;
};

CBrain.prototype.printArr = function (arr) {

    for (var i in  arr) {

        var item = arr[i];
        console.log(item.value, item.x, item.y);
        // var value = "|" + item.value + "   ";
        //
        // var s = value.substr(0, 4);

    }
};

CBrain.prototype.printMap = function (arr) {

    for (var i in  arr) {
        var s = "";
        for (var j in  arr[i]) {

            var item = arr[j][i];
            var value = "|" + item.value + "   ";

            s = s + value.substr(0, 4);
        }
        console.log(s);
    }


};

CBrain.prototype.visitCell = function (arrVisit, fromCell, cell) {
    if (cell && this.isPassableCell(cell) && !cell.visit) {
        cell.visit = true;
        cell.value = fromCell.value + 1;
        cell.fromCell = fromCell;
        arrVisit.push(cell);
    }
};

CBrain.prototype.isPassableCell = function (cell) {
    if (cell.teamId == this.tank.teamId) {
        return false;
    }
    if (cell.type == null || cell.type == EnumBarrier.default ||
        cell.type == EnumBarrier.forest || cell.type == EnumBarrier.igl)
        return true;
    return false;
};
CBrain.prototype.getCell = function (map, pos) {

    if (map.size.x < pos.x || map.size.y < pos.y || pos.x < 0 || pos.y < 0) {
        return null;
    }
    var cell = null;
    if (map.aria[pos.x] && map.aria[pos.x][pos.y]) {
        cell = map.aria[pos.x][pos.y];
    }

    return cell;

};
CBrain.prototype.getMap = function () {
    var BAMam = this.game.battleArea.map;

    var x = BAMam.length;
    var y = BAMam[0].length;
    var map = [];
    for (var i = 0; i < x; i++) {
        map.push([]);
        for (var j = 0; j < x; j++) {
            var itemBA = BAMam[i][j];
            var item = {
                type: null,
                visit: false,
                value: 0,
                x: i,
                y: j
            };
            if (itemBA) {
                item.type = itemBA.barriers[0].type;
                item.teamId = itemBA.barriers[0].teamId;
                //item.value = "-";

            }
            map[i].push(item);
        }
    }
    return {size: {x: x, y: y}, aria: map};
};

module.exports = CBrain;