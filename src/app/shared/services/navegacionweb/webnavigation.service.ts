import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable()
export class WebnavigationService {

  constructor(private _location:Location) { }

  public GoBackBrowser(){
    this._location.back();
  }

}
