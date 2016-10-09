var CBarrier = require('./CBarrier.js');
var EnumBarrier = require('./../GeneralClass/const.js').EnumBarrier;
var CEvent = require('./CEvent.js');
var helper = require('./helper.js');

module.exports = function () {
    var battleArea = {
        x: 40, y: 10, w: 600, h: 600,
        barriers: [],
        map: null, // здесь только расчет сами обьекты в  barriers
        onIglKilled: new CEvent(),
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
            igl.width = 40;
            igl.height = 40;
            this.addCellInMap(x, y, igl);

            this.createCellOfMap(x - 1, y, EnumBarrier.default, this.sizeCell);
            this.createCellOfMap(x + 1, y, EnumBarrier.default, this.sizeCell);
            this.createCellOfMap(x - 1, y - 1, EnumBarrier.default, this.sizeCell);
            this.createCellOfMap(x, y - 1, EnumBarrier.default, this.sizeCell);
            this.createCellOfMap(x + 1, y - 1, EnumBarrier.default, this.sizeCell);

        },
        sizeCell: 2, //размеры каждой ячейки , каждая ячейка раздроблена еще на 4 штуки
        createRandMap: function (percenFilling) {

            var countX = this.w / CBarrier.width;
            var countY = this.h / CBarrier.height;
            var sizeCell = this.sizeCell;
            var countCellX = countX / sizeCell;
            var countCellY = countY / sizeCell;
            //var allCell = countCellX * countCellY;

            this.initMap(countCellX, countCellY);
            this.createIGL(7, 14);


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
                bar.onDestroy.bind(this.OnIglKilled, this);
            }
            this.barriers.push(bar);
        },
        OnIglKilled: function () {
            this.onIglKilled();
        },
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
    var renderingSystem = { // заглушка
        renderItem: function () {

        },
        destroyItem: function () {

        }
    };
    //battleArea.init();
    return battleArea;
};
