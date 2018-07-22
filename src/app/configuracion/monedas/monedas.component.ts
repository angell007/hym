import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { html } from 'd3';

@Component({
  selector: 'app-monedas',
  templateUrl: './monedas.component.html',
  styleUrls: ['./monedas.component.css']
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

  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('ModalEditarMoneda') ModalEditarMoneda:any;
  @ViewChild('ModalMoneda') ModalMoneda:any;
  @ViewChild('FormMoneda') FormMoneda:any;
  readonly ruta = 'http://hym.corvuslab.co/'; 
  constructor(private http : HttpClient) { }

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
      this.FormMoneda.reset();
      this.OcultarFormulario(this.ModalMoneda);
      this.OcultarFormulario(this.ModalEditarMoneda);
    }
  }

  ActualizarVista(){
    this.http.get(this.ruta+'php/monedas/lista_monedas.php').subscribe((data:any)=>{
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
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
      //console.log(data);      
      formulario.reset();
      this.ActualizarVista();
    });
  }

  EliminarMoneda(id){
    let datos=new FormData();
    datos.append("modulo", 'Moneda');
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    });    
  }

  EditarMoneda(id, modal){
    this.http.get(this.ruta+'php/genericos/detalle.php',{
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

  CambioCheckbox(value)
  {
    console.log(value);
    value.checked = true;
    console.log("cambio checkbox");    
  }

}
