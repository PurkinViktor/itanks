var CJoystickControlTouchV2 = function () {
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


        init: function (gameMenu) {

            var self = this;

            $(".gameAreaContent").append(this.joystickUILayOut);
            $(".gameAreaContent").append(this.fireUILayOut);

            this.joystickUI = $('<div class="directionJoystick">' +
                '<div class="dirButtonJSK top"><div class="dirArea top"></div></div>' +
                '<div class="dirButtonJSK right"><div class="dirArea right"></div></div>' +
                '<div class="dirButtonJSK left"><div class="dirArea left"></div></div>' +
                '<div class="dirButtonJSK bottom"><div class="dirArea bottom"></div></div>' +
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
            this.classOfJoystick = this.joystickUILayOut.attr('class');
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
            var realTarget = document.elementFromPoint(e.pageX, e.pageY);
            var $btn = $(realTarget);
            if ($btn.hasClass(this.classOfJoystick)) {
                this.moveJoystick(e);//{x: e.pageX, y: e.pageY}
            } else {
                this.handlerOnMouseMoveDirectionBatton($btn);
            }

        },
        render: function (screen) {


        },
        moveJoystick: function (posMouse) {
            var self = this;
            requestAnimationFrame(function (time) {

                var pos = self.getPosition(self.joystickUILayOut, posMouse);
                //var h = this.joystickUI.height();
                var topCurent = self.joystickUI.css("top");
                var leftCurent = self.joystickUI.css("left");
                var r = 150;
                var newPos = self.calcNewPos(pos.left, pos.top, leftCurent, topCurent, r);
                console.log(newPos);
                self.joystickUI.css(newPos);

            });

        },
        calcNewPos: function (Xa, Ya, Xb, Yb, R) {

            Xa = parseInt(Xa, 10);
            Ya = parseInt(Ya, 10);
            Xb = parseInt(Xb, 10);
            Yb = parseInt(Yb, 10);
            R = parseInt(R, 10);
            var Rab = Math.sqrt(Math.pow((Xb - Xa), 2) + Math.pow(Yb - Ya, 2));
            var newPos = {left: Xb, top: Yb};
            if (Rab > R) {
                var k = R / Rab;
                var Xc = Xa + (Xb - Xa) * k;
                var Yc = Ya + (Yb - Ya) * k;
                newPos = {left: Xc, top: Yc};
            }
            return newPos;
        },
        getPosition: function (LO, clickPos) {

            var pos = LO.position();
            var res = {};
            res.left = clickPos.pageX - pos.left;
            res.top = clickPos.pageY - pos.top;
            return res;
        },
        OnFireDoun: function (e) {
            var self = this;
            requestAnimationFrame(function (time) {

                self.fireUI.css(self.getPosition(self.fireUILayOut, e));
                self.fireUI.show();
            });
            // this.fireUI.css(this.getPosition(this.fireUILayOut, e));
            // this.fireUI.show();
            this.OnActiveKey("fire", true);
        },
        OnFireUp: function (e) {
            this.fireUI.hide();
            this.OnActiveKey("fire", false);

        },
        OnMouseDown: function (e) {
            // console.log("вызываю из приложения", e);
            this.isDown = true;

            var self = this;
            requestAnimationFrame(function () {
                self.joystickUI.css(self.getPosition(self.joystickUILayOut, e));
                self.joystickUI.show();
            });

        },

        onActiveKey: new CEvent(),
        activeDirection: "",
        handlerOnMouseMoveDirectionBatton: function (btn) {

            var $btn = $(btn);


            var activeDirection = "";
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
                var self = this;
                requestAnimationFrame(function () {
                    self.btnDirectionJSK.removeClass("active");
                    self.btnDirectionJSK.filter("." + direction).addClass("active");
                });
                // this.btnDirectionJSK.removeClass("active");
                // this.btnDirectionJSK.filter("." + direction).addClass("active");


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


            //this.joystickUI.hide();

            var self = this;
            requestAnimationFrame(function () {
                self.joystickUI.hide();
            });
            this.setActiveDirection("centerJSK");
        },
    };
    return joystickControlTouch;
};