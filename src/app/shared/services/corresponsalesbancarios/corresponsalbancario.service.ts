import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class CorresponsalbancarioService {

  constructor(private client:HttpClient, private globales:Globales) { }

  private _rutaBase:string = this.globales.ruta+'php/corresponsalesbancarios/';

  getCorresponsales():Observable<any>{
    return this.client.get(this._rutaBase+'get_corresponsales_bancarios.php');
  }

  getMovimientosCorresponsal(idCorresponsal:string):Observable<any>{
    let p = {id_corresponsal:idCorresponsal};
    return this.client.get(this.globales.ruta+'php/corresponsaldiario/get_movimientos_diarios.php', {params:p});
  }

  editCorresponsalDiario(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/corresponsaldiario/editar_movimiento_diario.php', data);
  }

  saveCorresponsalDiario(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/corresponsaldiario/guardar_corresponsal_diario_nuevo2.php', data);
  }

}
