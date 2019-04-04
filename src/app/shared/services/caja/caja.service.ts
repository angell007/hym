import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class CajaService {

  private _rutaBase:string = this.globales.ruta+'php/cajas/';

  constructor(private client:HttpClient, private globales:Globales) { }

  verificarCaja(idCaja:string):Observable<any>{
    let p = {id_caja:idCaja};
    return this.client.get(this._rutaBase+'verificar_caja.php', {params:p});
  }

  getNombreCaja(idCaja:string):Observable<any>{
    let p = {id_caja:idCaja};
    return this.client.get(this._rutaBase+'get_nombre_caja.php', {params:p});
  }

  getCaja(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_caja_by_id.php', {params:p});
  }

  getCajasOficina(idOficina:string):Observable<any>{
    let p = {id_oficina:idOficina};
    return this.client.get(this._rutaBase+'get_cajas_por_oficina.php', {params:p});
  }

  getListaCajas(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_cajas.php', {params:p});
  }

  getCajasAbiertasGeneral(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'cajas_abiertas_general.php', {params:p});
  }

  getCajasAbiertasFuncionario(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'cajas_abiertas.php', {params:p});
  }

  getTotalesCajasGeneral(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'totales_cajas_general.php', {params:p});
  }

  getTotalesCajasFuncionario(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'totales_cajas.php', {params:p});
  }

  saveCaja(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_caja.php', datos);
  }

  editCaja(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'editar_caja.php', datos);
  }

  cambiarEstadoCaja(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'cambiar_estado_caja.php', data);
  }


}
