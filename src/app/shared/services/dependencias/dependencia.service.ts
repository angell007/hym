import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class DependenciaService {

  constructor(private client:HttpClient, private globales:Globales) { }

  private _rutaBase:string = this.globales.ruta+'php/dependencias/';

  getDependencias():Observable<any>{
    return this.client.get(this._rutaBase+'get_dependencias.php');
  }

  getListaDependencias(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_dependencias.php', {params:p});
  }

  saveDependencia(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_dependencia.php', datos);
  }

}
