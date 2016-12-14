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


    },
    reCalcPosition: function (pos) {
        //{pageX:40, pageY: 40}
        pos.pageX *= this.dx;
        pos.pageY *= this.dy;
        return pos;
    },
    OnTouch: function (pos) {
        console.log("pos");
        console.log(pos);
        joystickControlTouch.OnMouseDown(this.reCalcPosition(pos));
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