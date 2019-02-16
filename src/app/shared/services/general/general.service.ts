import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class GeneralService {

  constructor(private client:HttpClient, private globales:Globales) { }

  checkIdentificacion(id:string):Observable<any>{
    let p = {id:id};
    return this.client.get(this.globales.ruta+'php/GENERALES/validar_numero_identificacion.php', {params:p});
  }

}
