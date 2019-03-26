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

  getTercero(idTercero:string):Observable<any>{
    let p = {id_tercero:idTercero};
    return this.client.get(this._rutaBase+'get_tercero.php', {params:p});
  }

  saveTercero(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_tercero_nuevo.php', data);
  }

  editTercero(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'editar_tercero.php', data);
  }

  cambiarEstadoTercero(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'cambiar_estado_tercero.php', data);
  }

}
