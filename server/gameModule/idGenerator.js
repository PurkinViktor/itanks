function IDGenerator(prefix) {
    this.prefix = prefix + '_';
    this.num = 1;
    this.getID = function () {
        return this.prefix + (+new Date()) + '_' + (this.num++);
    };
}


var generator = new IDGenerator('id');
module.exports = generator;