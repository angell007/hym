import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';


@Injectable()
export class DestinatarioService {

  private _rutaBase:string = this.globales.ruta+'php/destinatarios';

  constructor(private client:HttpClient, private globales:Globales) { }

  getDestinatario(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_destinatario_by_id.php', {params:p});
  }

  getDestinatarios():Observable<any>{
    return this.client.get(this._rutaBase+'/get_destinatarios.php');
  }

  getListaDestinatarios(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_lista_destinatarios.php', {params:p});
  }

  saveDestinatario(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/guardar_destinatario.php', datos);
  }

  editDestinatario(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/editar_destinatario.php', data);
  }

  cambiarEstadoDestinatario(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/cambiar_estado_destinatario.php', datos);
  }

}
