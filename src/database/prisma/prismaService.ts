import { PrismaClient } from '@prisma/client'
import { buildLogger } from '../../config';
// import { SimpleSaveRequestDB } from '../../config/dto/simpleSaveRequestDB';

export class PrismaService extends PrismaClient {
  constructor () {
    /******************************************************************************************** 
    esta clase se encarga de guardar en la base de datos las transacciones ya sea por que el 
    llego a la pagina de redireccion o por que se activo el webhook de gou pagos
    *********************************************************************************************/
              
    super()  
  }  
  logger = buildLogger(`prismaService.ts`)
  
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
    const savedTransaction = await this.transaction.create({
      data: {
        ...transaction,
        payerId: savedPayer.id
      }
    });
return savedTransaction
    
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
