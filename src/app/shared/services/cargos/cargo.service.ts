import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class CargoService {

  constructor(private client:HttpClient, private globales:Globales) { }

  private _rutaBase:string = this.globales.ruta+'php/cargos/';

  getCargos():Observable<any>{
    return this.client.get(this._rutaBase+'get_cargos.php');
  }

  getListaCargos(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_cargos.php', {params:p});
  }

  saveCargo(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_cargo.php', datos);
  }

}
