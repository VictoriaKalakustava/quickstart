"use strict";
var CoreService = (function () {
    function CoreService() {
        this.webServiceEndpoint = CoreService.debugEndpoint;
    }
    return CoreService;
}());
CoreService.debugEndpoint = 'http://localhost:8080/';
exports.CoreService = CoreService;
//# sourceMappingURL=core.service.js.map