import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';


@Injectable()
export class Globales {
  ruta: string = 'https://hym.corvuslab.co/';
  public Monedas:any = [];
  public Paises:any = [];
  //llamar de base de datos para obtener los datos de configuración
  //se declara constructor para poderlo inicalizar
  constructor(private client:HttpClient) {
    this.BuscarMonedas();
    this.BuscarPaises();
  }

  BuscarMonedas():void{
    this.client.get(this.ruta+'php/monedas/lista_monedas.php').subscribe((data)=>{      
      this.Monedas = data;
      
    });
  }

  BuscarPaises():void{
    this.client.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Pais'}}).subscribe((data:any)=>{
      this.Paises= data;
    });
  }

  IsObjEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }
  
}