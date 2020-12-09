import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ActualizarService {

  public  cardListing = new Subject();
  public  cardListing$ = this.cardListing.asObservable();
  constructor() { }
}
