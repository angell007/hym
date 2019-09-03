import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class ServiciosexternosService {

  constructor(private client:HttpClient, private globales:Globales) { }

  getServicios(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/serviciosexternos/get_servicios_externos.php', {params:p});
  }

  getServicio(p:any):Observable<any>{
    return this.client.get(this.globales.ruta+'php/serviciosexternos/get_servicio_by_id.php', {params:p});
  }

  saveServicio(datos:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/serviciosexternos/guardar_servicio_externo.php', datos);
  }

  editServicio(datos:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/serviciosexternos/editar_servicio.php', datos);
  }

  cambiarEstadoServicio(datos:FormData):Observable<any>{
    return this.client.post(this.globales.ruta+'php/serviciosexternos/cambiar_estado_servicio.php', datos);
  }

}
