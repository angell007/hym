import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class GrupoService {

  constructor(private client:HttpClient, private globales:Globales) { }

  private _rutaBase:string = this.globales.ruta+'php/grupos/';

  getGrupos():Observable<any>{
    return this.client.get(this._rutaBase+'get_grupos.php');
  }

  getListaEgresos(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_egresos.php', {params:p});
  }

  saveEgreso(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_egreso.php', datos);
  }

}
