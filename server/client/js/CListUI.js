var CListUI = function (set) {

    set = set || {};
    var gameMenu = {
        // items: [
        //     {title: "Новая игра", itemCode: EnumMenu.newGame},
        //     {title: "Выход", itemCode: EnumMenu.exit},
        //     {title: "Настройки", itemCode: EnumMenu.settings}
        //
        // ],
        items: set.items || [],
        location: set.location || ".battleArea",
        menu: null,
        cbkeydownHundle: null,
        init: function () {
            this.createMenu(this.location);
            this.cbkeydownHundle = this.getHandler(this.keydownHundle);
            $(window).on("keydown", this.cbkeydownHundle);

        },
        destroy: function () {
            if (this.menu != null) {
                $(window).off("keydown", this.cbkeydownHundle);
                this.menu.remove();
            }
        },
        curentIndex: 0,
        onItemSelected: new CEvent(),
        keydownHundle: function (event) {
            switch (event.keyCode) {
                case 13:
                    this.onItemSelected(this, this.getCurentItem());
                    break;
                case 38:
                    this.curentIndex--;
                    if (this.curentIndex < 0) {
                        this.curentIndex = this.items.length - 1;
                    }
                    break;
                case 40:
                    this.curentIndex++;
                    break;
            }
            //this.curentIndex = Math.abs(this.curentIndex);
            this.curentIndex = this.curentIndex % this.items.length;
            this.renderItem();
        },
        getCurentItem: function () {
            return this.items[this.curentIndex];
        },
        setCurentItem: function (i) {
            this.curentIndex = i;
        },
        renderItem: function () {
            this.menu.find(".active").removeClass("active");
            //:eq(n)
            var n = this.curentIndex;
            this.menu.find("li:eq(" + n + ")").addClass("active");
        },
        createMenu: function (selector) {

            this.menu = $("<ul>");
            this.menu.addClass("gameMenu");

            this.updateList(this.items);
            // this.hide();
            this.renderItem();
            $(selector).append(this.menu);

        },
        updateList: function (items) {
            this.items = items;
            var menu = this.menu;
            menu.empty();
            for (var i in this.items) {
                var item = this.items[i];

                var li = $("<li>");
                li.get(0).dataItem = item;
                li.on("click", this.getHandler(this.itemClickHundler));
                li.text(this.getValueItem(item));
                menu.append(li);
            }
            // this.menu = menu;


        },
        getValueItem: function (item) {
            return item.title;
        },
        itemClickHundler: function (event) {
            event.currentTarget.dataItem;
            this.setCurentItem(event.currentTarget.dataItem.itemCode);
            this.onItemSelected(this, this.getCurentItem());
            //console.log(event.currentTarget.dataItem);
        },
        show: function () {
            this.menu.show(1000);
        },
        hide: function () {
            this.menu.hide(1000);
        },
        getHandler: function (func) {
            var self = this;
            return function () {

                func.apply(self, arguments);
            };
        }

    };
    gameMenu.init();
    return gameMenu;
};