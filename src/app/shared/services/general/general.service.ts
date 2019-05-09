import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';
import { SwalService } from '../swal/swal.service';
import { DatePipe } from '@angular/common';
import { SessionDataModel } from '../../../Modelos/SessionDataModel';

@Injectable()
export class GeneralService {

  public SessionDataModel:SessionDataModel = new SessionDataModel();
  public Funcionario:any = JSON.parse(localStorage.getItem('User'));
  public Oficina:any = JSON.parse(localStorage.getItem('Oficina'));
  public Caja:any = JSON.parse(localStorage.getItem('Caja'));
  public RutaImagenes:string = this.globales.ruta+"IMAGENES/";
  public RutaPrincipal:string = this.globales.ruta;
  public FechaActual:string;
  public HoraActual:string;
  public FullFechaActual:string;
  public Meses:Array<string> = ['Enero','Febrero','Marzo', 'Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  public Anios:Array<number> = [];

  public PerfilesPermisos:Array<any> = [
    {Titulo_Modulo:'Agentes Externos', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Transferencias', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Traslados', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Egresos', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Giros', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Corresponsal Bancario', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Servicio Externo', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Indicadores', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Balance General', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Flujo Efectivo', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Configuracion', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Configuracion General', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Cargo', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Oficinas', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Cajas', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Bancos', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Cuentas Bancarias', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Destinatarios', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Cajas Recaudos', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Perfiles', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Remitentes', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Funcionarios', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Terceros', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Grupos', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Tipos de Documentos', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Tipos de Cuentas', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Monedas', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Informacion Giros', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Compras', Crear:0, Editar:0, Eliminar:0, Ver:0},
    {Titulo_Modulo:'Log de Sistema', Crear:0, Editar:0, Eliminar:0, Ver:0}
  ];

  constructor(private client:HttpClient, 
              private globales:Globales, 
              private _swalService:SwalService,
              private datePipe:DatePipe) 
  {
    this.FechaActual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.HoraActual = this.datePipe.transform(new Date(), 'HH:mm:ss');
    this.FullFechaActual = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    console.log(this.HoraActual);
    console.log(this.FechaActual);
    console.log(this.FullFechaActual);
    this.BuildAniosConsulta();
    
  }

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

  BuildAniosConsulta():void{
    let currentDate = new Date();

    let anioInicial = 2019;
    let currentYear = currentDate.getFullYear();

    for (let index = anioInicial; index <= currentYear; index++) {
      this.Anios.push(index);      
    }

    console.log(this.Anios);
    
  }
}
