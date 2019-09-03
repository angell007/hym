import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';


@Injectable()
export class PerfilService {

  constructor(private client:HttpClient, private globales:Globales) { }

  private _rutaBase:string = this.globales.ruta+'php/perfiles/';

  getPerfiles(){
    return this.client.get(this._rutaBase+'get_perfiles.php');
  }

  getPermisosPerfil(idPerfil:string){
    let p = {id_perfil:idPerfil};
    return this.client.get(this._rutaBase+'get_permisos_perfil.php', {params:p});
  }

  getPerfilPermisosFuncionario(){
    return this.client.get(this._rutaBase+'get_permisos_funcionario.php');
  }

}
