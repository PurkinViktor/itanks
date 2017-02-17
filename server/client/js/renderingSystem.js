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
        var fpsBlock = $("<div class='fpsBlock'></div>");
        this.viewPort.append(fpsBlock);
        var self = this;


        var time = new Date().getTime();
        var count = 0;

        function updateScreen() {

            var now = new Date().getTime();
            var dt = now - time;
            count++;
            self.allRender();
            var ms = 1000;
            if (dt >= ms) {
                fpsBlock.text("fps: " + count + " in time: " + (dt / ms) + "s .");
                //console.log("fps: ", count, "time: ", dt);
                time = now;
                count = 0;
            }
            requestAnimationFrame(updateScreen);
        }

        requestAnimationFrame(updateScreen);

    },
    destroy: function () {
        this.blockInfoTank.remove();
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

            viewPort.append(this.createBlockInfoTank());
            $(set.parent).append(viewPort);
        }
        return viewPort;
    },
    blockInfoTank: null,
    createBlockInfoTank: function () {
        this.blockInfoTank = $('<div class="blockInfoTank">' +
            '<div class="XP_label">XP</div>' +
            '<div class="XP"></div>' +
            '<div class="Speed_label">Speed</div>' +
            '<div class="Speed"></div>' +
            '<div class="RateOfFire_label">Rate of fire</div>' +
            '<div class="RateOfFire"></div>' +
            '</div>');
        return this.blockInfoTank;
    },
    renderInfoTank: function (tankOfClient) {

        //var item = this.game.items[tankOfClient.id];
        var item = tankOfClient;


        switch (item.renderingSystemAction) {
            case undefined:
            case renderingSystemEnum.UPDATE:
                this.blockInfoTank.find(".XP").text(item.hp);
                this.blockInfoTank.find(".RateOfFire").text(item.countBullet);
                this.blockInfoTank.find(".Speed").text(1000 / item.timeIntervalMove);
                break;
        }

    },
    allRender: function () {
        this.renderInfoTank(this.game.tankOfClient);
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
                    //if (!item.renderingSystemActionDelete) {
                    this.renderItem(item);
                    //}
                    // if (item.isMyTank) {
                    //     //item viktorPC
                    //     console.log(item);
                    // }

                    break;
                case renderingSystemEnum.DELETE:
                    // this.destroyItem(item);
                    // delete arrItems[i];
                    break;
                case renderingSystemEnum.EXPLOSION:
                    this.renderExplosion(item);
                    break;
            }

            if (item.renderingSystemActionDelete) {
                this.destroyItem(item);
                //delete arrItems[i];
            }

        }
    },
    requestAnimationFrame: function (f) {
        requestAnimationFrame(function () {
            f();
        });
    },
    setAction: function (item, renderingSysEnum) {
        //тут можно логику попроще сделать теперь
        // удалить renderingSystemActionDelete
        if (renderingSysEnum == renderingSystemEnum.DELETE) {
            item.renderingSystemActionDelete = true;
            //console.log("delete  setAction ", item.id);
        }
        item.renderingSystemAction = renderingSysEnum;
        item.renderingSystemActionTime = new Date().getTime();
        //console.log("item", item.id, item.renderingSystemAction, item.renderingSystemActionTime, item);

    },

    destroyItem: function (item) {
        //console.log("delete  destroyItem ", item.id);
        if (item.renderObj) {
            //item.renderObj.stop("", true, true);
            item.renderObj.remove();
            //console.log("delete  IF true destroyItem ", item.id);

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
                item.renderObj.addClass("myTeam");
                if (item.isMyTank) {
                    // var layer = $('<div class="tankDrawLayer"></div>');
                    // item.renderObj.append(layer);

                    var point = $('<div class="myTeamFlag"></div>');
                    item.renderObj.append(point);
                    item.renderObj.addClass("playerMy");

                }
                // item.renderObj.append(layer.clone());
                //item.renderObj.append(layer.clone());
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