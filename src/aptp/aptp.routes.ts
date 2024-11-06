import { Router } from "express";
import { AptpController } from "./aptp.controller";

export class AptpRoutes {


    static get routes(){ 
    const router= Router();
    
    const aptpController =new AptpController();

    //aqui iran las rutas de a place to pay sus metodos son todos post

    router.post(`/simplelogin`,aptpController.onLogin);
  
    router.get(`/consultrequest/:requestId`,aptpController.onConsult);

    router.post(`/test`,aptpController.onTest);

    

return router;
 }
 
}