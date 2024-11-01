//import { PrismaClient } from '@prisma/client';
import { getAuth, sumar5Horas } from '../config/functions'
import { Amount, Payment } from '../config/interfaces'
import { envs } from '../config/envs'
import {buildLogger}  from "../config/pluggins/logger.pluggin";
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
    const logger=buildLogger(`application.service.ts`)
    const auth = getAuth()
    const fechaSumada = sumar5Horas()
    const payment: Payment = {
      paymentMethod: `pse`, //aqui se cambiara el metodo de pago
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

    try {
      const response = await axios.post(envs.URLBASE, sendPayload);
      const { data } = response;
      
     // logger.log(`data:${JSON.stringify(data)}`)
      
      const processUrl = data.processUrl;
      const requestId = data.requestId;
      return { processUrl, requestId };
    } catch (error:any) {
      const errorMessage = error.response?.data?.status?.message;
      logger.log(`data:${JSON.stringify(errorMessage)}`)
      return { error: 'Error al enviar el payload' };
    }  
  }
  async onRequestConsult (payload: any) {
    console.log(payload)
  }
}


