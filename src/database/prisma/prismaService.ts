import { PrismaClient } from '@prisma/client'
import { buildLogger } from '../../config';
import { SimpleSaveRequestDB } from '../../config/dto/simpleSaveRequestDB';

export class PrismaService extends PrismaClient {
  constructor () {
     
    super()
    
  }
  logger = buildLogger(`prismaService.ts`)
  async guardarRegistro(data: SimpleSaveRequestDB) {
    const { name, lastName, email, document, documentType, reference, description, amount, status } = data;
    //console.log(data);
  
    try {
      const existingUser = await this.payer.findUnique({
        where: {
          email: email,
        },
      });
  
      let userId;
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
          payerId: userId, // Cambie userId por payerId
        },
      });
  
      console.log('Transacción guardada:', transaccion);
      return transaccion;
  
    } catch (error: any) {
      const errorMessage = error.response?.data?.status?.message;
      this.logger.log(`data:${JSON.stringify(errorMessage)}`);
      throw error;
    }
  }
  
}
