import { Injectable } from '@angular/core';

@Injectable()
export class CambioService {

  constructor() { }

  CambioMonedaXPeso(valorMoneda:number, valorTasaMoneda:number){

    let result = valorMoneda * valorTasaMoneda;
    return result.toFixed(2);
  }

  CambioPesoMonedaX(valorPeso:number, valorTasaMoneda:number){
    let result = valorPeso / valorTasaMoneda;
    return result.toFixed(2);
  }
}
