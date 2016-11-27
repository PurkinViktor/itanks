var joystickControl = {
    isDown: false,
    joystickUILayOut: null,
    init: function (joystickUI) {
        this.joystickUILayOut = joystickUI;
        this.joystickUI = $('<div class="directionJoystick">' +
            '<div class="dirButtonJSK top"></div>' +
            '<div class="dirButtonJSK right" ></div>' +
            '<div class="dirButtonJSK left "></div>' +
            '<div class="dirButtonJSK bottom"></div>' +
            '<div class="centerJSK"></div>' +
            '</div>');
        var self = this;
        this.joystickUI.find(".centerJSK").on("mousemove", function (e) {
            self.setActiveDirection("centerJSK");
            return false;
        });



        this.joystickUI.hide();
        this.joystickUILayOut.append(this.joystickUI);
        this.btnDirectionJSK = this.joystickUI.find(".dirButtonJSK");
        this.btnDirectionJSK.on("mousemove", function (e) {
            self.handlerOnMouseMoveDirectionBatton(this);

        });
    },
    posA: {x: 0, y: 0},
    posB: {x: 0, y: 0},
    OnMouseDown: function (e) {
        this.isDown = true;
        this.posA = {x: e.pageX, y: e.pageY};
        this.joystickUI.css({
            top: e.offsetY,
            left: e.offsetX
        });
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