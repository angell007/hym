import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class TerceroService {

  constructor(private client:HttpClient, private globales:Globales) { }

  private _rutaBase:string = this.globales.ruta+'php/terceros/';

  getTerceros(p:string):Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_terceros.php?'+p);
  }

  getTercerosPorTipo(tipo:string, match:string):Observable<any>{
    let p = {tipo_tercero:tipo, match:match};
    return this.client.get(this._rutaBase+'get_terceros_by_tipo.php', {params:p});
  }

  getAllTerceros(p:string):Observable<any>{
    return this.client.get(this._rutaBase+'get_todos_terceros.php?'+p);
  }

  getTercerosGrupo(idGrupo:string):Observable<any>{
    let p = {id_grupo:idGrupo};
    return this.client.get(this._rutaBase+'get_terceros_grupo.php', {params:p});
  }

  getTercero(idTercero:string):Observable<any>{
    let p = {id_tercero:idTercero};
    return this.client.get(this._rutaBase+'get_tercero.php', {params:p});
  }

  getTerceroVer(idTercero:string):Observable<any>{
    let p = {id_tercero:idTercero};
    return this.client.get(this._rutaBase+'get_tercero_ver.php', {params:p});
  }

  getTotalesMonedasTercero(idTercero:string):Observable<any>{
    let p = {id_tercero:idTercero};
    return this.client.get(this._rutaBase+'get_totales_monedas_tercero.php', {params:p});
  }

 

  saveTercero(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_tercero_nuevo.php', data);
  }

  editTercero(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'editar_tercero.php', data);
  }

  customEditTercero(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'custom_edit_terceros.php', data);
  }

  cambiarEstadoTercero(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'cambiar_estado_tercero.php', data);
  }

}
