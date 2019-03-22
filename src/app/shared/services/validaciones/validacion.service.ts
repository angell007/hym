import { Injectable } from '@angular/core';
import { SwalService } from '../swal/swal.service';

@Injectable()
export class ValidacionService {

  constructor(private swalService:SwalService) { }

  validateNumber(value:any, campo:string):boolean{
    let type = typeof(value);

    switch (type) {
      case 'string':
        if (value != '') {
          let num = parseFloat(value);
          return this._checkZeroValue(num, campo);
        }else{

          this.swalService.ShowMessage(['warning', 'Alerta', 'El valor esta vacio!']);
          return false;
        }

      case 'number':
        return this._checkZeroValue(value, campo);
    
      default:
        this.swalService.ShowMessage(['warning', 'Alerta', 'El valor enviado tiene un formato incorrecto!']);
        return false;
    }
  }

  validateString(value:string, campo:string = ''):boolean{
    
    if (value.trim() == '') {
      if (campo != '') {
        this.swalService.ShowMessage(['warning', 'Alerta', 'El valor del campo '+campo+' no puede estar vacio!']);
      }else{
        this.swalService.ShowMessage(['warning', 'Alerta', 'El valor no puede estar vacio!']);
      }
      
      return false;
    }else{
      return true;
    }
  }

  _checkZeroValue(value:number, campo:string):boolean{
    if (value <= 0) {
      this.swalService.ShowMessage(['warning', 'Alerta', campo+' no puede ser 0, por favor verifque!']);
      return false;
    }else{
      return true;
    }
  }
}
