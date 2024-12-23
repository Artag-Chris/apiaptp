"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSaveRequestDB = void 0;
class SimpleSaveRequestDB {
    constructor(name, lastName, email, mobile, document, documentType, reference, description, amount, date, reason, message, status, transactionCode) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.mobile = mobile;
        this.document = document;
        this.documentType = documentType;
        this.reference = reference;
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.reason = reason;
        this.message = message;
        this.status = status;
        this.transactionCode = transactionCode;
    }
    static create(object) {
        const { name, lastName, email, mobile, document, documentType, reference, description, amount, date, reason, message, status, transactionCode } = object;
        if (!name)
            return ['Falta el nombre'];
        if (!lastName)
            return ['Falta el apellido'];
        if (!email)
            return ['Falta el email'];
        if (!mobile)
            return ['Falta el celular'];
        if (!document)
            return ['Falta el documento'];
        if (!documentType)
            return ['Falta el tipo de documento'];
        if (!reference)
            return ['Falta la referencia'];
        if (!description)
            return ['Falta la descripcion'];
        if (!amount)
            return ['Falta el monto'];
        if (!date)
            return ['Falta la fecha'];
        if (!reason)
            return ['Falta la razon'];
        if (!message)
            return ['Falta el mensaje'];
        if (!status)
            return ['Falta el estado'];
        if (!transactionCode)
            return ['Falta el transactionCode'];
        return [undefined, new SimpleSaveRequestDB(name, lastName, email, mobile, document, documentType, reference, description, amount, date, reason, message, status, transactionCode)];
    }
}
exports.SimpleSaveRequestDB = SimpleSaveRequestDB;
