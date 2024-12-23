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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptpService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const prismaService_1 = require("../database/prisma/prismaService");
const simpleSaveRequestDB_1 = require("../config/dto/simpleSaveRequestDB");
class AptpService {
    constructor(prisma = new prismaService_1.PrismaService()) {
        this.prisma = prisma;
        this.logger = (0, config_1.buildLogger)(`aptp.service.ts`);
        this.logger = (0, config_1.buildLogger)(`aptp.service.ts`);
    }
    onRequestSimplePayment(reference, description, amount, ipAddress, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const paymentMethod = 'pse, ath';
            const sendPayload = config_1.SimpleRequestpay.createPayload({
                reference,
                description,
                amount,
                ipAddress,
                userAgent,
                paymentMethod
            });
            try {
                const response = yield axios_1.default.post(config_1.envs.URLBASE, sendPayload);
                const { processUrl, requestId } = response.data;
                return { processUrl, requestId };
            }
            catch (error) {
                const errorMessage = (_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.status) === null || _c === void 0 ? void 0 : _c.message;
                this.logger.log(`data:${JSON.stringify(errorMessage)}`);
                return { error: 'Error al enviar el payload' };
            }
        });
    }
    onRequestConsult(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('requestId', requestId);
            const auth = (0, config_1.getAuth)();
            const payload = { auth };
            const response = yield axios_1.default.post(`${config_1.envs.URLBASE}/${requestId}`, payload);
            const { request } = response.data;
            const { payment, payer } = request;
            const { document, documentType, name, surname, email, mobile } = payer;
            const { date, reason, message } = response.data.status;
            const status = response.data.status.status;
            const lastName = surname;
            const { reference, description } = payment;
            const amount = payment.amount.total;
            const guardarTranferencia = new simpleSaveRequestDB_1.SimpleSaveRequestDB(name, lastName, email, mobile, document, documentType, reference, description, amount, date, reason, message, status, requestId);
            yield this.prisma.guardarRegistro(guardarTranferencia)
                .then((response) => console.log(response))
                .catch((error) => console.log(error));
            return response.data;
        });
    }
}
exports.AptpService = AptpService;
