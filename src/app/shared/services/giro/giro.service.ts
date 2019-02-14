import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class GiroService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getGiros(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/giros/get_lista_giros.php?'+p);
  }

  getDetalleGiro(idGiro:string):Observable<any>{
    let p = {id_giro:idGiro};
    return this.client.get(this.globales.ruta+'php/giros/get_detalle_giro.php', {params:p});
  }

  getConteoGiros():Observable<any>{
    return this.client.get(this.globales.ruta+'php/giros/get_conteo_giros.php');
  }

}
