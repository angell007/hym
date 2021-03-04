import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Globales } from '../shared/globales/globales';

@Injectable()
export class NotificacionsService {
  public user = JSON.parse(localStorage['User']);
  public contadorTraslado = 0;
  public contadorTrasladoCustom = 0;
  public alertasCajas: any = [];
  public nuevaData: boolean = false;
  public temporalData: any = [];

  notifcaciones$ = new Subject<string>()

  constructor(private http: HttpClient, private globales: Globales) {

    TimerObservable.create(0, 15000)
      .subscribe(() => {
        this.counter();
      });

  }

  mifuncion(a1: Array<any>, a2: Array<any>) {
    return JSON.stringify(a1) === JSON.stringify(a2);
  }

  counter() {
    this.http.get(`${this.globales.ruta}/php/trasladocaja/notificaciones_traslado.php`, { params: { id: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {

      if (this.nuevaData) {

        this.alertasCajas = data;
        if (this.alertasCajas.length > 0) {
          this.notifcaciones$.next(this.alertasCajas.length)
        } else {
          this.notifcaciones$.next('0');
        }
        this.temporalData = data
        this.nuevaData = false;

      } else {
        if (!this.mifuncion(this.temporalData, data)) {

          this.alertasCajas = data;
          if (this.alertasCajas.length > 0) {
            this.notifcaciones$.next(this.alertasCajas.length)
          } else {
            this.notifcaciones$.next('0');
          }
          this.temporalData = data
        }
      }
    });
  }
}
