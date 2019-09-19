import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class CuentabancariaService {

  private _rutaBase:string = this.globales.ruta+'php/cuentasbancarias';

  constructor(private client:HttpClient, private globales:Globales) { }

  getCuentaBancaria(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_cuenta_bancaria_by_id.php', {params:p});
  }


  getCuentasBancarias():Observable<any>{
    return this.client.get(this._rutaBase+'/get_cuentas_bancarias.php');
  }

  getFiltrarCuentasBancarias(match:string):Observable<any>{
    let p = {match:match};
    return this.client.get(this._rutaBase+'/filtrar_cuentas_bancarias.php', {params:p});
  }

  getListaCuentasBancarias(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_lista_cuentas_bancarias.php', {params:p});
  }
  
  public GetCuentasBancariasApertura():Observable<any>{
    return this.client.get(this._rutaBase+'/get_cuentas_bancarias_apertura.php');
  }
  
  public GetCuentasBancariasAperturaObservable(idFuncionario:string):Observable<any>{
    let p = {id_funcionario:idFuncionario};
    return this.client.get(this._rutaBase+'/get_cuentas_bancarias_apertura_observable.php', {params:p});
  }
  
  public GetCuentasBancariasCierre(p:any):Observable<any>{
    // let p = {id_funcionario:idFuncionario};
    return this.client.get(this._rutaBase+'/get_cuentas_bancarias_cierre.php', {params:p});
  }
  
  public GetAperturaFuncionario(idFuncionario:string):Observable<any>{
    let p = {id_funcionario:idFuncionario};
    return this.client.get(this._rutaBase+'/consultar_apertura_cuenta_diaria.php', {params:p});
  }
  
  public GetCuentasFuncionarioApertura(idApertura:string):Observable<any>{
    let p = {id_apertura:idApertura};
    return this.client.get(this._rutaBase+'/get_cuentas_funcionario_apertura.php', {params:p});
  }
 
  public GetMovimientoCuentaBancariaUltimaSesion(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/get_movimientos_ultima_apertura.php', {params:p});
  }
  
  public GetCuentaBancariaDetalle(idCuenta:string):Observable<any>{
    let p = {id_cuenta:idCuenta};
    return this.client.get(this._rutaBase+'/get_cuenta_bancaria_detalle_by_id.php', {params:p});
  }
  
  public GetMontoCierreCuenta(idCuenta:string):Observable<any>{
    let p = {id_cuenta:idCuenta};
    return this.client.get(this._rutaBase+'/get_monto_cierre_cuenta.php', {params:p});
  }
  
  getCuentasBancariasFuncionario(idFuncionario:string):Observable<any>{
    let p = {id_funcionario:idFuncionario};
    return this.client.get(this._rutaBase+'/get_cuentas_asociadas_funcionario.php', {params:p});
  }

  getCuentasBancariasSelect():Observable<any>{
    return this.client.get(this._rutaBase+'/get_cuentas_bancarias_select.php');
  }

  deleteCuentaBancaria(idCuenta:string):Observable<any>{
    let p = {id_cuenta:idCuenta};
    return this.client.get(this._rutaBase+'/eliminar_cuenta_asociada.php', {params:p});
  }

  saveCuentaBancaria(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/guardar_cuenta_bancaria.php', datos);
  }

  editCuentaBancaria(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/editar_cuenta_bancaria.php', data);
  }

  cambiarEstadoCuenta(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/cambiar_estado_cuenta.php', datos);
  }

  public AperturaCuentaBancaria(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/aperturar_cuentas_bancarias.php', datos);
  }
  
  public CheckEstadoAperturaCuenta(idCuenta:string):Observable<any>{
    let p = {id_cuenta:idCuenta};
    return this.client.get(this._rutaBase+'/verificar_estado_cuenta.php', {params:p});
  }
  
  public SeleccionarCuenta(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'/seleccionar_cuenta.php', {params:p});
  }
  
  public DeseleccionarCuenta(idCuenta:string):Observable<any>{
    let p = {id_cuenta:idCuenta};
    return this.client.get(this._rutaBase+'/deseleccionar_cuenta.php', {params:p});
  }

  public GuardaCierreCuentasBancarias(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/guardar_cierre_cuentas_bancarias.php', datos);
  }
  
  public GuardaCompraCuenta(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/guardar_compra_cuenta.php', datos);
  }
  
  public RealizarMovimientoTransferencia(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/mover_transferencia_cuenta.php', datos);
  }
 
  public ActualizarMontoCierreCuenta(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'/actualizar_monto_cierre.php', datos);
  }

}
