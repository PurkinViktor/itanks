var joystickControlTouch = {
    isDown: false,
    joystickUILayOut: $('<div class="Joystick"></div>'),
    fireUILayOut: $('<div class="FireArea"></div>'),
    hide: function () {
        this.isShow = false;
        this.joystickUILayOut.hide();
        this.fireUILayOut.hide();
    },
    isShow: false,
    show: function () {
        this.isShow = true;
        this.joystickUILayOut.show();
        this.fireUILayOut.show();
    },
    init: function (gameMenu) {

        // this.joystickUILayOut = gameMenu.joystickUI;
        // this.fireUILayOut = gameMenu.fireUI;

        gameMenu.layOut.append(this.joystickUILayOut);
        gameMenu.layOut.append(this.fireUILayOut);

        this.joystickUI = $('<div class="directionJoystick">' +
            '<div class="dirButtonJSK top"></div>' +
            '<div class="dirButtonJSK right" ></div>' +
            '<div class="dirButtonJSK left "></div>' +
            '<div class="dirButtonJSK bottom"></div>' +
            '<div class="centerJSK"></div>' +
            '</div>');

        this.fireUI = $('<div class="btnFire">' +
            '</div>');


        this.joystickUI.hide();
        this.joystickUILayOut.append(this.joystickUI);
        this.btnDirectionJSK = this.joystickUI.find(".dirButtonJSK");

        this.fireUI.hide();
        this.fireUILayOut.append(this.fireUI);


        var self = this;

        var events = {
            start: "touchstart",
            move: "touchmove",
            end: "touchend",
        };
        var directionLO = this.joystickUILayOut.attr('class');
        var fireLO = this.fireUILayOut.attr('class');
        var filterTouch = function (e, cbDirection, cbFire) {
            if (self.isShow) {
                e.preventDefault();
                e.stopPropagation();
            }
            return;

            cbDirection = cbDirection || function () {
                };
            cbFire = cbFire || function () {
                };
            var changedTouches = e.originalEvent.changedTouches;
            //var f = false;
            for (var i in changedTouches) {
                var elemTouch = changedTouches[i];
                var target = $(elemTouch.target);

                if (target.hasClass(directionLO)) {
                    cbDirection(elemTouch);
                    // f = true;
                }

                // if (target.hasClass(fireLO)) {
                //     //f = true;
                //     cbFire(elemTouch);
                // }


            }


        };
        $document = $(document);
        $document.on(events.start, function (e) {


            filterTouch(e, function (elemTouch) {
                self.OnMouseDown(elemTouch);

            }, function (elemTouch) {
                self.OnFireDoun(elemTouch);
            });
            // var elemTouch = e.originalEvent.changedTouches;
            // self.OnMouseDown(elemTouch[0]);


        });
        $document.on(events.move, function (e) {
            filterTouch(e, function (elemTouch) {
                var realTarget = document.elementFromPoint(elemTouch.clientX, elemTouch.clientY);

                self.handlerOnMouseMoveDirectionBatton($(realTarget));
                //console.log(e, realTarget);
            });
            // var elemTouch = e.originalEvent.changedTouches;
            // var realTarget = document.elementFromPoint(elemTouch[0].clientX, elemTouch[0].clientY);
            // console.log(e, realTarget);
            // self.handlerOnMouseMoveDirectionBatton($(realTarget));

        });
        $document.on(events.end, function (e) {
            filterTouch(e, function (elemTouch) {
                self.OnMouseUp(elemTouch);

                // console.log(elemTouch);
            }, function (elemTouch) {
                self.OnFireUp(elemTouch);
            });
            // var elemTouch = e.originalEvent.changedTouches;
            //
            // self.OnMouseUp(elemTouch[0]);
            //
            // console.log(elemTouch);
        });

        $document.on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("click was made");
        });
        $(window).on("click", function (e) {
            // e.preventDefault();
            //e.stopPropagation();
            console.log("window click was made");
        });


    },
    getPosition: function (LO, clickPos) {
        var pos = LO.position();
        var res = {};
        res.left = clickPos.pageX - pos.left;
        res.top = clickPos.pageY - pos.top;
        return res;
    },
    OnFireDoun: function (e) {

        this.fireUI.css(this.getPosition(this.fireUILayOut, e));
        this.fireUI.show();
        this.OnActiveKey("fire", true);
    },
    OnFireUp: function (e) {
        this.fireUI.hide();
        this.OnActiveKey("fire", false);

    },
    OnMouseDown: function (e) {
        this.isDown = true;

        // this.joystickUI.css({
        //     top: e.offsetY,
        //     left: e.offsetX
        // });
        this.joystickUI.css(this.getPosition(this.joystickUILayOut, e));
        this.joystickUI.show();
        //console.log(e);

    },

    onActiveKey: new CEvent(),
    activeDirection: "",
    handlerOnMouseMoveDirectionBatton: function (btn) {
        var activeDirection = "";
        var $btn = $(btn);
        if ($btn.hasClass("top")) {
            activeDirection = "top";
        }
        if ($btn.hasClass("left")) {
            activeDirection = "left";
        }
        if ($btn.hasClass("bottom")) {
            activeDirection = "bottom";
        }
        if ($btn.hasClass("right")) {
            activeDirection = "right";
        }
        if (activeDirection != "") {
            this.setActiveDirection(activeDirection);
        } else {
            this.setActiveDirection("centerJSK");
        }
    },

    setActiveDirection: function (direction) {
        if (this.activeDirection != direction) {
            this.btnDirectionJSK.removeClass("active");

            this.btnDirectionJSK.filter("." + direction).addClass("active");


            this.OnActiveKey(this.activeDirection, false);
            this.activeDirection = direction;
            this.OnActiveKey(this.activeDirection, true);
            //console.log(this.activeDirection);
        }


    },
    OnActiveKey: function (active, value) {
        if (active) {
            this.onActiveKey(active, value);
        }
    },

    OnMouseUp: function (e) {
        this.isDown = false;
        this.setActiveDirection("centerJSK");
        // this.OnActiveKey(this.activeDirection, false);
        this.joystickUI.hide();
    },
};