import { PrismaClient } from '@prisma/client'
import { buildLogger } from '../../config';
import { SimpleSaveRequestDB } from '../../config/dto/simpleSaveRequestDB';

export class PrismaService extends PrismaClient {
  constructor () {
              
    super()  
    this.init(); 
  }  
  logger = buildLogger(`prismaService.ts`)
  async guardarRegistro(data: SimpleSaveRequestDB) {
    const { name, lastName, email, document, documentType, reference, description, amount, status, transactionCode } = data;
    console.log(`transactionCode: ${transactionCode}`);
  
    try {
      // Verificar si el transactionCode ya existe para el payer
      const existingTransaction = await this.transaction.findFirst({
        where: {
          transactionCode: transactionCode,
          payer: {
            email: email,
          },
        },
      });
  
      if (existingTransaction) {
        console.log('Transacción ya guardada');
        return { message: 'Transacción ya guardada' };
      }
  
      // Si no existe, crear o actualizar el usuario
      let userId;
      const existingUser = await this.payer.findUnique({
        where: {
          email: email,
        },
      });
  
      if (existingUser) {
        const updatedUser = await this.payer.update({
          where: {
            id: existingUser.id,
          },
          data: {
            name: name,
            lastName: lastName,
            document: document,
            documentType: documentType,
          },
        });
        userId = updatedUser.id;
      } else {
        const newUser = await this.payer.create({
          data: {
            name: name,
            lastName: lastName,
            email: email,
            document: document,
            documentType: documentType,
          },
        });
        userId = newUser.id;
      }
  
      // Crear transacción
      const transaccion = await this.transaction.create({
        data: {
          reference: reference,
          description: description,
          status: status,
          amount: amount,
          payerId: userId,
          transactionCode: transactionCode,
        },
      });
  
      console.log('Transacción guardada:', transaccion);
      return { message: 'Transacción guardada con éxito' };
  
    } catch (error: any) {
      const errorMessage = error.response?.data?.status?.message;
      throw error;
    }
  }


  async init() {
    try {
      await this.$connect();
      console.log(`Conexión a la base de datos establecida correctamente.`);
    } catch (error) {
      console.error('Error al conectar con la base de datos:', error);
    }
  }
  async destroy() {
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
