import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class AgenteexternoService {

  private _rutaBase:string = this.globales.ruta+'php/agentesexternos/';

  constructor(private client:HttpClient, private globales:Globales) { }

  verificarIdentificacionAgenteExterno(identificacion:string):Observable<any>{
    let p = {id:identificacion};
    return this.client.get(this._rutaBase+'verificar_identificacion_agente_externo.php', {params:p});
  }

  getAgenteExterno(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_agente_externo_by_id.php', {params:p});
  }

  getListaAgenteExternos(p:any):Observable<any>{
    return this.client.get(this._rutaBase+'get_lista_agentes_externos.php', {params:p});
  }

  saveAgenteExterno(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'guardar_agente_externo.php', datos);
  }

  editAgenteExterno(datos:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'editar_agente_externo.php', datos);
  }

  cambiarEstadoAgenteExterno(data:FormData):Observable<any>{
    return this.client.post(this._rutaBase+'cambiar_estado_agente_externo.php', data);
  }

}
