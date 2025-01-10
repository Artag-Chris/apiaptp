import { Request, response, Response } from 'express';
import {AptpService} from './aptp.service';
import { CustomError } from '../config';


export class AptpController {
    constructor(
        private readonly aptpService = new AptpService(),
        
    ) {

    }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: `Internal Server Error` });
      };
    
    onLogin= async(req:Request, res:Response) =>{
        const payload= req.body;
        
        const {reference, description, amount,ipAddress, userAgent } = payload;
        const userAgentValue = userAgent !== null && userAgent !== undefined ? userAgent : 'Desconocido';

         this.aptpService
        .onRequestSimplePayment (reference, description, amount,ipAddress, userAgentValue)
        .then((result)=>res.json(result))
        .catch((error)=>this.handleError(error, res));
        
      
    }
    onConsult= async(req:Request, res:Response) =>{

        const {requestId}= req.params;
       // console.log('Request ID:', requestId);
       
        await this.aptpService.onRequestConsult(requestId)
        .then((result)=>res.json(result))
        .catch((error)=>this.handleError(error, res));

        
    }
    onTest= async(req:Request, res:Response) =>{
     const payload= req.body;
        console.log(payload);
        res.json(payload);
    }
   //controladora de la ruta donde gou pagos nos enviara la notificacion 
    onHook=async (req:Request, res:Response)=>{
        const payload=req.body
        console.log(payload)
        //pasar esto al servicio
         const response =await this.aptpService.onHookUsed(payload)
        res.json(response)
    }
  

}

