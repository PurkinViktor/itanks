function IDGenerator(prefix) {
    this.prefix = prefix + '_';
    this.num = 1;
    this.getID = function () {
        return this.prefix + (+new Date()) + '_' + (this.num++);
    };
}


var idGenerator = new IDGenerator('id');

if (module && module.exports) {// подключается сервером
    module.exports = idGenerator;
}
