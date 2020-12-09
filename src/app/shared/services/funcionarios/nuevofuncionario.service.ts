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

  getPerfilesFuncionario(idPerfil:string, idFuncionario:string){
    let p = {id_funcionario:idFuncionario, id_perfil:idPerfil};
    return this.client.get(this._rutaBase+'get_permisos_funcionario.php', {params:p});
  }

  getDatosFuncionario(idFuncionario:string):Observable<any>{
    let p ={id_funcionario:idFuncionario};
    return this.client.get(this._rutaBase+'get_funcionario_by_id.php', {params:p});
  }

  getListaFuncionarios(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_funcionarios.php', {params:p});
  }
  
  public FiltrarFuncionariosXNombre(nombre:string):Observable<any>{
    let p ={match:nombre};
    return this.client.get(this._rutaBase+'filtrar_funcionario.php', {params:p});
  }

  saveFuncionario(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_funcionario_nuevo.php', datos);
  }
  
  public LogCierreSesion(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_log_cierre_sesion.php', datos);
  }

  editFuncionario(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'editar_funcionario.php', datos);
  }

  cambiarEstadoFuncionario(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'cambiar_estado_funcionario.php', datos);
  }

}
