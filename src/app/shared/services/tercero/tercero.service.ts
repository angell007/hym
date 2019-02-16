import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class TerceroService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getTerceros(p:string):Observable<any>{
    return this.client.get(this.globales.ruta+'php/terceros/get_lista_terceros.php?'+p);
  }

  getTercero(idTercero:string):Observable<any>{
    let p = {id_tercero:idTercero};
    return this.client.get(this.globales.ruta+'php/terceros/get_tercero.php', {params:p});
  }

  saveTercero(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/terceros/guardar_tercero.php', data);
  }

}
