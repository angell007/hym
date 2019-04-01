import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class TrasladoService {

  private _rutaBase:string = this.globales.ruta+'php/traslados/';

  constructor(private client:HttpClient, private globales:Globales) { }

  getTraslado(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_traslado_by_id.php', {params:p});
  }

  getListaTraslados(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_traslados.php', {params:p});
  }

  saveTraslado(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_traslado.php', datos);
  }

  editTraslado(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'editar_traslado.php', datos);
  }

  anularTraslado(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'anular_traslado.php', data);
  }

}
