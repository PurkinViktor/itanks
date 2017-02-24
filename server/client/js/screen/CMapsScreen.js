var CMapsScreen = function (gameMenu, iTankClient) {
    var self = this;
    this.layOut = $("<div class='ListMapsLayOut'>" +

        "<input type='button' class='btnCancel' value='Cancel'>" +
        "<div class='MapsContent'></div>" +
        "<div class='paginationContent'></div>" +

        "</div>");

    //this.parentScreen = [];
    this.curentPageIndex = 0;
    this.countRecordOnPage = 20;
    this.countAllItens = false;
    this.show = function (screen) {

        this.layOut.show();
        this.doGetMap();
        gameMenu.onSuccessJoinToGame.bind(this.showTeamsScreen, this);
        gameMenu.setCurentScreen(this);

    };
    this.doGetMap = function () {
        iTankClient.getMaps({indexPage: self.curentPageIndex, limit: self.countRecordOnPage});
    };
    this.goBack = function () {
        gameMenu.cancel();
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
        this.countAllItens = data.count;
        for (var i in data.items) {
            var mapSet = data.items[i].value;
            var item = Utils.getInfoGameExtend(mapSet);
            item.id = data.items[i]._id;
            items.push(item);

        }


        this.listMapsUI.updateList(items);
        this.updatePagination();

    };
    this.updatePagination = function () {


        var items = [];
        for (var i = 0, iPage = 0; i < this.countAllItens; i = i + this.countRecordOnPage, iPage++) {
            var item = {indexPage: iPage};
            items.push(item);

        }
        this.paginationUI.updateList(items);
    };
    this.init = function () {
        iTankClient.onUpdateListMaps.bind(this.handlerUpdateListMaps, this);
        var btnCancel = this.layOut.find(".btnCancel");

        btnCancel.on("click", function () {
            self.goBack();
        });


        var set = {items: []};
        set.location = this.layOut.find(".MapsContent");

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

            //console.log(item, li);

            return li;
        };

        this.paginationUI = new CListUI({items: [], location: ".paginationContent"});
        this.paginationUI.setClass("UIpagination");
        this.paginationUI.onItemSelected.bind(function (menu, item) {
            console.log("paginationUI", item);
            this.curentPageIndex = item.indexPage;
            this.doGetMap();
            // gameMenu.showTeams(self);
        }, this);

        this.paginationUI.curentConstructionItem = function (li, item, index, items) {

            if (self.curentPageIndex == item.indexPage) {
                li.addClass("active");
            }
            //console.log(item, li);

            return li;
        };
    };
    gameMenu.layOut.append(this.layOut);
    this.init();
};

