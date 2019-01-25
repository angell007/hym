import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';


@Injectable()
export class Globales {
  ruta: string = 'https://hym.corvuslab.co/';
  public Monedas:any = [];
  public Paises:any = [];
  public TipoDocumentoExtranjero:any = [];
  public CuentasPersonalesPesos:any = [];
  public FuncionariosCaja:any = [];
  public CorresponsalesBancarios:any = [];
  public ServiciosExternos:any = [];
  //llamar de base de datos para obtener los datos de configuración
  //se declara constructor para poderlo inicalizar
  constructor(private client:HttpClient) {
    this.BuscarMonedas();
    this.BuscarPaises();
    this.BuscarTiposDocumentos();
    this.BuscarCuentasPersonales();
    this.BuscarCajerosSitema();
    this.BuscarCorresponsales();
    this.BuscarServiciosExternos();
  }

  BuscarMonedas():void{
    this.client.get(this.ruta+'php/monedas/lista_monedas.php').subscribe((data)=>{      
      this.Monedas = data;
      
    });
  }

  BuscarPaises():void{
    this.client.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Pais'}}).subscribe((data:any)=>{
      this.Paises= data;
    });
  }

  BuscarTiposDocumentos():void{
    this.client.get(this.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Documento_Extranjero' } }).subscribe((data: any) => {
      this.TipoDocumentoExtranjero = data;
      
    });
  }

  BuscarCuentasPersonales(moneda:string = 'Pesos'):void{
    this.client.get(this.ruta + 'php/cuentasbancarias/buscar_cuentas_bancarias_por_moneda.php', { params: { moneda: moneda } }).subscribe((data: any) => {
      this.CuentasPersonalesPesos = data;
    });
  }

  BuscarCajerosSitema(){
    this.client.get(this.ruta + 'php/pos/lista_cajeros_sistema.php').subscribe((data: any) => {
      this.FuncionariosCaja = data;
    });
  }

  BuscarCorresponsales(){
    this.client.get(this.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Corresponsal_Bancario' } }).subscribe((data: any) => {
      this.CorresponsalesBancarios = data;
    });
  }

  BuscarServiciosExternos(){
    this.client.get(this.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio_Externo' } }).subscribe((data: any) => {
      this.ServiciosExternos = data;
    });
  }

  IsObjEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }
  
}