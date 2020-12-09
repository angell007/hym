import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class GrupoterceroService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getGruposTercero(p:string):Observable<any>{
    return this.client.get(this.globales.ruta+'php/gruposterceros/get_grupos.php?'+p);
  }

  getGrupos():Observable<any>{
    return this.client.get(this.globales.ruta+'php/gruposterceros/get_lista_grupos.php');
  }

  getGrupoTercero(idGrupo:string):Observable<any>{
    let p = {id_grupo:idGrupo};
    return this.client.get(this.globales.ruta+'php/gruposterceros/get_grupo.php', {params:p});
  }

  getGruposPadre():Observable<any>{
    return this.client.get(this.globales.ruta+'php/gruposterceros/get_grupos_padre.php');
  }

  getGruposPadreEditar(idGrupo:string):Observable<any>{
    let p = {id_grupo:idGrupo};
    return this.client.get(this.globales.ruta+'php/gruposterceros/get_grupos_padre_edicion.php', {params:p});
  }

  saveGrupoTercero(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/gruposterceros/guardar_grupo.php', data);
  }

  editGrupoTercero(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/gruposterceros/editar_grupo.php', data);
  }

  cambiarEstadoGrupoTercero(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/gruposterceros/cambiar_estado_grupo.php', data);
  }
}
