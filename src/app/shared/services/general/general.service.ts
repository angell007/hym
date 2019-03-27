import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';
import { SwalService } from '../swal/swal.service';

@Injectable()
export class GeneralService {

  public Funcionario:any = JSON.parse(localStorage.getItem('User'));
  public RutaImagenes:string = this.globales.ruta+"IMAGENES/";

  constructor(private client:HttpClient, private globales:Globales, private _swalService:SwalService) { }

  public checkIdentificacion(id:string):Observable<any>{
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

  public verifyMajorCode(codigo:string):Observable<any>{
    let p = {codigo:codigo};
    return this.client.get(this.globales.ruta+'php/GENERALES/VerificarCodigoPersonal.php', {params:p});
  }

  public getDepCiuOficina(oficina:string):Observable<any>{
    let p = {oficina:oficina};
    return this.client.get(this.globales.ruta+'php/oficinas/get_departamento_ciudad_oficina.php', {params:p});
  }

  public getPaises(){
    return this.globales.Paises; 
  }

  public getMonedas(){
    return this.globales.Monedas;
  }

  public getTiposCuenta(){
    return this.globales.TiposCuenta;
  }

  public limpiarString(modelo:any){
    let tipo = typeof(modelo);

    switch (tipo) {
      case 'string':
        return modelo.trim();

      case 'object':
        let clean_model = modelo;
        for (const key in clean_model) {          
          if (clean_model.hasOwnProperty(key)) {
            if (typeof(clean_model[key]) == 'string') {
              clean_model[key] = clean_model[key].trim();              
            }
          }
        }
        return clean_model;
    
      default:
        break;
    }
  }

  public IsObjEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  public searchRiff(){
    this.globales.buscarRiff();
  }

  public KeyboardOnlyNumbersAndDecimal($event: KeyboardEvent){
    return $event.charCode >= 48 && $event.charCode <= 57;
  }

  FillEmptyValues(objRef:any, value:any=''){
    let obj = objRef;
    for (const key in obj) {
      if (typeof(obj[key]) == 'string') {
        if (obj[key] == '' && typeof(value) == 'string') {        
          obj[key] = value;
        }else{
          this._swalService.ShowMessage(['warning', 'Alerta', 'Se intenta ingresar un valor del tipo incorrecto en '+key]);
        }
      }else if (typeof(obj[key]) == 'number') {
        if (!obj[key] || obj[key]==null) {                
          obj[key] = 0;
        }
      }
    }
      
    return obj;
  }
}
