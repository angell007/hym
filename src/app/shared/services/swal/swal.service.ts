import { Injectable } from '@angular/core';
import { timer } from 'd3';
import { Subject } from 'rxjs/Subject';
import { isArray } from 'util';

@Injectable()
export class SwalService {

  public _subject = new Subject<object>();
  public event = this._subject.asObservable();
  private SwalObj: any = {
    type: 'warning',
    title: 'Alerta',
    msg: 'Default message!',
<<<<<<< HEAD
    timer : null,
    html : '<a href="">Link</a>'
=======
    timer: 500
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
  };

  constructor() { }

  public ShowMessage(data: any) {
    this.SetSwalData(data);
    this._subject.next(this.SwalObj);
  }

  private SetSwalData(data: any) {
    if (typeof (data) == 'object') {
      if (isArray(data)) {
        let i = 0;
        for (const key in this.SwalObj) {
          this.SwalObj[key] = data[i];
          i++;
        }
      } else {
        this.SwalObj.type = data.codigo;
        this.SwalObj.title = data.titulo;
        this.SwalObj.msg = data.mensaje;
      }
    }
  }

}
