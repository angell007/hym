import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class PermisoService {

  constructor() { }

  public _subject = new Subject<boolean>();
  public _openSubject = new Subject<any>();

  public permisoJefe = this._subject.asObservable();
  public openModalPermiso = this._openSubject.asObservable();

  public permisoAceptado:boolean = false;

}
