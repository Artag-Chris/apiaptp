import { envs } from '../envs'
import { getAuth, sumar5Horas } from '../functions'
import { Amount } from '../interfaces'

export class SimpleRequestpay {
  constructor (
    public readonly reference: string,
    public readonly description: string,
    public readonly amount: Amount,
    public readonly ipAddress: string,
    public readonly userAgent: string,
    public readonly paymentMethod: any
  ) {}
  static create (object: { [key: string]: any }): [string?, SimpleRequestpay?] {
    const { reference, description, amount, ipAddress, userAgent,paymentMethod } = object
    if (!reference) return ['Falta la referencia']
    if (!description) return ['Falta la descripcion']
    if (!amount) return ['Falta el monto']
    if (!ipAddress) return ['Falta la ip']
    if (!userAgent) return ['Falta el userAgent']
console.log(paymentMethod)
    return [
      undefined,
      new SimpleRequestpay(reference, description, amount, ipAddress, userAgent,paymentMethod)]
  }
  static createPayload (SimpleRequestpay: SimpleRequestpay) {

    const { reference, description, amount, ipAddress, userAgent,paymentMethod } =
      SimpleRequestpay
    const auth = getAuth()
    const fechaSumada = sumar5Horas()
    const locale = 'es_CO'
    const returnUrl = envs.RETURNURL
    paymentMethod
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
    }
  }
}
