import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class IndicadorService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getResumenFlujoEfectivo(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/Indicadores/flujoefectivo/get_resumen_flujo_efectivo.php', {params:p});
  }

}
