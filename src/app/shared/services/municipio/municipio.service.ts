import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class MunicipioService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getMunicipios():Observable<any>{
    return this.client.get(this.globales.ruta+'php/municipios/get_lista_municipios.php');
  }

  getMunicipiosDepartamento(idDepartamento:string):Observable<any>{
    let p = {id_departamento:idDepartamento};
    return this.client.get(this.globales.ruta+'php/municipios/get_lista_municipios_departamento.php', {params:p});
  }

}
