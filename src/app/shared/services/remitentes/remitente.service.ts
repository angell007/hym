import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class RemitenteService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getRemitente(idRemitente:string):Observable<any>{
    let p = {id_remitente:idRemitente};
    return this.client.get(this.globales.ruta+'php/remitentes/get_remitente_by_id.php', {params:p});
  }

  saveRemitente(datos:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/remitentes/guardar_remitente.php', datos);
  }

  editRemitente(datos:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/remitentes/editar_remitente.php', datos);
  }

}
