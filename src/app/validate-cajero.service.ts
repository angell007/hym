import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ThousandSeparatorDirective } from './shared/directives/thousand-separator.directive';
import { Globales } from './shared/globales/globales';


@Injectable()

export class ValidateCajeroService {

  protected dataPermis: Array<object>

  constructor(private globales: Globales, private client: HttpClient) {
    this.isValid()
  }

  isValid() {
    const misPermisos = JSON.parse(window.localStorage.getItem('permisos'));
    let pos = misPermisos.find((permiso) => {
      return permiso.Nombre_Modulo == 'Cajero' || permiso.Nombre_Modulo == 'Cajero Principal';
    })
    if ((pos != null && pos != undefined && pos != '') || JSON.parse(localStorage['User']).Id_Perfil == 2 || JSON.parse(localStorage['User']).Id_Perfil == 3) {
      return true
    } else {
      return false
    }
    // this.dataPermis = await this.verifyElementIn()
    // let tem = false;
    // this.dataPermis.forEach((permisoDatabase) => {
    //   tem = JSON.parse(localStorage.getItem('permisos')).
    //     some((permisoFuncionario: object,) => permisoFuncionario['Nombre_Modulo'] == permisoDatabase['Nombre_Modulo'])
    // })

    // return tem;

  }

  // async verifyElementIn() {
  //   return this.client.get(this.globales.rutaNueva + 'modulos').
  //     pipe().
  //     toPromise()
  //     .then(async (data: Array<object>) => await this.filterElementIn(data))
  // }

  // async filterElementIn(data: Array<object>) {
  //   return data.filter((permiso: object) => permiso['Nombre_Modulo'] == 'Cajero' || permiso['Nombre_Modulo'] == 'POS' || permiso['Nombre_Modulo'] == 'Cajero Principal')
  // }
}
