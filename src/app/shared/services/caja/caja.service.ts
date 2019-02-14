import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class CajaService {

  constructor(private client:HttpClient, private globales:Globales) { }

  verificarCaja(idCaja:string):Observable<any>{
    let p = {id_caja:idCaja};
    return this.client.get(this.globales.ruta+'php/cajas/verificar_caja.php', {params:p});
  }

  getNombreCaja(idCaja:string):Observable<any>{
    let p = {id_caja:idCaja};
    return this.client.get(this.globales.ruta+'php/cajas/get_nombre_caja.php', {params:p});
  }

}
