import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class CajarecaudoService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getListaCajaRecaudos(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/cajarecaudos/get_lista_caja_recaudos.php', {params:p});
  }

  getCajaRecaudo(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/cajarecaudos/get_caja_recaudo_por_id.php', {params:p});
  }

  saveCajaRecaudo(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/cajarecaudos/guardar_caja_recaudo.php', data);
  }

  editCajaRecaudo(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/cajarecaudos/editar_caja_recaudo.php', data);
  }

  cambiarEstadoCajaRecaudo(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/cajarecaudos/cambiar_estado_caja_recaudo.php', data);
  }

}
