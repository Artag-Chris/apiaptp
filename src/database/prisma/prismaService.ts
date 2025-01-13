import { PrismaClient } from '@prisma/client'
import { buildLogger } from '../../config';
// import { SimpleSaveRequestDB } from '../../config/dto/simpleSaveRequestDB';

export class PrismaService extends PrismaClient {
  constructor () {
              
    super()  
    // this.init(); 
  }  
  logger = buildLogger(`prismaService.ts`)
  
  // async guardarRegistro(data: SimpleSaveRequestDB) {
  //   const { name, lastName, email, document, documentType, reference, description, amount, status, transactionCode } = data;
  // //  console.log(`transactionCode: ${status}`);
  
  //   try {
  //     // Verificar si el transactionCode ya existe para el payer
  //     const existingTransaction = await this.transaction.findFirst({
  //       where: {
  //         transactionCode: transactionCode,
  //         payer: {
  //           email: email,
  //         },
  //       },
  //     });
  
  //     if (existingTransaction) {
  //       console.log('Transacción ya guardada');
  //       return { message: 'Transacción ya guardada' };
  //     }
  
  //     // Crear un nuevo payer si no existe
  //     let payer = await this.payer.findUnique({
  //       where: { email: email },
  //     });
  
  //     if (!payer) {
  //       payer = await this.payer.create({
  //         data: {
  //           name,
  //           lastName,
  //           email,
  //           document,
  //           documentType,
  //         },
  //       });
  //     }
  
  //     // Crear una nueva transacción
  //     const newTransaction = await this.transaction.create({
  //       data: {
  //         reference,
  //         description,
  //         status,
  //         amount,
  //         transactionCode,
  //         payer: {
  //           connect: { id: payer.id },
  //         },
  //       },
  //     });
  
  //     console.log('Transacción guardada exitosamente');
  //     return newTransaction;
  //   } catch (error) {
  //     console.error('Error al guardar la transacción:', error);
  //     throw error;
  //   }
  // }

  async saveTransactionData(data: { payer: any, transaction: any }) {
    const { payer, transaction } = data;

    // Verificar si la transacción ya existe
    const existingTransaction = await this.transaction.findFirst({
      where: {
        internalReference: transaction.internalReference,
      },
    });

    if (existingTransaction) {
      console.log('Transacción ya guardada');
      return { message: 'Transacción ya guardada' };
    }

    // Guardar o actualizar el Payer
    const savedPayer = await this.payer.upsert({
      where: { email: payer.email },
      update: { name: payer.name, surname: payer.surname, mobile: payer.mobile, document: payer.document, documentType: payer.documentType },
      create: { name: payer.name, surname: payer.surname, email: payer.email, mobile: payer.mobile, document: payer.document, documentType: payer.documentType }
    });

    // Guardar la transacción
    await this.transaction.create({
      data: {
        ...transaction,
        payerId: savedPayer.id
      }
    });

    console.log('Transacción guardada exitosamente');
  }
  async destroy(): Promise<void> {
    await this.$disconnect();
  }
  
}

const prismaService = new PrismaService();

process.on('SIGINT', async () => {
  await prismaService.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prismaService.destroy();
  process.exit(0);
});
