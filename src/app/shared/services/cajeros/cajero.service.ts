import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class CajeroService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getCajerosTraslados(idCajero:string):Observable<any>{
    let p = {id_cajero:idCajero};
    return this.client.get(this.globales.ruta+'php/cajeros/get_cajeros_traslados.php', {params:p});
  }

}
