import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class ConfiguracionService {

  private _rutaBase:string = this.globales.ruta+'php/configuracion';

  constructor(private client:HttpClient, private globales:Globales) { }

  getPredeterminados():Observable<any>{
    return this.client.get(this._rutaBase+'/get_predeterminados.php');
  }

  savePredeterminados(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/guardar_predeterminados.php', datos);
  }

}
