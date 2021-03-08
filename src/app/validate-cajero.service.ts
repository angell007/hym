import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ThousandSeparatorDirective } from './shared/directives/thousand-separator.directive';
import { Globales } from './shared/globales/globales';


@Injectable()

export class ValidateCajeroService {

  protected dataPermis: Array<object>
  public permisos;
  public indicadores: boolean;
  public configuracion: boolean;

  constructor(private globales: Globales, private client: HttpClient) {

    this.isValid()
  }

  isValid() {
    const misPermisos = JSON.parse(window.localStorage.getItem('permisos'));
    if (misPermisos != null && misPermisos != undefined) {
      let pos = misPermisos.find((permiso) => {
        return permiso.Nombre_Modulo == 'Cajero' || permiso.Nombre_Modulo == 'Cajero Principal';
      })
      if ((pos != null && pos != undefined && pos != '') || JSON.parse(localStorage['User']).Id_Perfil == 2 || JSON.parse(localStorage['User']).Id_Perfil == 3) {
        return true
      } else {
        return false
      }
    }
  }

  validatePermission(user: any) {
    this.client.get(this.globales.ruta + 'php/perfiles/dashboard.php', {
      params: { id: user.Identificacion_Funcionario }
    }).subscribe((data: any) => {
      window.localStorage.setItem('permisos', JSON.stringify(data.permisos));
      this.permisos = data.permisos;
      let auxind = this.permisos.find(element => element['Nombre_Modulo'] == 'Indicadores')
      this.indicadores = (auxind != undefined) ? true : false
      let auxcon = this.permisos.find(element => element['Nombre_Modulo'] == 'Configuracion')
      this.configuracion = (auxcon != undefined) ? true : false
    });
  }

  logout() {
    this.indicadores = false;
    this.configuracion = false;
  }
}
