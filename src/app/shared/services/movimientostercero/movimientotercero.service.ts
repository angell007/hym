import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class MovimientoterceroService {

  constructor(private client:HttpClient, private globales:Globales) { }

  private _rutaBase:string = this.globales.ruta+'php/movimientos/';

  getMovimientosTercero(idTercero:string):Observable<any>{
    let p = {id:idTercero};
    return this.client.get(this._rutaBase+'movimiento_tercero.php', { params: p});
  }

}
