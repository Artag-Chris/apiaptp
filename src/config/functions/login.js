"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = getAuth;
const crypto = __importStar(require("crypto"));
const envs_1 = require("../envs");
function getAuth() {
    const login = envs_1.envs.LOGINSITE;
    const secretKey = envs_1.envs.SECRETKEYAPTP;
    const seed = new Date().toISOString();
    const rawNonce = Math.floor(Math.random() * 1000000);
    const tranKey = Buffer.from(new Uint8Array(crypto.createHash('sha256').update(rawNonce + seed + secretKey).digest())).toString('base64');
    const nonce = Buffer.from(rawNonce.toString()).toString('base64');
    const auth = {
        login: login,
        tranKey: tranKey,
        nonce: nonce, //Valor aleatorio para cada solicitud codificado en Base64.
        seed: seed, //fecha en formato especifico formato ISO 8601
    };
    return auth;
}
