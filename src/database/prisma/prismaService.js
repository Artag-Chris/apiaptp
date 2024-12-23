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
exports.PrismaService = void 0;
const client_1 = require("@prisma/client");
const config_1 = require("../../config");
class PrismaService extends client_1.PrismaClient {
    constructor() {
        super();
        this.logger = (0, config_1.buildLogger)(`prismaService.ts`);
        this.init();
    }
    guardarRegistro(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { name, lastName, email, document, documentType, reference, description, amount, status, transactionCode } = data;
            console.log(`transactionCode: ${transactionCode}`);
            try {
                // Verificar si el transactionCode ya existe para el payer
                const existingTransaction = yield this.transaction.findFirst({
                    where: {
                        transactionCode: transactionCode,
                        payer: {
                            email: email,
                        },
                    },
                });
                if (existingTransaction) {
                    console.log('Transacción ya guardada');
                    return { message: 'Transacción ya guardada' };
                }
                // Si no existe, crear o actualizar el usuario
                let userId;
                const existingUser = yield this.payer.findUnique({
                    where: {
                        email: email,
                    },
                });
                if (existingUser) {
                    const updatedUser = yield this.payer.update({
                        where: {
                            id: existingUser.id,
                        },
                        data: {
                            name: name,
                            lastName: lastName,
                            document: document,
                            documentType: documentType,
                        },
                    });
                    userId = updatedUser.id;
                }
                else {
                    const newUser = yield this.payer.create({
                        data: {
                            name: name,
                            lastName: lastName,
                            email: email,
                            document: document,
                            documentType: documentType,
                        },
                    });
                    userId = newUser.id;
                }
                // Crear transacción
                const transaccion = yield this.transaction.create({
                    data: {
                        reference: reference,
                        description: description,
                        status: status,
                        amount: amount,
                        payerId: userId,
                        transactionCode: transactionCode,
                    },
                });
                console.log('Transacción guardada:', transaccion);
                return { message: 'Transacción guardada con éxito' };
            }
            catch (error) {
                const errorMessage = (_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.status) === null || _c === void 0 ? void 0 : _c.message;
                throw error;
            }
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.$connect();
                console.log(`Conexión a la base de datos establecida correctamente.`);
            }
            catch (error) {
                console.error('Error al conectar con la base de datos:', error);
            }
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.$disconnect();
        });
    }
}
exports.PrismaService = PrismaService;
const prismaService = new PrismaService();
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prismaService.destroy();
    process.exit(0);
}));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prismaService.destroy();
    process.exit(0);
}));
