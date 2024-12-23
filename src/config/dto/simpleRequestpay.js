"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleRequestpay = void 0;
const envs_1 = require("../envs");
const functions_1 = require("../functions");
class SimpleRequestpay {
    constructor(reference, description, amount, ipAddress, userAgent, paymentMethod) {
        this.reference = reference;
        this.description = description;
        this.amount = amount;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.paymentMethod = paymentMethod;
    }
    static create(object) {
        const { reference, description, amount, ipAddress, userAgent, paymentMethod } = object;
        if (!reference)
            return ['Falta la referencia'];
        if (!description)
            return ['Falta la descripcion'];
        if (!amount)
            return ['Falta el monto'];
        if (!ipAddress)
            return ['Falta la ip'];
        if (!userAgent)
            return ['Falta el userAgent'];
        console.log(paymentMethod);
        return [
            undefined,
            new SimpleRequestpay(reference, description, amount, ipAddress, userAgent, paymentMethod)
        ];
    }
    static createPayload(SimpleRequestpay) {
        const { reference, description, amount, ipAddress, userAgent, paymentMethod } = SimpleRequestpay;
        const auth = (0, functions_1.getAuth)();
        const fechaSumada = (0, functions_1.sumar5Horas)();
        const locale = 'es_CO';
        const returnUrl = envs_1.envs.RETURNURL;
        paymentMethod;
        //aqui se colocaria los metodos de pago especificos
        //si supiera como y se colocan en el return
        return {
            auth,
            locale,
            payment: {
                paymentMethod: `pse`, //aqui se cambiara el metodo de pago
                reference,
                description,
                amount
            },
            ipAddress,
            userAgent,
            expiration: fechaSumada,
            returnUrl,
            paymentMethod
        };
    }
}
exports.SimpleRequestpay = SimpleRequestpay;
