import axios from 'axios'
import { SimpleRequestpay, Amount, envs, buildLogger, getAuth } from '../config'
import { PrismaService } from '../database/prisma/prismaService'
import { TransactionResponse } from '../config/interfaces/transactionResponse'
import { TransactionData } from '../config/dto/bankResponse.dto'

export class AptpService {
  constructor(
    private readonly prisma = new PrismaService()
  ) {
    this.logger = buildLogger(`aptp.service.ts`)
  }

  logger = buildLogger(`aptp.service.ts`)

  async onRequestSimplePayment(
    reference: string,
    description: string,
    amount: Amount,
    ipAddress: string,
    userAgent: string
  ) {
    const paymentMethod: any = 'pse, ath';
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
    /**********************************************************************************************
    este metodo se encarga de consultar a gou pagos por la transaccion que hizo el cliente
    si por alguna razon no esta guardada el resultado en la base de datos la guardara en la base
    tambien este regresara la url de redireccion para que el cliente pueda ver la transaccion
    ***********************************************************************************************/
    const auth = getAuth();
    const payload = { auth };

    try {
      const response = await axios.post<TransactionResponse>(`${envs.URLBASE}/${requestId}`, payload);
      const { payment, status, request } = response.data;

      // Datos de la persona que hizo la transacción
      const { name, surname, email, mobile, document, documentType } = request.payer;

      // Datos de la transferencia
      const { amount, reference, receipt, refunded, franchise, issuerName, authorization, paymentMethod, internalReference, paymentMethodName } = payment[0];
      const { date, reason, message } = status;
      const { to } = amount;
      const { total, currency } = to;
      

      //Enviar datos a PrismaService para guardar
      if (status.status === 'APPROVED') {
        await this.prisma.saveTransactionData({
          payer: { name, surname, email, mobile, document, documentType },
          transaction: {
        reference,
        description: request.payment.description, 
        status: reason,
        amount: total,
        currency,
        date,
        transactionCode: requestId,
        receipt,
        refunded,
        franchise,
        issuerName,
        authorization,
        paymentMethod,
        internalReference,
        paymentMethodName
          }
        })
          .then(() => {
        this.logger.log('Datos guardados en la base de datos');
          })
          .catch((error) => {
        this.logger.log(`Error al guardar los datos en la base de datos: ${error}`);
          });
      } else {
        return response.data;
      }

      return response.data;
    } catch (error: any) {
      this.logger.log(`Error: ${JSON.stringify(error.response?.data?.status?.message)}`);
      return { error: 'Error al consultar el estado de la transacción' };
    }
  }


  async onHookUsed(payload: TransactionResponse) {
    /**************************************************************************** 
    este es el metodo que se encarga de enviar la informacion a la base de datos o al servicio de prisma
    a su vez se encargara de enviar a la api para procesar la transaccion en la base de datos principal
    ******************************************************************************/
    const transactionDataObject = {
      payer: payload.request.payer,
      internalReference: payload.payment[0].internalReference,
      reference: payload.request.payment.reference,
      description: payload.request.payment.description,
      status: payload.status.status,
      amount: payload.payment[0].amount.from.total,
      currency: payload.payment[0].amount.from.currency,
      transactionCode: payload.payment[0].authorization,
      receipt: payload.payment[0].receipt,
      refunded: payload.payment[0].refunded,
      franchise: payload.payment[0].franchise,
      issuerName: payload.payment[0].issuerName,
      paymentMethod: payload.payment[0].paymentMethod,
      paymentMethodName: payload.payment[0].paymentMethodName,
      authorization: payload.payment[0].authorization
    };

    const [error, transactionData] = TransactionData.create(transactionDataObject);

    if (error) {
      this.logger.log(`Error: ${error}`);
      return { error: `Error al crear transactionData: ${error}` };
    }

    if (!transactionData) {
      this.logger.log('Error: transactionData is undefined');
      return { error: 'Error al crear transactionData: transactionData is undefined' };
    }
    const payloadToSave = TransactionData.createPayload(transactionData);

    if (payload.status.status !== 'APPROVED') {
      return { message: 'OK' };
    }

    const saveResult: any = await this.prisma.saveTransactionData(payloadToSave);
    //se movera el return
     return saveResult;
    // if (saveResult.message === 'Transacción ya guardada') {
    //   return saveResult;
    // }

    // // Enviar la información a una API externa
    // const apiUrl = 'https://external-api.example.com/apply-payment';
    // const response = await  axios.post(apiUrl, payloadToSave);

    // if (response.status === 200) {
    //   return { message: 'Transacción procesada y enviada correctamente' };
    // } else {
    //   return { message: 'Error al enviar la transacción a la API externa' };
    // }
  }
}