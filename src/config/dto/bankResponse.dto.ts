import { Payer } from "@prisma/client";


export class TransactionData {
  constructor(
    public readonly payer: Payer,
    public readonly internalReference: number,
    public readonly reference: string,
    public readonly description: string,
    public readonly status: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly transactionCode: string,
    public readonly receipt: string,
    public readonly refunded: boolean,
    public readonly franchise: string,
    public readonly issuerName: string,
    public readonly paymentMethod: string,
    public readonly paymentMethodName: string,
    public readonly authorization: string
  ) {}

  static create(object: { [key: string]: any }): [string?, TransactionData?] {
    const {
      payer,
      internalReference,
      reference,
      description,
      status,
      amount,
      currency,
      transactionCode,
      receipt,
      refunded,
      franchise,
      issuerName,
      paymentMethod,
      paymentMethodName,
      authorization
    } = object;

    if (!payer) return ['Falta el pagador'];
    if (!internalReference) return ['Falta la referencia interna'];
    if (!reference) return ['Falta la referencia'];
    if (!description) return ['Falta la descripción'];
    if (!status) return ['Falta el estado'];
    if (!amount) return ['Falta el monto'];
    if (!currency) return ['Falta la moneda'];
    if (!transactionCode) return ['Falta el código de transacción'];
    if (!receipt) return ['Falta el recibo'];
    if (refunded === undefined) return ['Falta el estado de reembolso'];
    if (!franchise) return ['Falta la franquicia'];
    if (!issuerName) return ['Falta el nombre del emisor'];
    if (!paymentMethod) return ['Falta el método de pago'];
    if (!paymentMethodName) return ['Falta el nombre del método de pago'];
    if (!authorization) return ['Falta la autorización'];

    return [
      undefined,
      new TransactionData(
        payer,
        internalReference,
        reference,
        description,
        status,
        amount,
        currency,
        transactionCode,
        receipt,
        refunded,
        franchise,
        issuerName,
        paymentMethod,
        paymentMethodName,
        authorization
      )
    ];
  }

  static createPayload(transactionData: TransactionData) {
    const {
      payer,
      internalReference,
      reference,
      description,
      status,
      amount,
      currency,
      transactionCode,
      receipt,
      refunded,
      franchise,
      issuerName,
      paymentMethod,
      paymentMethodName,
      authorization
    } = transactionData;

    return {
      payer,
      transaction: {
        internalReference,
        reference,
        description,
        status,
        amount,
        currency,
        transactionCode,
        receipt,
        refunded,
        franchise,
        issuerName,
        paymentMethod,
        paymentMethodName,
        authorization
      }
    };
  }
}