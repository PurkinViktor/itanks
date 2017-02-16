var CMapsScreen = function (gameMenu, iTankClient) {
    this.layOut = $("<div class='ListMapsLayOut'>" +
        "<div class='listPapsConteiner'></div>" +
        "<input type='button' class='btnCancel' value='Cancel'>" +
        "<div class='mapsContent'></div>" +

        "</div>");

    this.show = function () {
        this.layOut.show();
        iTankClient.getMaps();
    };
    this.hide = function () {
        this.layOut.hide();

    };
    this.handlerUpdateListMaps = function (data) {
        console.log("handlerUpdateListMaps", data);
        var items = [];
        for (var i in data) {
            var mapSet = data[i].value;
            var item = Utils.getInfoGameExtend(mapSet);
            item.id = data[i]._id;
            items.push(item);

        }


        this.listMapsUI.updateList(items);

    };
    this.init = function () {
        iTankClient.onUpdateListMaps.bind(this.handlerUpdateListMaps, this);
        var btnCancel = this.layOut.find(".btnCancel");

        btnCancel.on("click", function () {
            gameMenu.showMainScreen();
            //self.iTankClient.newGame(nameGame);
        });
        gameMenu.layOut.append(this.layOut);


        var set = {items: []};
        set.location = this.layOut.find(".mapsContent");

        this.listMapsUI = new CListUI(set);
        this.listMapsUI.setClass("UlListPams");
        //this.listMapsUI.onItemSelected.bind(this.handler, this);
        this.listMapsUI.onItemSelected.bind(function (menu, item) {
            console.log(item);
            iTankClient.loadMapById(item.id);
        }, this);
        this.listMapsUI.getValueItem = function (item) {
            return item.value + " " + item.size;
            //return item.value.nameGame;
        };

        this.listMapsUI.curentConstructionItem = function (li, item, index, items) {

            console.log(item, li);

            return li;
        };

    };
    this.init();
};

