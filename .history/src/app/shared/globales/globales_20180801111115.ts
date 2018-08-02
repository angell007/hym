import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';


@Injectable()
export class Globales {
  ruta: string = 'https://hym.corvuslab.co/';


  //llamar de base de datos para obtener los datos de configuración
  //se declara constructor para poderlo inicalizar
  constructor() {
   
  }
  
}