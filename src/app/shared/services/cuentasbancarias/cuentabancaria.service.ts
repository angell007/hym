import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class CuentabancariaService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getCuentasBancarias():Observable<any>{
    return this.client.get(this.globales.ruta+'php/cuentasbancarias/get_cuentas_bancarias.php');
  }
  
  getCuentasBancariasFuncionario(idFuncionario:string):Observable<any>{
    let p = {id_funcionario:idFuncionario};
    return this.client.get(this.globales.ruta+'php/cuentasbancarias/get_cuentas_asociadas_funcionario.php', {params:p});
  }

  getCuentasBancariasSelect():Observable<any>{
    return this.client.get(this.globales.ruta+'php/cuentasbancarias/get_cuentas_bancarias_select.php');
  }

  deleteCuentaBancaria(idCuenta:string):Observable<any>{
    let p = {id_cuenta:idCuenta};
    return this.client.get(this.globales.ruta+'php/cuentasbancarias/eliminar_cuenta_asociada.php');
  }

}
