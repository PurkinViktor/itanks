var CCreateMapScreen = function (gameMenu, iTankClient) {
    // var prefix = "CreateMap";
    var self = this;
    this.layOut = $("<div class='CreateMapScreenLayOut'>" +

        "<input type='button' class='btnCancel' value='Cancel'>" +
        "<div class='CreateMapScreenContent'>" +


        "</div>" +
        "<div class='bottomPanel'>" +
        "<input type='text' placeholder='Name map' class='inputNameMap'>" +
        "<input type='button' class='btnDone' value='Done'>" +
        "</div>" +
        "</div>");


    this.show = function (set) {
        this.layOut.show();

        gameMenu.setCurentScreen(this);
    };

    this.goBack = function () {
        gameMenu.cancel();
    };
    this.hide = function () {
        this.layOut.hide();

    };

    this.showTeamsScreen = function () {
        gameMenu.showTeams(self);
    };
    this.init = function () {

        var btnCancel = this.layOut.find(".btnCancel");
        btnCancel.on("click", function () {
            self.goBack();
        });

        var inputNameMap = this.layOut.find(".inputNameMap");
        var btnDone = this.layOut.find(".btnDone");

        btnDone.on("click", function () {

            var map = createrMap.getMap();
            var size = createrMap.getSize();

            var nameMap = inputNameMap.val() || "MAP";
            var data = {nameMap: nameMap, size: size, map: map};
            iTankClient.createMap(data);

            console.log("map", data);
        });

        createrMap.init();

        var createMapScreenContent = this.layOut.find(".CreateMapScreenContent");
        var areaUI = createrMap.getArea();
        createMapScreenContent.append(areaUI);
        createMapScreenContent.append(managerMarkers.getPanelUI());


    };
    gameMenu.layOut.append(this.layOut);
    this.init();
};
var CManagerMarkers = function () {

    this.markers = [];
    this.markersPanelUI = null;
    this.init = function () {
        this.markers.push(new CMarker(null));
        for (var i in EnumBarrier.getEnumItems()) {
            var itemEnum = EnumBarrier[i];
            if (itemEnum == EnumBarrier.igl) {
                continue; // пока исключим орла
            }
            this.markers.push(new CMarker(itemEnum));
            //console.log(i, +EnumBarrier[i], EnumBarrier[i].toString());
        }

        var set = {items: [], location: false};


        this.markersPanelUI = new CListUI(set);
        this.markersPanelUI.onItemSelected.bind(this.setParker, this);
        this.markersPanelUI.curentConstructionItem = function (li, item, index, items) {
            item.itemValue.marking(li);
            return li;
        };

        for (var i in this.markers) {
            var item = this.markers[i];
            set.items.push({title: "", itemCode: i, value: "", itemValue: item});
        }

        this.markersPanelUI.updateList(set.items);
        this.markersPanelUI.setClass("markersPanelUI");
        this.markersPanelUI.OnItemSelected();// вызываем первый раз чтоб установить маркер по умаолчанию

        this.markersPanelUI = this.markersPanelUI.getLayOut();
    };
    this.setParker = function (listUI, set) {
        //console.log(set);
        createrMap.setMarker(set.itemValue);
    };
    this.getPanelUI = function () {
        return this.markersPanelUI;
    };

    this.init();
};


var CCreaterMap = function () {
    this.sizeMap = {x: 15, y: 15};

    this.map = null;
    this.tableUI = $("<table class='tableForCreateMap'></table>");
    this.getArea = function () {
        return this.tableUI;
    };
    this.getSize = function () {
        return this.sizeMap;
    };
    this.init = function () {
        this.initMap(this.sizeMap.x, this.sizeMap.y);

        this.createTableUI();

        this.onClikOnCell.bind(this.setMark, this);

    };
    this.marker = new CMarker(EnumBarrier.default);
    this.setMarker = function (marker) {
        this.marker = marker;
    };
    this.getMap = function () {
        return this.map;
    };
    this.setMark = function (x, y, event) {
        // this.marker =
        this.marker.marking(event.currentTarget);
        this.map[x][y] = this.marker.getMark();

        //console.log(arguments, event.currentTarget);
    };
    this.createTableUI = function () {
        for (var i in this.map) {
            //this.createElementUI("tr");
            var tr = this.createTRUI(i);
            this.tableUI.append(tr);
        }
    };
    this.onClikOnCell = new CEvent();
    this.createTRUI = function (iRow) {
        var tr = $("<tr></tr>");
        for (var i = 0; i < this.map[iRow].length; i++) {
            var td = $("<td></td>");
            td.on("click", this.onClikOnCell.getHandler(iRow, i));
            tr.append(td);
        }
        return tr;
    };

    this.initMap = function (countX, countY) {
        this.map = new Array(countX);
        for (var i = 0; i < countX; i++) {
            this.map[i] = new Array(countY);
        }
    };
};

var CMarker = function (itemEnum) {

    this.class = itemEnum && itemEnum.toString() || "";
    this.typeBarrier = itemEnum || null;
    this.marking = function (tdUI) {
        var elem = $(tdUI);
        elem.removeAttr("class");
        //elem.addClass(this.class);
        if (this.typeBarrier == EnumBarrier.igl) {
            elem.addClass(this.typeBarrier.toString());
        } else if (this.typeBarrier !== null) {
            elem.addClass(EnumBarrier.getClass(this.typeBarrier));
        }

    };
    this.getMark = function () {
        if (this.typeBarrier === null) {
            return null;
        }
        var r = {};
        r.typeBarrier = +this.typeBarrier;
        return r;
    };
};
var createrMap = new CCreaterMap();
var managerMarkers = new CManagerMarkers();

