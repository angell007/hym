import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class DestinatariogiroService {

  constructor(private client:HttpClient, private globales:Globales) { }

  private _rutaBase:string = this.globales.ruta+'php/destinatariosgiros/';

  getDestinatario(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_destinatario_by_id.php', {params:p});
  }

  getListaDestinatarios(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_destinatarios.php', {params:p});
  }

  saveDestinatario(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_destinatario.php', datos);
  }

  editDestinatario(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'editar_destinatario.php', datos);
  }

  cambiarEstadoDestinatario(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'cambiar_estado_destinatario.php', data);
  }

  checkIdentificacioDestinatario(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'verificar_cedula_destinatario_giro.php', {params:p});
  }

}
