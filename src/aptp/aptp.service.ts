import axios from 'axios'
import { SimpleRequestpay, Amount, envs, buildLogger, getAuth } from '../config'
import { PrismaService } from '../database/prisma/prismaService'

export class AptpService {
  constructor (private readonly prisma = new PrismaService()) {
    
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
    const payload = {
      auth
    }
    const response = await axios.post(`${envs.URLBASE}/${requestId}`, payload)

    const { request } = response.data
    const { payment, payer } = request
    const { document, documentType, name, surname, email, mobile } = payer
    const { date, reason, message } = response.data.status
    const status = response.data.status.status
    const lastName = surname
    const { reference, description,  } = payment
    const amount = payment.amount.total
    const guardarTranferencia = {
      name,
      lastName,
      email,
      mobile,
      document,
      documentType,
      reference,
      description,
      amount,
      date,
      reason,
      message,
      status
    }
    await this.prisma.guardarRegistro(guardarTranferencia)
    //console.log(guardarTranferencia)
    //aqui se puede inicar el proceso para guardar
    //la informacion en la base de datos antes de mandar la respuesta
    return response.data
  }
}
