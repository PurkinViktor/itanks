var renderingSystemEnum = {
    NULL: 0,
    DELETE: 1,
    UPDATE: 2,
    EXPLOSION: 3
};
var renderingSystem = {
    viewPort: null,
    game: null,
    run: function (game) {
        this.game = game;
//        console.log('Callee: ',arguments.callee.name);
//        console.log('Caller: ',arguments.callee.caller.name);
        var set = {
            class: "battleArea",
            parent: ".gameAreaContent",
            h: game.battleArea.h,
            w: game.battleArea.w,
            y: game.battleArea.y,
            x: game.battleArea.x

        };
        this.viewPort = this.createViewPort(set);

        var self = this;


        var time = new Date().getTime();
        var count = 0;

        function updateScreen() {
            requestAnimationFrame(updateScreen);
            var now = new Date().getTime();
            var dt = now - time;
            count++;
            self.allRender();
            if (dt > 1000) {
                console.log("fps: ", count, "time: ", dt);
                time = now;
                count = 0;
            }
        }

        updateScreen();

    },
    destroy: function () {
        this.viewPort.remove();
    },
    createViewPort: function (set) {
        var viewPort = $("." + set.class);
        if (viewPort.length === 0) {


            viewPort = $("<div></div>");
            viewPort.addClass(set.class);
            viewPort.css({
                height: set.h,
                width: set.w,
                top: set.y,
                left: set.x
            });
            $(set.parent).append(viewPort);
        }
        return viewPort;
    },

    allRender: function () {
        this.render(this.game.items);
        //this.render(this.game.battleArea.barriers);
    },
    render: function (arrItems) {
        for (var i in arrItems) {
            var item = arrItems[i];

            var action = item.renderingSystemAction;
            item.renderingSystemAction = renderingSystemEnum.NULL;
            switch (action) {
                case undefined:
                case renderingSystemEnum.UPDATE:
                    this.renderItem(item);
                    break;
                case renderingSystemEnum.DELETE:
                    this.destroyItem(item);
                    delete arrItems[i];
                    break;
                case renderingSystemEnum.EXPLOSION:
                    this.renderExplosion(item);
                    break;
            }


        }
    },
    requestAnimationFrame: function (f) {
        requestAnimationFrame(function () {
            f();
        });
    },
    setAction: function (item, renderingSysEnum) {
        if(item.renderingSystemAction != renderingSystemEnum.DELETE){
            item.renderingSystemAction = renderingSysEnum;
            item.renderingSystemActionTime = new Date().getTime();
        }

        //console.log("item", item.id, item.renderingSystemAction, item.renderingSystemActionTime, item);

    },

    destroyItem: function (item) {
        if (item.renderObj) {
            //item.renderObj.stop("", true, true);
            item.renderObj.remove();
            //item.renderObj = null;
        }
    },
    createObj: function (item) {
        item.renderObj = $('<div class="obj"></div>');
        item.cssClassTemp = "";
        item.renderObj.css({
            width: item.width,
            height: item.height,
            left: item.position.x,
            top: item.position.y
        });
        item.renderObj.addClass(item.typeObject[0]);
        if (item.typeObject.indexOf("playerTank") > 0) {// если это танк тогда
            if (item.teamId && item.teamId == this.game.clientInfo.teamId) {

                if (item.typeObject.indexOf("playerTank") > 0) {// если это танк тогда
                    item.renderObj.addClass("myTeam");
                    if (item.ownerId == "player_id_player_" + this.game.clientInfo.login) {
                        // var layer = $('<div class="tankDrawLayer"></div>');
                        // item.renderObj.append(layer);
                        var point = $('<div class="myTeamFlag"></div>');
                        item.renderObj.append(point);
                        item.renderObj.addClass("playerMy");

                    }
                    // item.renderObj.append(layer.clone());
                    //item.renderObj.append(layer.clone());


                }
            } else {
                item.renderObj.addClass("opponentTeam");
            }
        }
        this.viewPort.append(item.renderObj);
    },
    renderItem: function (item) {


        if (item.renderObj) {


        } else {
            this.createObj(item);
        }

        var duration = item.durationAnimate || 200;
        item.renderObj.removeClass(item.cssClassTemp);
        switch (item.direction) {
            case EnumDirection.top:
                item.cssClassTemp = "dirTop";
                break;
            case EnumDirection.bottom:
                item.cssClassTemp = "dirBottom";
                break;
            case EnumDirection.left:
                item.cssClassTemp = "dirLeft";
                break;
            case EnumDirection.right:
                item.cssClassTemp = "dirRight";
                break;
        }
        item.renderObj.addClass(item.cssClassTemp);
        item.renderObj.attr("id", item.id);


        item.renderObj.stop(true, true);
        if (item.typeObject[1]) {
            if (item.renderObj.hasClass(item.typeObject[1])) {
                item.renderObj.removeClass(item.typeObject[1]);
            } else {
                item.renderObj.addClass(item.typeObject[1]);
            }
        }
        item.renderObj.css({
                left: item.position.x,
                top: item.position.y
            }
        );
        // item.renderObj.animate({
        //         left: item.position.x,
        //         top: item.position.y
        //     },
        //     {
        //         step: function (aa, bb, cc) {
        //
        //
        //         },
        //         duration: duration
        //     }
        // );
    },

    renderExplosion: function (item) {// взрыв


        // var i = 0;
        // var start = 100;
        var duration = 70;
        item.curentIndexExp = item.curentIndexExp || 1;
        item.timeExp = item.timeExp || 0;

        if (item.timeExp == 0) {
            if (item.direction === EnumDirection.top || item.direction === EnumDirection.bottom) {
                item.position.x -= 6;
            }
            if (item.direction === EnumDirection.left || item.direction === EnumDirection.right) {
                item.position.y -= 5;
            }
            this.createObj(item);
        }

        var time = new Date().getTime();

        if (item.timeExp <= time) {
            item.timeExp = time + duration;
            item.renderObj.addClass(item.typeObject[item.curentIndexExp]);
            item.curentIndexExp++;
        }
        this.setAction(item, renderingSystemEnum.EXPLOSION);

        if (item.curentIndexExp >= item.typeObject.length) {
            this.setAction(item, renderingSystemEnum.DELETE);
        }
        // for (i = 1; i < item.typeObject.length; i++) {
        //     setTimeout(this.getHandler(function (index) {
        //         item.renderObj.addClass(item.typeObject[index]);
        //     }, [i]), start + duration * i);
        //
        // }
        // setTimeout(this.getHandler(function () {
        //     item.renderObj.remove();
        // }), start + duration * 1.5 * i);
    },

    getHandler: function (func, arg) {
        var self = this;
        return function () {
            arguments = arg || arguments;
            func.apply(self, arguments);
        };
    }
};