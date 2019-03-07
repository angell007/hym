import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class TrasladocajaService {

  constructor(private client:HttpClient, private globales:Globales) { }

  gettrasladosPendientes(idCajero:string):Observable<any>{
    let p = {id_cajero:idCajero};
    return this.client.get(this.globales.ruta+'php/remitentes/get_traslados_pendientes.php', {params:p});
  }

}
