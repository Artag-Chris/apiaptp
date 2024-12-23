"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptpRoutes = void 0;
const express_1 = require("express");
const aptp_controller_1 = require("./aptp.controller");
class AptpRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const aptpController = new aptp_controller_1.AptpController();
        //aqui iran las rutas de a place to pay sus metodos son todos post
        router.post(`/simplelogin`, aptpController.onLogin);
        router.get(`/consultrequest/:requestId`, aptpController.onConsult);
        router.post(`/test`, aptpController.onTest);
        return router;
    }
}
exports.AptpRoutes = AptpRoutes;
