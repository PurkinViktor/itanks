var CMapsScreen = function (gameMenu, iTankClient) {
    var self = this;
    this.layOut = $("<div class='ListMapsLayOut'>" +
        "<div class='listPapsConteiner'></div>" +
        "<input type='button' class='btnCancel' value='Cancel'>" +
        "<div class='mapsContent'></div>" +

        "</div>");

    this.parentScreen = [];
    this.show = function (screen) {
        if(screen){
            this.parentScreen.push(screen);
        }

        this.layOut.show();
        iTankClient.getMaps();
        gameMenu.onSuccessJoinToGame.bind(this.showTeamsScreen, this);

    };
    this.hide = function () {
        this.layOut.hide();
        gameMenu.onSuccessJoinToGame.unBind(this.showTeamsScreen);
    };
    this.showTeamsScreen = function () {
        gameMenu.showTeams(self);
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
            gameMenu.cancel(self.parentScreen.pop());
            //self.iTankClient.newGame(nameGame);
        });



        var set = {items: []};
        set.location = this.layOut.find(".mapsContent");

        this.listMapsUI = new CListUI(set);
        this.listMapsUI.setClass("UlListPams");
        //this.listMapsUI.onItemSelected.bind(this.handler, this);
        this.listMapsUI.onItemSelected.bind(function (menu, item) {
            console.log(item);
            iTankClient.loadMapById(item.id);
           // gameMenu.showTeams(self);
        }, this);
        this.listMapsUI.getValueItem = function (item) {
            return item.value + " " + item.size;
        };

        this.listMapsUI.curentConstructionItem = function (li, item, index, items) {

            console.log(item, li);

            return li;
        };

    };
    gameMenu.layOut.append(this.layOut);
    this.init();
};

