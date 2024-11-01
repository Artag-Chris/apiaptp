//import { PrismaClient } from '@prisma/client';
import axios from 'axios'
import { SimpleRequestpay, Amount, envs, buildLogger, getAuth } from '../config'

export class AptpService {
  constructor () {
    this.logger = buildLogger(`application.service.ts`)
    //TODO iniciar la clase de prisma para guardar la info
  }

  logger = buildLogger(`application.service.ts`)

  async onRequestSimplePayment (
    reference: string,
    description: string,
    amount: Amount,
    ipAddress: string,
    userAgent: string
  ) {
    const sendPayload = SimpleRequestpay.createPayload({
      reference,
      description,
      amount,
      ipAddress,
      userAgent
    })

    try {
      const response = await axios.post(envs.URLBASE, sendPayload)
      const { processUrl, requestId } = response.data
      
      return { processUrl, requestId }

    } catch (error: any) {
      const errorMessage = error.response?.data?.status?.message
      this.logger.log(`data:${JSON.stringify(errorMessage)}`)

      return { error: 'Error al enviar el payload' }
    }
  }
  async onRequestConsult (requestId: any) {
    const auth = getAuth()
 const payload={
  auth
 }
 const response = await axios.post(`${envs.URLBASE}/${requestId}`, payload)
//aqui se puede inicar el proceso para guardar
//la informacion en la base de datos antes de mandar la respuesta
 return response.data
  }
}
