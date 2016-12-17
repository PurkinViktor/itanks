var android = {
    widthDevice: false,
    heightDevice: false,
    widthWindow: false,
    heightWindow: false,
    dx: 1,
    dy: 1,
    setResolution: function (w, h) {
        this.widthDevice = w;
        this.heightDevice = h;
        // this.widthWindow = $(window).width();
        // this.heightWindow = $(window).height();

        this.widthWindow = window.innerWidth;
        this.heightWindow = window.innerHeight;

        this.dx = window.innerWidth / w;
        this.dy = window.innerHeight / h;
        console.log("this.dx");
        console.log(this.dx);
        console.log("this.dy");

        console.log(this.dy);


    },
    reCalcPosition: function (pos) {
        //{pageX:40, pageY: 40}
        console.log("pos.pageX1");
        console.log(pos.pageX);
        pos.pageX = pos.pageX * this.dx;
        pos.pageY = pos.pageY * this.dy;
        console.log("pos.pageX2");
        console.log(pos.pageX);
        return pos;
    },
    OnTouch: function (pos) {

        joystickControlTouch.OnMouseDown(this.reCalcPosition(pos));
    },
    OnMove: function (pos) {

        joystickControlTouch.OnMouseMove(this.reCalcPosition(pos));
    },
    OnUp: function (pos) {

        joystickControlTouch.OnMouseUp(this.reCalcPosition(pos));
    },
    OnFireDoun: function (pos) {

        joystickControlTouch.OnFireDoun(this.reCalcPosition(pos));
    },
    OnFireUp: function (pos) {

        joystickControlTouch.OnFireUp(this.reCalcPosition(pos));
    },



    stopTouch: function () {
        if (window.InterfaceAndroid) {
            InterfaceAndroid.stopTouch();
        }
    },
    startTouch: function () {
        if (window.InterfaceAndroid) {
            InterfaceAndroid.startTouch();
        }
    }


}