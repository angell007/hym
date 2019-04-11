import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';


@Injectable()
export class NuevofuncionarioService {

  constructor(private client:HttpClient, private globales:Globales) { }

  private _rutaBase:string = this.globales.ruta+'php/funcionarios/';

  validarIdentificacion(idFuncionario:string):Observable<any>{
    let p = {id:idFuncionario};
    return this.client.get(this._rutaBase+'verificar_identificacion_funcionario.php', {params:p});
  }

  getPerfilesFuncionario(){
    return this.client.get(this._rutaBase+'perfiles_funcionario.php');
  }

  getListaEgresos(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_egresos.php', {params:p});
  }

  saveEgreso(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_egreso.php', datos);
  }

}
