var service = {
    send: function (error, sacces) {
        return {
            error: error,
            succes: sacces
        };
    },
    sacces: function (data) {
        this.send(null, data);
    },
    error: function (err, data) {
        this.send(err, data);
    },
    ERROR: {}
};

service.ERROR.AUTH_ERR = "";
exports = service;