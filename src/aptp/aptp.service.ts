import axios from 'axios'
import { SimpleRequestpay, Amount, envs, buildLogger, getAuth } from '../config'
import { PrismaService } from '../database/prisma/prismaService'
import { SimpleSaveRequestDB } from '../config/dto/simpleSaveRequestDB'

export class AptpService {
  constructor (private readonly prisma = new PrismaService()) {
    this.logger = buildLogger(`aptp.service.ts`)
  }

  logger = buildLogger(`aptp.service.ts`)

  async onRequestSimplePayment (
    reference: string,
    description: string,
    amount: Amount,
    ipAddress: string,
    userAgent: string
  ) {
    const paymentMethod:any= 'pse, ath';
    const sendPayload = SimpleRequestpay.createPayload({
      reference,
      description,
      amount,
      ipAddress,
      userAgent,
      paymentMethod
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
  async onRequestConsult(requestId: string) {
    console.log('requestId', requestId)
    const auth = getAuth();
    const payload = { auth };
    
    const response = await axios.post(`${envs.URLBASE}/${requestId}`, payload);
    const { request } = response.data;
    const { payment, payer } = request;
    const { document, documentType, name, surname, email, mobile } = payer;
    const { date, reason, message } = response.data.status;
    const status = response.data.status.status;
    const lastName = surname;
    const { reference, description } = payment;
    const amount = payment.amount.total;
    
    const guardarTranferencia = new SimpleSaveRequestDB(
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
      status,
      requestId
    );
  
    await this.prisma.guardarRegistro(guardarTranferencia)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    return response.data;
  }

  async onHookUsed (payload: any){
    //este metodo registrara la transaccion de gou pagos en la base de datos y enviara una notificacion a la api que se encargue del resto
    //usaremos un dto
    console.log(payload)
    return "ok"
  }
  
}
