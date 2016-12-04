var renderingSystem = {
        viewPort: null,
        game: null,
        run: function (game) {
            this.game = game;
//        console.log('Callee: ',arguments.callee.name);
//        console.log('Caller: ',arguments.callee.caller.name);
            var set = {
                class: "battleArea",
                parent: "body",
                h: game.battleArea.h,
                w: game.battleArea.w,
                y: game.battleArea.y,
                x: game.battleArea.x

            };
            this.viewPort = this.createViewPort(set);
            this.allRender();
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
        }
        ,
        allRender: function () {
            this.render(this.game.items);
            //this.render(this.game.battleArea.barriers);
        }
        ,
        render: function (arrItems) {
            for (var i = 0; i < arrItems.length; i++) {
                var item = arrItems[i];
                this.renderItem(item);

            }
        },
        requestAnimationFrame: function (f) {
            requestAnimationFrame(function () {
                f();
            });
        },
        destroyItem: function (item) {
            if (item.renderObj) {
                item.renderObj.stop("", true, true);
                item.renderObj.remove();
                //item.renderObj = null;
            }
        }
        ,
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
            if (item.teamId && item.teamId == this.game.clientInfo.teamId) {
                var point = $('<div class="myTeam"></div>');
                item.renderObj.append(point);
                // item.renderObj.addClass("myTeam");
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

            item.renderObj.animate({
                    left: item.position.x,
                    top: item.position.y
                },
                {
                    step: function (aa, bb, cc) {


                    },
                    duration: duration
                }
            );
        },
        renderExplosion: function (item) {// взрыв
            if (item.direction === EnumDirection.top || item.direction === EnumDirection.bottom) {
                item.position.x -= 6;
            }
            if (item.direction === EnumDirection.left || item.direction === EnumDirection.right) {
                item.position.y -= 5;
            }
            this.createObj(item);

            var i = 0;
            var start = 100;
            var duration = 70;
            for (i = 1; i < item.typeObject.length; i++) {
                setTimeout(this.getHandler(function (index) {
                    item.renderObj.addClass(item.typeObject[index]);
                }, [i]), start + duration * i);

            }
            setTimeout(this.getHandler(function () {
                item.renderObj.remove();
            }), start + duration * 1.5 * i);
        }
        ,
        getHandler: function (func, arg) {
            var self = this;
            return function () {
                arguments = arg || arguments;
                func.apply(self, arguments);
            };
        }
    }
    ;