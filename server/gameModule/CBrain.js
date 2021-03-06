var helper = require('./../GeneralClass/helper.js');
var EnumBarrier = require('./../GeneralClass/const.js').EnumBarrier;
var EnumTypePath = require('./../GeneralClass/CEnumTypePath.js');


var CBrain = function (settings, game) {
    this.intervalId = null;
    this.timeInterval = 200;
    this.game = game;
    //this.typePath = this.EnumTypePath.MIN;
    this.typePath = this.EnumTypePath.get(helper.randInt(this.EnumTypePath.MIN, this.EnumTypePath.MAX));
    // this.typePath = this.EnumTypePath.get("AVR");
    //this.typePath = this.EnumTypePath.get("RND");
    this.init = function () {

        //this.findGoalAndCalcPath();
        setTimeout(this.getHandler(function () {

            this.arrPath = this.findGoalAndCalcPath();
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
            if (this.tank) {
                this.tank.onMove.unBind(this.handlerOnMoveTank);
            }

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

CBrain.prototype.EnumTypePath = EnumTypePath;

CBrain.prototype.typePath = null;
CBrain.prototype.findGoalAndCalcPath = function () {
    var startPos = {x: 0, y: 0};
    startPos = this.tank.posCell;

    //var goalPos = {x: 9, y: 14};
    var goalPos = {x: 7, y: 0};
    for (var i in this.game.teamsOfGame) {
        var team = this.game.teamsOfGame[i];
        if (team.id != this.tank.teamId) {
            goalPos = team.IGLSettings
        }
    }

    // this.typePath = this.EnumTypePath.MAX;
    this.startPos = startPos;
    this.goalPos = goalPos;


    var arrPath = this.getPathForSelf();
    return arrPath;
};
CBrain.prototype.getPathForSelf = function () {
    return this.getPathFromTo(this.startPos, this.goalPos, this.typePath);
};

CBrain.prototype.getPathFromTo = function (startPos, goalPos, typePath) {
    console.log("startPos", startPos);
    console.log("goalPos", goalPos);
    console.log("typePath", typePath.toString());

    var map = this.getMapWithFoundAllPaths(startPos);
    this.printMap(map.aria);
    var arrPath = this.getPathTo(map.aria, goalPos, typePath);
    this.printArr(arrPath);
    return arrPath;
};

CBrain.prototype.getMapWithFoundAllPaths = function (startPos) {
    var map = this.getMap();

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
    return map;
};

CBrain.prototype.getNextCell = function (cell, pr, enumTypePath) {
    var nextCell = false;
    switch (enumTypePath) {
        case this.EnumTypePath.MIN :
            return cell.fromCellMin;
            break;
        case this.EnumTypePath.MAX :
            nextCell = cell.fromCellMax;
            break;
        case this.EnumTypePath.AVR :
            var i = Math.floor(cell.fromCellAll.length / 2);
            nextCell = cell.fromCellAll[i];
            // if (!nextCell || nextCell.value == 0) {
            //     var tt = 0;
            // }
            break;
        case this.EnumTypePath.RND :
            var i = helper.randInt(0, cell.fromCellAll.length - 1);
            //var i = Math.round(cell.fromCellAll.length / 2);
            nextCell = cell.fromCellAll[i];
            break;

    }
    if (pr == nextCell) {
        nextCell = cell.fromCellMin;
    }
    return nextCell;

};
CBrain.prototype.getPathTo = function (arr, goalPos, enumTypePath) {
    enumTypePath = enumTypePath || this.EnumTypePath.MIN;
    var cell = arr[goalPos.x][goalPos.y];

    var arrPath = [];
    var parentCell = cell;
    for (; cell && cell.value != 0;) {
        arrPath.unshift(cell);
        //arrPath.unshift(cell);
        var t = cell;
        cell = this.getNextCell(cell, parentCell, enumTypePath);
        parentCell = t;

    }
    return arrPath;
};

CBrain.prototype.printArr = function (arr) {

    for (var i in  arr) {

        var item = arr[i];
        console.log(item.value, ': {', item.x, ",", item.y, "} ", item.fromCellAll.length);
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
    if (cell && this.isPassableCell(cell)) {


        cell.fromCellAll = cell.fromCellAll || [];

        if (fromCell.fromCellMin && fromCell.fromCellMin == cell) {
            // не выставляем альтернативу родительскому элементу
            return;
        } else {

        }

        cell.fromCellAll.push(fromCell);
        cell.fromCellMax = fromCell;
        if (!cell.visit) {
            cell.fromCellMin = fromCell;
            cell.value = fromCell.value + 1;
            cell.visit = true;
            arrVisit.push(cell);
        }
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