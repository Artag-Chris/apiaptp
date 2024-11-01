import { envs } from '../envs'
import { getAuth, sumar5Horas } from '../functions'
import { Amount } from '../interfaces'

export class SimpleRequestpay {
  constructor (
    public readonly reference: string,
    public readonly description: string,
    public readonly amount: Amount,
    public readonly ipAddress: string,
    public readonly userAgent: string
  ) {}
  static create (object: { [key: string]: any }): [string?, SimpleRequestpay?] {
    const { reference, description, amount, ipAddress, userAgent } = object
    if (!reference) return ['Falta la referencia']
    if (!description) return ['Falta la descripcion']
    if (!amount) return ['Falta el monto']
    if (!ipAddress) return ['Falta la ip']
    if (!userAgent) return ['Falta el userAgent']

    return [
      undefined,
      new SimpleRequestpay(reference, description, amount, ipAddress, userAgent)
    ]
  }
  static createPayload (SimpleRequestpay: SimpleRequestpay) {
    
    const { reference, description, amount, ipAddress, userAgent } =
      SimpleRequestpay
    const auth = getAuth()
    const fechaSumada = sumar5Horas()
    const locale = 'es_CO'
    const returnUrl = envs.RETURNURL

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
      returnUrl
    }
  }
}
