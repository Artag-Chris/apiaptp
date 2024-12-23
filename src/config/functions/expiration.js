"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumar5Horas = sumar5Horas;
function sumar5Horas() {
    const fechaActual = new Date();
    const fechaSumada = new Date(fechaActual.getTime() + 5 * 60 * 60 * 1000);
    return fechaSumada.toISOString();
}
