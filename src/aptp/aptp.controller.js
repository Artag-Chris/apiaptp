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
exports.AptpController = void 0;
const aptp_service_1 = require("./aptp.service");
const config_1 = require("../config");
class AptpController {
    constructor(aptpService = new aptp_service_1.AptpService()) {
        this.aptpService = aptpService;
        this.handleError = (error, res) => {
            if (error instanceof config_1.CustomError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: `Internal Server Error` });
        };
        this.onLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const payload = req.body;
            const { reference, description, amount, ipAddress, userAgent } = payload;
            const userAgentValue = userAgent !== null && userAgent !== undefined ? userAgent : 'Desconocido';
            this.aptpService
                .onRequestSimplePayment(reference, description, amount, ipAddress, userAgentValue)
                .then((result) => res.json(result))
                .catch((error) => this.handleError(error, res));
        });
        this.onConsult = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { requestId } = req.params;
            // console.log('Request ID:', requestId);
            yield this.aptpService.onRequestConsult(requestId)
                .then((result) => res.json(result))
                .catch((error) => this.handleError(error, res));
        });
        this.onTest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const payload = req.body;
            console.log(payload);
            res.json(payload);
        });
    }
}
exports.AptpController = AptpController;
