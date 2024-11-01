//import { PrismaClient } from '@prisma/client';
import axios from 'axios'
import { Amount } from '../config/interfaces'
import { envs } from '../config/envs'
import { buildLogger } from '../config/pluggins/logger.pluggin'
import { SimpleRequestpay } from '../config/dto/simpleRequestpay'

export class AptpService {
  constructor () {
    this.logger = buildLogger(`application.service.ts`)
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
      const { data } = response
      const processUrl = data.processUrl
      const requestId = data.requestId

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
