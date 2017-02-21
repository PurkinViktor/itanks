var CJoystickControlTouchV4 = function () {
    /*



     */

    var joystickControlTouch = {
        isDown: false,
        joystickUILayOut: $('<div class="Joystick"></div>'),
        fireUILayOut: $('<div class="FireArea"></div>'),
        setViewControll: function (valueView) {
            this.isShow = valueView;

            var self = this;
            requestAnimationFrame(function (time) {

                if (self.isShow) {
                    self.joystickUILayOut.show();
                    self.fireUILayOut.show();
                } else {
                    self.joystickUILayOut.hide();
                    self.fireUILayOut.hide();
                }
            });


        },
        hide: function () {
            this.setViewControll(false);
            this.scaling("1.0");
        },
        isShow: false,
        show: function () {
            this.setViewControll(true);

            this.scalingTo(1000, 650);
        },
        scalingTo: function (widthContent, height) {
            var ratio = window.screen.width / widthContent;
            var ratioH = window.screen.height / height;


            if (ratio > ratioH) {
                ratio = ratioH;
            }

            this.scaling(ratio);
        },
        onScalingEnd: new CEvent(),
        scaling: function (ratio) {

            var self = this;
            requestAnimationFrame(function (time) {
                $('#Viewport').attr('content', 'width=device-width, initial-scale=' + ratio);
                self.onScalingEnd();
            });


        },

        render: function () {
            if (this.isDown) {
                this.joystickUI.show();

                this.joystickUI.find(".dirButtonJSK").removeClass("active");
                if (this.activeDirection) {
                    this.joystickUI.find("." + this.activeDirection).addClass("active");
                }

            } else {
                this.joystickUI.hide();
            }

            if (this.isFire) {
                this.fireUI.show();
            } else {
                this.fireUI.hide();
            }

        },
        init: function (gameMenu) {

            var self = this;

            $(".gameAreaContent").append(this.joystickUILayOut);
            $(".gameAreaContent").append(this.fireUILayOut);

            this.joystickUI = $('<div class="directionJoystick v4">' +
                '<div class="dirButtonJSK top"></div>' +
                '<div class="dirButtonJSK right"></div>' +
                '<div class="dirButtonJSK left"></div>' +
                '<div class="dirButtonJSK bottom"></div>' +
                '<div class="centerJSK"></div>' +
                '</div>');
            this.joystickUI.css({
                bottom: 30,
                left: 30
            });
            this.fireUI = $('<div class="btnFire">' +
                '</div>');
            this.fireUI.css({
                bottom: 30,
                right: 30
            });

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
            this.classOfJoystick = directionLO;
            var fireLO = this.fireUILayOut.attr('class');
            var filterTouch = function (e, cbDirection, cbFire) {
                // console.time("filterTouch");
                if (self.isShow) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    //e.stopPropagation();
                }


                cbDirection = cbDirection || function () {
                    };
                cbFire = cbFire || function () {
                    };

                var eventFucntion = function (changedTouches) {
                    for (var i in changedTouches) {
                        var elemTouch = changedTouches[i];
                        var target = $(elemTouch.target);

                        if (target.hasClass(directionLO)) {
                            cbDirection(elemTouch);

                        }

                        if (target.hasClass(fireLO)) {

                            cbFire(elemTouch);

                        }


                    }
                };
                var changedTouches = e.changedTouches;
                eventFucntion(changedTouches);
                //console.timeEnd("filterTouch");

                return !self.isShow;

            };

            var el = window;

            // var argvEvent = {capture: true, passive: true};
            var argvEvent = {capture: true};
            el.addEventListener("touchstart", function (e) {


                return filterTouch(e, function (elemTouch) {
                    self.OnMouseDown(elemTouch);

                }, function (elemTouch) {
                    self.OnFireDoun(elemTouch);
                });


            }, argvEvent);
            el.addEventListener("touchend", function (e) {
                return filterTouch(e, function (elemTouch) {
                    self.OnMouseUp(elemTouch);

                    // console.log(elemTouch);
                }, function (elemTouch) {
                    self.OnFireUp(elemTouch);
                });

            }, argvEvent);
            el.addEventListener("touchcancel", function (e) {// перехватываем чтобы анимация не лагала
                return filterTouch(e, function (elemTouch) {

                }, function (elemTouch) {

                });

            }, argvEvent);
            el.addEventListener("touchmove", function (e) {
                return filterTouch(e, function (elemTouch) {

                    self.OnMouseMove({pageX: elemTouch.clientX, pageY: elemTouch.clientY});
                    // var realTarget = document.elementFromPoint(elemTouch.clientX, elemTouch.clientY);
                    // self.handlerOnMouseMoveDirectionBatton($(realTarget));
                });
            }, argvEvent);


        },
        OnMouseMove: function (e) {


            this.posB = {x: e.pageX, y: e.pageY};

            var vector = this.subtract(this.posCenter, this.posB);
            var len = this.getLenVector(vector);
            var r = 75;
            if (len > r) {
                this.moveJoystick(r);
            }

            var activeDirection = "";
            if (len < 25) {
                activeDirection = "centerJSK";
            } else {
                var x = Math.abs(vector.x);
                var y = Math.abs(vector.y);

                if (x > y) {
                    if (vector.x < 0) {

                        activeDirection = "right";
                    } else {

                        activeDirection = "left";
                    }
                } else {
                    if (vector.y > 0) {

                        activeDirection = "top";
                    } else {

                        activeDirection = "bottom";
                    }
                }
            }
            this.setActiveDirection(activeDirection);

        },
        getLenVector: function (v) {
            var len = Math.sqrt(v.x * v.x + v.y * v.y);
            return len;
        },
        subtract: function (a, b) {
            var c = {};
            c.x = a.x - b.x;
            c.y = a.y - b.y;

            return c;
        },
        moveJoystick: function (r) {


            this.posCenter = this.calcNewPos(this.posB.x, this.posB.y, this.posCenter.x, this.posCenter.y, r);

        },
        calcNewPos: function (Xa, Ya, Xb, Yb, R) {

            Xa = parseInt(Xa, 10);
            Ya = parseInt(Ya, 10);
            Xb = parseInt(Xb, 10);
            Yb = parseInt(Yb, 10);
            R = parseInt(R, 10);
            var Rab = Math.sqrt(Math.pow((Xb - Xa), 2) + Math.pow(Yb - Ya, 2));
            var k = R / Rab;
            var Xc = Xa + (Xb - Xa) * k;
            var Yc = Ya + (Yb - Ya) * k;
            return {x: Xc, y: Yc};
        },

        isFire: false,
        OnFireDoun: function (e) {
            this.isFire = true;
            this.OnActiveKey("fire", true);
        },
        OnFireUp: function (e) { 
            this.isFire = false;
            this.OnActiveKey("fire", false);

        },
        posCenter: {x: 0, y: 0},
        posB: {x: 0, y: 0},

        OnMouseDown: function (e) {
            // console.log("вызываю из приложения", e);
            this.isDown = true;

            this.posCenter = {x: e.pageX, y: e.pageY};
            this.posB = {x: e.pageX, y: e.pageY};

        },

        onActiveKey: new CEvent(),
        activeDirection: "",


        setActiveDirection: function (direction) {
            if (this.activeDirection != direction) {


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
        },
    };
    return joystickControlTouch;
};