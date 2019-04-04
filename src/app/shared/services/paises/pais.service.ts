import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class PaisService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getPaises(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/paises/get_paises.php', {params:p});
  }

  getAllPaises():Observable<any>{
    return this.client.get(this.globales.ruta+'php/paises/get_paises_todos.php');
  }

  getServicio(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/paises/get_servicio_by_id.php', {params:p});
  }

  saveServicio(datos:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/paises/guardar_servicio_externo.php', datos);
  }

  editServicio(datos:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/paises/editar_servicio.php', datos);
  }

  cambiarEstadoServicio(datos:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/paises/cambiar_estado_servicio.php', datos);
  }

}
