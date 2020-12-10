import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class RemitenteService {

  constructor(private client: HttpClient, private globales: Globales) { }

  private _rutaBase: string = this.globales.ruta + 'php/remitentes/';
  private rutaNueva: string = this.globales.rutaNueva;

<<<<<<< HEAD

=======
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
  getRemitente(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_remitente_by_id.php', { params: p });
  }

  getListaRemitentes(p: any): Observable<any> {
    return this.client.get(this._rutaBase + 'get_lista_remitentes.php', { params: p });
  }

  saveRemitente(datos: FormData): Observable<any> {
    return this.client.post(this.rutaNueva + 'remitentes', datos);
  }

  editRemitente(datos: FormData): Observable<any> {
    return this.client.post(this._rutaBase + 'editar_remitente.php', datos);
  }

  cambiarEstadoRemitente(data: FormData): Observable<any> {
    return this.client.post(this._rutaBase + 'cambiar_estado_remitente.php', data);
  }

}
