import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Injectable()
export class GeneralService {

  public Funcionario:any = JSON.parse(localStorage.getItem('User'));
  public RutaImagenes:string = this.globales.ruta+"IMAGENES/";

  constructor(private client:HttpClient, private globales:Globales) { }

  checkIdentificacion(id:string):Observable<any>{
    let p = {id:id};
    return this.client.get(this.globales.ruta+'php/GENERALES/validar_numero_identificacion.php', {params:p});
  }  

  normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
          ret.push(mapping[c]);
        else
          ret.push(c);
      }
      return ret.join('');
    }

  })();

  verifyMajorCode(codigo:string):Observable<any>{
    let p = {codigo:codigo};
    return this.client.get(this.globales.ruta+'php/GENERALES/VerificarCodigoPersonal.php', {params:p});
  }

  getDepCiuOficina(oficina:string):Observable<any>{
    let p = {oficina:oficina};
    return this.client.get(this.globales.ruta+'php/oficinas/get_departamento_ciudad_oficina.php', {params:p});
  }

}
