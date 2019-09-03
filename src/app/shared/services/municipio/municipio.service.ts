import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class MunicipioService {

  constructor(private client:HttpClient, private globales:Globales) { }

  private _rutaBase:string = this.globales.ruta+'php/municipios/';

  getMunicipios():Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_municipios.php');
  }

  getMunicipiosDepartamento(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_municipios_departamento.php', {params:p});
  }

}
