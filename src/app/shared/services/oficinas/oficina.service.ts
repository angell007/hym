import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class OficinaService {

  private _rutaBase:string = this.globales.ruta+'php/oficinas/';

  constructor(private client:HttpClient, private globales:Globales) { }

  getNombreOficina(idOficina:string):Observable<any>{
    let p = {id_caja:idOficina};
    return this.client.get(this._rutaBase+'get_nombre_oficina.php', {params:p});
  }

  getOficina(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_oficina_by_id.php', {params:p});
  }

  getOficinas():Observable<any>{
    return this.client.get(this._rutaBase+'get_oficinas.php');
  }

  getListaOficinas(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_oficinas.php', {params:p});
  }

  saveOficina(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_oficina_nuevo.php', datos);
  }

  editOficina(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'editar_oficina.php', datos);
  }

  cambiarEstadoOficina(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'cambiar_estado_oficina.php', data);
  }

}
