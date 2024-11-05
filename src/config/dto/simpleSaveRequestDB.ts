export class SimpleSaveRequestDB {
    constructor(
      public readonly  name: string,
      public readonly  lastName: string,
      public readonly  email: string,
      public readonly  mobile: string,
      public readonly  document: string,
      public readonly  documentType: string,
      public readonly  reference: string,
      public readonly  description: string,
      public readonly  amount: number,
      public readonly  date: Date,
      public readonly  reason: string,
      public readonly  message: string,
      public readonly  status: string
    ) {}
      
    public static create(object: { [key: string]: any }): [string?, SimpleSaveRequestDB?]{
      const { name, lastName, email, 
        mobile, document, documentType, 
        reference, description, amount, date, 
        reason, message, status } = object
        if (!name) return ['Falta el nombre']
        if (!lastName) return ['Falta el apellido']
        if (!email) return ['Falta el email']
        if (!mobile) return ['Falta el celular']
        if (!document) return ['Falta el documento']
        if (!documentType) return ['Falta el tipo de documento']
        if (!reference) return ['Falta la referencia']
        if (!description) return ['Falta la descripcion']
        if (!amount) return ['Falta el monto']
        if (!date) return ['Falta la fecha']
        if (!reason) return ['Falta la razon']
        if (!message) return ['Falta el mensaje']
        if (!status) return ['Falta el estado'] 

      
        return [undefined, new SimpleSaveRequestDB(
        name, lastName, email, mobile, document, 
        documentType, reference, description, amount, 
        date, reason, message, status
      )]
    }

}