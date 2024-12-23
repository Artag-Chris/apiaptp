"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const aptp_routes_1 = require("../aptp/aptp.routes");
class AppRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        router.use(`/aptp/cheackout`, aptp_routes_1.AptpRoutes.routes);
        return router;
    }
}
exports.AppRoutes = AppRoutes;
