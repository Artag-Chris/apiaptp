//import { PrismaClient } from '@prisma/client';
import { getAuth, sumar5Horas } from '../config/functions'
import { Amount, Payment } from '../config/interfaces'
import { envs } from '../config/envs'
import axios from 'axios'

export class AptpService {
  constructor () {
  
  }

  ///se cambiara los metodos
  async onRequestLogin (
    reference: string,
    description: string,
    amount: Amount,
    ipAddress: string,
    userAgent: string
  ) {
    //se enviara un payload a una url y esperaremos de respuesta una url
    const auth = getAuth()
    const fechaSumada = sumar5Horas()

    const payment: Payment = {
      paymentMethod: 'pse', //aqui se cambiara el metodo de pago
      reference,
      description,
      amount
    }

    const sendPayload = {
      locale: 'es_CO',
      auth: auth,
      payment,
      expiration: fechaSumada,
      returnUrl: envs.RETURNURL,
      ipAddress,
      userAgent
    }

    //ya esta la interface de la respuesta de a place to pay con la url
    //'https://checkout.test.goupagos.com.co'
    //`https://checkout-test.placetopay.com/api/session`
    try {
      const response = await axios.post('https://checkout.test.goupagos.com.co/api/session', sendPayload);
      const { data } = response;
  console.log(data)
      const processUrl = data.processUrl;
      const requestId = data.requestId;
   
      return { processUrl, requestId };
    } catch (error:any) {
      const errorMessage = error.response?.data?.status?.message;
      console.error('Error:', errorMessage);
      return { error: 'Error al enviar el payload' };
    }
    
  }

  async onRequestConsult (payload: any) {
    console.log(payload)
  }
}
