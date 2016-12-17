var CBarrier = require('./CBarrier.js');
var EnumBarrier = require('./../GeneralClass/const.js').EnumBarrier;
var CEvent = require('./CEvent.js');
var helper = require('./helper.js');


module.exports = function (game) {
    var renderingSystem = game.renderingSystem;
    var battleArea = {
        x: "auto", y: 0, w: 600, h: 600,
        barriers: [],
        igls: [],
        map: null, // здесь только расчет сами обьекты в  barriers
        onIglKilled: new CEvent(),
        // testNewArea: function () {
        //     var ttt = new CBattleArea();
        //     ttt.init();
        //     var arr = [];
        //     arr[0] = {
        //         width: 28,
        //         height: 20,
        //         position: {x: 21, y: 21},
        //
        //     };
        //     ttt.insert(arr[0]);
        //     // ttt.insert({
        //     //     width: 8,
        //     //     height: 10,
        //     //     position: {x: 35, y: 35},
        //     // });
        //     var res = ttt.select({
        //         width: 8,
        //         height: 10,
        //         position: {x: 30, y: 30},
        //     });
        //     var aa = res[0];
        //     ttt.deleteItem(aa);
        //
        //
        //     res = ttt.select({
        //         width: 8,
        //         height: 10,
        //         position: {x: 30, y: 30},
        //     });
        //     console.log("itog", res);
        //
        //     // aa.width = 100;
        //     // console.log("itog bpvtyt", res);
        //     // console.log("aa", aa);
        //     // res = ttt.select({
        //     //     width: 8,
        //     //     height: 10,
        //     //     position: {x: 30, y: 30},
        //     // });
        //     // console.log("itog", res);
        //
        //
        //
        //
        // },
        init: function () {
//		this.createTestMap();


            this.cleanMap(); /// очищаем карту если она уже была
            this.createRandMap(10); // создаем только разметку на карте
            this.createMaps(this.map); // создаем сами обьеты на карте
            this.renderingMap(); // отрисовываем
        },
        cleanMap: function () { // по событию удаляется из масива поэтому так
            for (; this.barriers.length > 0;) {
                var barrier = this.barriers[0];
                barrier.destroy();
            }
        },
        addCellInMap: function (x, y, dataBarrier) {

            var cell = this.map[x][y] || {
                    infoCell: {},// не используется походу
                    barriers: []
                };
            cell.barriers.push(dataBarrier);
            this.map[x][y] = cell;

        },
        createCellOfMap: function (x, y, type, sixeCell) {

            if (x < 0 || y < 0 || this.map.length <= x || this.map[0].length <= y) {
                return;
            }
            for (var i = 0; i < sixeCell; i++) {
                for (var j = 0; j < sixeCell; j++) {

                    this.addCellInMap(x, y, CBarrier.create(x * sixeCell + i, y * sixeCell + j, type));
                }
            }
        },
        initMap: function (countX, countY) {
            this.map = new Array(countX);
            for (var i = 0; i < countX; i++) {
                this.map[i] = new Array(countY);
            }
        },
        createIGL: function (x, y) {
            var igl = CBarrier.create(x, y, EnumBarrier.igl);
            igl.width = CBarrier.width * this.sizeCell;
            igl.height = CBarrier.height * this.sizeCell;

            this.addCellInMap(x, y, igl);

            this.createCellOfMap(x - 1, y, EnumBarrier.default, this.sizeCell);
            this.createCellOfMap(x + 1, y, EnumBarrier.default, this.sizeCell);

            this.createCellOfMap(x - 1, y - 1, EnumBarrier.default, this.sizeCell);// верх
            this.createCellOfMap(x, y - 1, EnumBarrier.default, this.sizeCell);// верх
            this.createCellOfMap(x + 1, y - 1, EnumBarrier.default, this.sizeCell);// верх

            this.createCellOfMap(x - 1, y + 1, EnumBarrier.default, this.sizeCell);// низ
            this.createCellOfMap(x, y + 1, EnumBarrier.default, this.sizeCell);// низ
            this.createCellOfMap(x + 1, y + 1, EnumBarrier.default, this.sizeCell);// низ

            return igl;
        },
        sizeCell: 2, //размеры каждой ячейки , каждая ячейка раздроблена еще на 4 штуки
        // countX: null, countY: null,
        size: {x: 0, y: 0},
        createRandMap: function (percenFilling) {

            var countX = this.w / CBarrier.width;
            var countY = this.h / CBarrier.height;

            this.size.x = countX;
            this.size.y = countY;

            var sizeCell = this.sizeCell;
            var countCellX = countX / sizeCell;
            var countCellY = countY / sizeCell;
            //var allCell = countCellX * countCellY;

            this.initMap(countCellX, countCellY);
            for (var i in  game.teamsOfGame) {
                var team = game.teamsOfGame[i];
                // team.IGLSettings.onKill.bind(
                //     function () {
                //
                //     }
                // );
                var igl = this.createIGL(team.IGLSettings.x, team.IGLSettings.y);
                igl.teamId = team.id;
                //igl.onKill = team.IGLSettings.onKill;

            }
            //this.createIGL(7, 14);


            for (var x = 0; x < countCellX; x++) {

                for (var y = 0; y < countCellY; y++) {
                    if (this.map[x][y] === undefined && helper.randInt(0, 100) < percenFilling) {

                        this.createCellOfMap(x, y, helper.randInt(0, 4), sizeCell);
                        //this.map.push(CBarrier.create(x, y, helper.randInt(0, 2)));
                    }
                }
            }

        },
//	createTestMap: function() {
//		this.map = [];
//		var colX = 30;
//		var colY = 30;
//		for (var i = 15; i < colX; i++) {
//			for (var j = 15; j < colY; j++) {
//				this.map.push(CBarrier.create(i, j, helper.randInt(0, 2)));
//			}
//		}
//	},
        createMaps: function (map) {
            //var countBarr = 4;
            for (var i in map) {
                for (var j in map[i]) {
                    for (var n in map[i][j].barriers) {
                        this.createBarrier(map[i][j].barriers[n]);
                    }

                }
            }
        },
        renderingMap: function () {
            for (var i in this.barriers) {
                renderingSystem.renderItem(this.barriers[i]);
            }
        },
        createBarrier: function (set) {
            var bar = new CBarrier(set);
            bar.onDestroy.bind(this.removeBarrier, this);// = this.getHandler(this.removeBarrier);

            if (bar.type === EnumBarrier.igl) {
                bar.onDestroy.bind(this.onIglKilled, this);
            }
            this.barriers.push(bar);
        },
        // OnIglKilled: function () {
        //     this.onIglKilled();
        // },
        removeBarrier: function (barrier) {
            var i = this.barriers.indexOf(barrier);
            renderingSystem.destroyItem(this.barriers[i]);
            this.barriers.splice(i, 1);
        },
        getHandler: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        }
    };
    // var renderingSystem = { // заглушка
    //     renderItem: function () {
    //
    //     },
    //     destroyItem: function () {
    //
    //     }
    // };
    //battleArea.init();
    return battleArea;
};

var CBattleArea = function () {
    this.arrData = [];// в итоге двух мерный массив
    // var countX = this.w / CBarrier.width;
    // var countY = this.h / CBarrier.height;
    this.cellWidthPX = CBarrier.width; // размер ячейки в пикселях
    this.cellHeightPX = CBarrier.height;
    var countX = 30;
    var countY = 30;
    this.init = function () {
        for (var i = 0; i < countX; i++) {
            this.arrData.push(new Array());

            for (var j = 0; j < countY; j++) {

                this.arrData[i].push(this.createCell({}));
            }

        }
    };

    this.createCell = function (set) {
        return {
            items: [],
        };
    };
    this.getItems = function (item, func) {
        this.getCellOfMiniArea(this.getIndexsMiniArea(item), function (cell, x, y) {

            for (var i = 0; i < cell.items.length; i++) {
                var itemInArea = cell.items[i];
                func(itemInArea, cell, x, y);
            }

        });
    };
    this.select = function (sector) {
        var res = [];
        this.getItems(sector, function (itemInArea, cell, x, y) {
            if (helper.collision(itemInArea, sector)) {
                res.push(itemInArea);
                console.log("select ", cell, x, y);

            }
        });

        return res;
    };
    this.insert = function (item) {
        this.getCellOfMiniArea(this.getIndexsMiniArea(item), function (cell, x, y) {
            if (cell.items.indexOf(item) < 0) {
                cell.items.push(item);
                console.log("insert", cell, x, y, cell.items);

            }
        });
    };
    this.deleteItem = function (item) {
        this.getCellOfMiniArea(this.getIndexsMiniArea(item), function (cell, x, y) {
            var i = cell.items.indexOf(item);
            if (i >= 0) {
                console.log("deleteItem", cell, x, y, cell.items[i], i);

                cell.items.splice(i, 1);
            }
        });
    };
    this.getCellOfMiniArea = function (indexs, func) {
        //{x1: x1, y1: y1, x2: x2, y2: y2}
        for (var i = indexs.x1; i < indexs.x2; i++) {
            for (var j = indexs.y1; j < indexs.y2; j++) {
                func(this.arrData[i][j], i, j);
            }
        }
    };
    this.getIndexsMiniArea = function (item) {

        var topLeft = item.position;
        var bottomRight = {x: item.position.x + item.width, y: item.position.y + item.height};
        var x1 = Math.floor(topLeft.x / this.cellWidthPX);
        var y1 = Math.floor(topLeft.y / this.cellHeightPX);
        var x2 = Math.ceil(bottomRight.x / this.cellWidthPX);
        var y2 = Math.ceil(bottomRight.y / this.cellHeightPX);

        return {x1: x1, y1: y1, x2: x2, y2: y2};
        // item.width;
        // item.height;
        // item.position = {x: 30, y: 30};


    };

};
