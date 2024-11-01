//import { PrismaClient } from '@prisma/client';
import axios from 'axios'
import { SimpleRequestpay, Amount, envs, buildLogger } from '../config'

export class AptpService {
  constructor () {
    this.logger = buildLogger(`application.service.ts`)
    //TODOiniciar la clase de prisma para guardar la info
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
  async onRequestConsult (payload: any) {
    console.log(payload)
  }
}
