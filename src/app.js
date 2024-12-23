"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const envs_1 = require("./config/envs");
const routes_1 = require("./presentation/routes");
const server_1 = require("./presentation/server");
const http_1 = require("http");
const wss_service_1 = require("./notifications/wss.service");
(() => __awaiter(void 0, void 0, void 0, function* () {
    main();
}))();
function main() {
    console.log("Starting Server...");
    const server = new server_1.Server({
        port: envs_1.envs.PORT,
    });
    const httpServer = (0, http_1.createServer)(server.app);
    wss_service_1.WssService.initWss({ server: httpServer });
    server.setRoutes(routes_1.AppRoutes.routes);
    httpServer.listen(envs_1.envs.PORT, () => {
        console.log(`Server corriendo en el puerto ${envs_1.envs.PORT}`);
    });
}
