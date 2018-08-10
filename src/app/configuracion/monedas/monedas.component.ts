import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { html } from 'd3';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-monedas',
  templateUrl: './monedas.component.html',
  styleUrls: ['./monedas.component.css'],
})
export class MonedasComponent implements OnInit {

  public Monedas : any[];

  //variables de formulario
  public Nombre : any[];
  public Codigo : any[];
  public Orden : any[];
  public MaxVentaEfectivo : any[];
  public MinVentaEfectivo : any[];
  public MaxVentaCuenta : any[];
  public MinVentaCuenta : any[];
  public SugeridoVenta : any[];
  public SugeridoCompra : any[];
  public PrecioVentanilla : any[];
  public MaxCompra : any[];
  public MinCompra : any[];
  public MinNoCobro : any[];
  public RedondeoPesosEfectivo : any[];
  public RedondeoPesosCuenta : any[];
  public ComisionEfectivo : any[];
  public PagarComisionDesde : any[];
  public ComisionRecaudo : any[];
  public Cambio : boolean;
  public Giro : boolean;
  public Traslado : boolean;
  public CorresponsalBancario : boolean;
  public ServicioExterno : boolean;
  public Gasto : boolean;
  public Transferencia : boolean;
  public Identificacion : any[];

  public boolNombre:boolean = false;
  public boolCodigo:boolean = false;
  public boolOrden:boolean = false;
  public boolMaxVentaEfectivo:boolean = false;
  public boolMinVentaEfectivo:boolean = false;
  public boolMaxVentaCuenta:boolean = false;
  public boolMinVentaCuenta:boolean = false;
  public boolSugeridoVenta:boolean = false;
  public boolSugeridoCompra:boolean = false;
  public boolPrecioVentanilla:boolean = false;
  public boolMaxCompra:boolean = false;
  public boolMinCompra:boolean = false;
  public boolMinNoCobro:boolean = false;
  public boolRedondeoPesosEfectivo:boolean = false;
  public boolRedondeoPesosCuenta:boolean = false;
  public boolComisionEfectivo:boolean = false;
  public boolPagarComisionDesde:boolean = false;
  public boolComisionRecaudo:boolean = false;

  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('ModalVerMoneda') ModalVerMoneda:any;
  @ViewChild('ModalEditarMoneda') ModalEditarMoneda:any;
  @ViewChild('ModalMoneda') ModalMoneda:any;
  @ViewChild('FormMoneda') FormMoneda:any;
  
  constructor(private http : HttpClient,private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();
    //console.log(this.myCheckbox);
    /*this.transferencia = false;
    this.transferencia = true;
    this.transferencia = false;      
    this.myCheckbox.nativeElement.checked = false; 
    this.dummy = <HTMLInputElement> document.getElementById("my_checkbox");
    console.log(this.dummy); 
    this.dummy.checked = false;*/
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.OcultarFormularios();
    }
  }

  OcultarFormularios()
  {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalMoneda);
    this.OcultarFormulario(this.ModalVerMoneda);
    this.OcultarFormulario(this.ModalEditarMoneda);
  }

  InicializarBool()
  {
    this.boolNombre = false;
    this.boolCodigo = false;
    this.boolOrden = false;
    this.boolMaxVentaEfectivo = false;
    this.boolMinVentaEfectivo = false;
    this.boolMaxVentaCuenta = false;
    this.boolMinVentaCuenta = false;
    this.boolSugeridoVenta = false;
    this.boolSugeridoCompra = false;
    this.boolPrecioVentanilla = false;
    this.boolMaxCompra = false;
    this.boolMinCompra = false;
    this.boolMinNoCobro = false;
    this.boolRedondeoPesosEfectivo = false;
    this.boolRedondeoPesosCuenta = false;
    this.boolComisionEfectivo = false;
    this.boolPagarComisionDesde = false;
    this.boolComisionRecaudo = false;
  }

  ActualizarVista(){
    this.http.get(this.globales.ruta+'php/monedas/lista_monedas.php').subscribe((data:any)=>{
      this.Monedas= data; 
    });
  }

  GuardarMoneda(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    //formulario.ge
    let datos = new FormData();   
    console.log(info);             
    datos.append("modulo",'Moneda');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
    console.log(datos["datos"]);    
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    })
    .subscribe((data:any)=>{
      //console.log(data);      
      formulario.reset();
      this.ActualizarVista();
      this.InicializarBool();
      this.saveSwal.show();
    });

    
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerMoneda(id, modal){
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Moneda', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Codigo = data.Codigo;
      this.Orden = data.Orden;
      this.MaxVentaEfectivo = data.Max_Venta_Efectivo;
      this.MinVentaEfectivo = data.Min_Venta_Efectivo;
      this.MaxVentaCuenta = data.Max_Venta_Cuenta;
      this.MinVentaCuenta = data.Min_Venta_Cuenta;
      this.SugeridoVenta = data.Sugerido_Venta;
      this.SugeridoCompra = data.Sugerido_Compra;
      this.PrecioVentanilla = data.Precio_Ventanilla;
      this.MaxCompra = data.Max_Compra;
      this.MinCompra = data.Min_Compra;
      this.MinNoCobro = data.Min_No_Cobro;
      this.RedondeoPesosEfectivo = data.Redondeo_Pesos_Efectivo;
      this.RedondeoPesosCuenta = data.Redondeo_Pesos_Cuenta;
      this.ComisionEfectivo = data.Comision_Efectivo;
      this.PagarComisionDesde = data.Pagar_Comision_Desde;
      this.ComisionRecaudo = data.Comision_Recaudo;
      this.Cambio = data.Cambio;
      this.Giro = data.Giro;
      this.Traslado = data.Traslado;
      this.CorresponsalBancario = data.Corresponsal_Bancario;
      this.ServicioExterno = data.Servicio_Externo;
      this.Gasto = data.Gasto;
      this.Transferencia = data.Transferencia;
      modal.show();
    });
  }

  EliminarMoneda(id){
    let datos=new FormData();
    datos.append("modulo", 'Moneda');
    datos.append ("id",id);
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    });    
  }

  EditarMoneda(id, modal){
    this.InicializarBool();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Moneda', id:id}
    }).subscribe((data:any)=>{   
      console.log(data);         
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Codigo = data.Codigo;
      this.Orden = data.Orden;
      this.MaxVentaEfectivo = data.Max_Venta_Efectivo;
      this.MinVentaEfectivo = data.Min_Venta_Efectivo;
      this.MaxVentaCuenta = data.Max_Venta_Cuenta;
      this.MinVentaCuenta = data.Min_Venta_Cuenta;
      this.SugeridoVenta = data.Sugerido_Venta;
      this.SugeridoCompra = data.Sugerido_Compra;
      this.PrecioVentanilla = data.Precio_Ventanilla;
      this.MaxCompra = data.Max_Compra;
      this.MinCompra = data.Min_Compra;
      this.MinNoCobro = data.Min_No_Cobro;
      this.RedondeoPesosEfectivo = data.Redondeo_Pesos_Efectivo;
      this.RedondeoPesosCuenta = data.Redondeo_Pesos_Cuenta;
      this.ComisionEfectivo = data.Comision_Efectivo;
      this.PagarComisionDesde = data.Pagar_Comision_Desde;
      this.ComisionRecaudo = data.Comision_Recaudo;
      this.Cambio = data.Cambio;
      this.Giro = data.Giro;
      this.Traslado = data.Traslado;
      this.CorresponsalBancario = data.Corresponsal_Bancario;
      this.ServicioExterno = data.Servicio_Externo;
      this.Gasto = data.Gasto;
      this.Transferencia = data.Transferencia;
      modal.show();
    });
  }

  OcultarFormulario(modal)
  {
    this.Identificacion = null;
    this.Nombre = null;
    this.Codigo = null;
    this.Orden = null;
    this.MaxVentaEfectivo = null;
    this.MinVentaEfectivo = null;
    this.MaxVentaCuenta = null;
    this.MinVentaCuenta = null;
    this.SugeridoVenta = null;
    this.SugeridoCompra = null;
    this.PrecioVentanilla = null;
    this.MaxCompra = null;
    this.MinCompra = null;
    this.MinNoCobro = null;
    this.RedondeoPesosEfectivo = null;
    this.RedondeoPesosCuenta = null;
    this.ComisionEfectivo = null;
    this.PagarComisionDesde = null;
    this.ComisionRecaudo = null;
    this.Cambio = null;
    this.Giro = null;
    this.Traslado = null;
    this.CorresponsalBancario = null;
    this.ServicioExterno = null;
    this.Gasto = null;
    this.Transferencia = null;
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }

  CambioCheckbox(value)
  {
    console.log(value);
    value.checked = true;
    console.log("cambio checkbox");    
  } 

}