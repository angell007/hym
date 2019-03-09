import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class MonedaService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getMonedasPais(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/monedas/get_monedas_por_pais.php', {params: p});
  }

}
