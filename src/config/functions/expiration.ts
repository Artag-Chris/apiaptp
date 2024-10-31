export function sumar5Horas() {
    const fechaActual = new Date();
    const fechaSumada = new Date(fechaActual.getTime() + 5 * 60 * 60 * 1000);
    return fechaSumada.toISOString()
  }
  

