var joystickControlTouch = {
    isDown: false,
    joystickUILayOut: null,
    init: function (gameMenu) {

        this.joystickUILayOut = gameMenu.joystickUI;
        this.joystickUI = $('<div class="directionJoystick">' +
            '<div class="dirButtonJSK top"></div>' +
            '<div class="dirButtonJSK right" ></div>' +
            '<div class="dirButtonJSK left "></div>' +
            '<div class="dirButtonJSK bottom"></div>' +
            '<div class="centerJSK"></div>' +
            '</div>');
        // var self = this;
        // this.joystickUI.find(".centerJSK").on(events.move, function (e) {
        //     e.preventDefault();
        //     e.stopPropagation();
        //     self.setActiveDirection("centerJSK");
        //     return false;
        // });


        this.joystickUI.hide();
        this.joystickUILayOut.append(this.joystickUI);
        this.btnDirectionJSK = this.joystickUI.find(".dirButtonJSK");

        var self = this;

        var events = {
            start: "touchstart",
            move: "touchmove",
            end: "touchend",
        };
//target


        var filterTouch = function (e, cb) {
            e.preventDefault();
            e.stopPropagation();
            var changedTouches = e.originalEvent.changedTouches;
            for (var i in changedTouches) {
                var elemTouch = changedTouches[i];
                var target = $(elemTouch.target);
                if (target.hasClass("Joystick")) {
                    cb(elemTouch);
                }
            }
        };
        $document = $(document);
        $document.on(events.start, function (e) {


            filterTouch(e, function (elemTouch) {
                self.OnMouseDown(elemTouch);
                console.log(elemTouch);
            });
            // var elemTouch = e.originalEvent.changedTouches;
            // self.OnMouseDown(elemTouch[0]);


        });
        $document.on(events.move, function (e) {
            filterTouch(e, function (elemTouch) {
                var realTarget = document.elementFromPoint(elemTouch.clientX, elemTouch.clientY);

                self.handlerOnMouseMoveDirectionBatton($(realTarget));
                console.log(e, realTarget);
            });
            // var elemTouch = e.originalEvent.changedTouches;
            // var realTarget = document.elementFromPoint(elemTouch[0].clientX, elemTouch[0].clientY);
            // console.log(e, realTarget);
            // self.handlerOnMouseMoveDirectionBatton($(realTarget));

        });
        $document.on(events.end, function (e) {
            filterTouch(e, function (elemTouch) {
                self.OnMouseUp(elemTouch);

                console.log(elemTouch);
            });
            // var elemTouch = e.originalEvent.changedTouches;
            //
            // self.OnMouseUp(elemTouch[0]);
            //
            // console.log(elemTouch);
        });

        // this.btnDirectionJSK.on(events.move, function (e) {
        //    // e.preventDefault();
        //    // e.stopPropagation();
        //     self.handlerOnMouseMoveDirectionBatton(this);
        //     console.log("в джостике сработала", e);
        //
        // });
    },
    getPosition: function (clickPos) {
        var pos = this.joystickUILayOut.position();
        var res = {};
        res.left = clickPos.pageX - pos.left;
        res.top = clickPos.pageY - pos.top;
        return res;
    },
    posA: {x: 0, y: 0},
    posB: {x: 0, y: 0},
    OnMouseDown: function (e) {
        this.isDown = true;
        this.posA = {x: e.pageX, y: e.pageY};
        // this.joystickUI.css({
        //     top: e.offsetY,
        //     left: e.offsetX
        // });
        this.joystickUI.css(this.getPosition(e));
        this.joystickUI.show();
        console.log(e);

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
    OnMouseMove: function (e) {// событие лай оута
        // if (this.isDown) {
        //     this.posB = {x: e.pageX, y: e.pageY};
        //     var angle = this.getAngle();
        //     var activeDirection = "";
        //     if (angle >= 45 && angle < 135) {
        //         activeDirection = "right";
        //     }
        //     if (angle >= 135 && angle < 225) {
        //         activeDirection = "bottom";
        //     }
        //     if (angle >= 225 && angle < 315) {
        //         activeDirection = "left";
        //     }
        //     if (angle >= 315 && angle < 0 || angle >= 0 && angle < 45) {
        //         activeDirection = "top";
        //     }
        //     if (activeDirection != "") {
        //         this.setActiveDirection(activeDirection);
        //     }
        // }
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
    // getAngle: function () {
    //     return this.culcAngle(this.posA, this.posB);
    // },
    // culcAngle: function (center, point) {
    //     var x = point.x - center.x;
    //     var y = point.y - center.y;
    //     if (x == 0) return (y > 0) ? 180 : 0;
    //     var a = Math.atan(y / x) * 180 / Math.PI;
    //     a = (x > 0) ? a + 90 : a + 270;
    //     return a;
    // },
    OnMouseUp: function (e) {
        this.isDown = false;
        this.setActiveDirection("centerJSK");
        // this.OnActiveKey(this.activeDirection, false);
        this.joystickUI.hide();
    },
};