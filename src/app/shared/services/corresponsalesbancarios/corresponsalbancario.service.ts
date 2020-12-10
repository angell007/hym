import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class CorresponsalbancarioService {

<<<<<<< HEAD
  constructor(private client: HttpClient, private globales: Globales) { }

  private _rutaBase: string = this.globales.ruta + 'php/corresponsalesbancarios/';

  public GetRegistrosDiarios(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_registros_corresponsales_bancarios.php', { params: p });
  }

  getCorresponsales(): Observable<any> {
    return this.client.get(this._rutaBase + 'get_corresponsales_bancarios.php');
  }

  getMovimientosCorresponsal(idCorresponsal: string): Observable<any> {
    let p = { id_corresponsal: idCorresponsal };
    return this.client.get(this.globales.ruta + 'php/corresponsaldiario/get_movimientos_diarios.php', { params: p });
  }

  editCorresponsalDiario(data: FormData): Observable<any> {
    return this.client.post(this.globales.ruta + 'php/corresponsaldiario/editar_movimiento_diario.php', data);
  }

  saveCorresponsalDiario(data: FormData): Observable<any> {
    return this.client.post(this.globales.ruta + 'php/corresponsaldiario/guardar_corresponsal_diario_nuevo2.php', data);
  }

  public GuardarCorresponsalBancario(data: FormData): Observable<any> {
    return this.client.post(this.globales.ruta + 'php/corresponsalesbancarios/guardar_corresponsal.php', data);
  }

  public updateCorrespnsal(data: FormData): Observable<any> {
    return this.client.put(`${this.globales.rutaNueva}corresponsales-diarios/update`, data);
=======
  constructor(private client:HttpClient, private globales:Globales) { }

  private _rutaBase:string = this.globales.ruta+'php/corresponsalesbancarios/';

  public GetRegistrosDiarios(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_registros_corresponsales_bancarios.php', {params:p});
  }

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
  
  public GuardarCorresponsalBancario(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/corresponsalesbancarios/guardar_corresponsal.php', data);
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
  }

}
