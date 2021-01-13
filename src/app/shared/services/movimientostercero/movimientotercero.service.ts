import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class MovimientoterceroService {

  constructor(private client: HttpClient, private globales: Globales) { }

  private _rutaBase: string = this.globales.ruta + 'php/movimientos/';

  getMovimientosTercero(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_movimientos_tercero.php', { params: p });
  }

  getPesosTercero(datos:any):Observable<any>{
    
    return this.client.get( this.globales.ruta+'php/movimientos/get_movimientos_tercero_pesos.php', {params:datos});
    
  }

  getMovimientoTercero(idMovimientoTercero: string): Observable<any> {
    let p = { id_movimiento: idMovimientoTercero };
    return this.client.get(this._rutaBase + 'get_movimiento_tercero.php', { params: p });
  }

  saveMovimientoTercero(data: FormData): Observable<any> {
    return this.client.post(this._rutaBase + 'guardar_movimiento_tercero.php', data);
  }

  editMovimientoTercero(data: FormData): Observable<any> {
    return this.client.post(this._rutaBase + 'editar_movimiento_tercero.php', data);
  }

  anularMovimientoTercero(data: FormData): Observable<any> {
    return this.client.post(this._rutaBase + 'cambiar_estado_movimiento_tercero.php', data);
  }

} 
