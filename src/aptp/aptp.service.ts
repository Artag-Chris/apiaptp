import axios from 'axios'
import { SimpleRequestpay, Amount, envs, buildLogger, getAuth } from '../config'
import { PrismaService } from '../database/prisma/prismaService'
import { TransactionResponse } from '../config/interfaces/transactionResponse'

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
      await this.prisma.saveTransactionData({
        payer: { name, surname, email, mobile, document, documentType },
        transaction: {
          reference,
          description: '', // description is not available in PaymentElement
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

      return response.data;
    } catch (error: any) {
      this.logger.log(`Error: ${JSON.stringify(error.response?.data?.status?.message)}`);
      return { error: 'Error al consultar el estado de la transacción' };
    }
  }

  async onHookUsed(payload: TransactionResponse) {


    // Guardar la transacción usando el método saveTransactionData
    const transactionData = {
      payer: payload.request.payer,
      transaction: {
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
        authorization: payload.payment[0].authorization // Añadir este campo
      },
    };

    const saveResult: any = await this.prisma.saveTransactionData(transactionData);

    // if (saveResult.message === 'Transacción ya guardada') {
    //   return saveResult;
    // }
    return saveResult;
    // Enviar la información a una API externa
    // const apiUrl = 'https://external-api.example.com/apply-payment';
    // const response = await axios.post<any>(apiUrl, transactionData);

    // if (response.status === 200) {
    //   return { message: 'Transacción procesada y enviada correctamente' };
    // } else {
    //   return { message: 'Error al enviar la transacción a la API externa' };
    // }
  }
}