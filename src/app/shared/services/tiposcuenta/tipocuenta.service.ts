import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class TipocuentaService {

  private _rutaBase:string = this.globales.ruta+'php/tiposcuenta';

  constructor(private client:HttpClient, private globales:Globales) { }

  getTipoCuenta(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_tipo_cuenta_by_id.php', {params:p});
  }

  getTiposCuenta():Observable<any>{
    return this.client.get(this._rutaBase+'/get_tipos_cuenta.php');
  }

  getListaTiposCuenta(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_lista_tipo_cuenta.php', {params:p});
  }

  saveTipoCuenta(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/guardar_tipo_cuenta.php', datos);
  }

  editTipoCuenta(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/editar_tipo_cuenta.php', data);
  }

  cambiarEstadoTipoCuenta(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/cambiar_estado_tipo_cuenta.php', datos);
  }

}
