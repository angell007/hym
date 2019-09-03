import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class DepartamentoService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getDepartamentos():Observable<any>{
    return this.client.get(this.globales.ruta+'php/departamentos/get_lista_departamentos.php');
  }

}
