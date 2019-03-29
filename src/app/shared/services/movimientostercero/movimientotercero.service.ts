import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class MovimientoterceroService {

  constructor(private client:HttpClient, private globales:Globales) { }

  private _rutaBase:string = this.globales.ruta+'php/movimientos/';

  getMovimientosTercero(idTercero:string, idMoneda:string):Observable<any>{
    let p = {id_tercero:idTercero, id_moneda:idMoneda};
    return this.client.get(this._rutaBase+'get_movimientos_tercero.php', {params: p});
  }

} 
