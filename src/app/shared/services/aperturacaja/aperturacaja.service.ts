import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class AperturacajaService {

  public _subject = new Subject<any>();
  public event = this._subject.asObservable();

  constructor() { }

  public OpenModalApertura(data:any) {
    this._subject.next();
  }

}
