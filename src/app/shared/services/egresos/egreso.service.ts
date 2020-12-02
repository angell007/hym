import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class EgresoService {

  constructor(private client: HttpClient, private globales: Globales) { }

  private _rutaBase: string = this.globales.ruta + 'php/egresos/';

  getEgreso(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_egreso_by_id.php', { params: p });
  }

  getListaEgresos(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_lista_egresos.php', { params: p });
  }

  saveEgreso(datos: FormData): Observable<any> {
    return this.client.post(this.globales.rutaNueva + 'egresos', datos);
  }

  editEgreso(datos: FormData): Observable<any> {
    return this.client.post(this._rutaBase + 'editar_egreso.php', datos);
  }

  anularEgreso(data: FormData): Observable<any> {
    return this.client.post(this._rutaBase + 'anular_egreso.php', data);
  }

}