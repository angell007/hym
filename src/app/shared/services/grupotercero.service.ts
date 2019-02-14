import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class GrupoterceroService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getGruposTercero():Observable<any>{
    return this.client.get(this.globales.ruta+'php/gruposterceros/get_grupos.php');
  }

  getGruposPadre():Observable<any>{
    return this.client.get(this.globales.ruta+'php/gruposterceros/get_grupos_padre.php');
  }

  saveGrupoTercero(data:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/gruposterceros/guardar_grupo.php', data);
  }

}
