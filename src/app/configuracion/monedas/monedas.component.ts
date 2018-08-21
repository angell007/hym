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

  public Monedas: any[];

  //variables de formulario
  public Nombre: any[];
  public Codigo: any[];
  public Orden: any[];
  public MaxVentaEfectivo: any[];
  public MinVentaEfectivo: any[];
  public MaxVentaCuenta: any[];
  public MinVentaCuenta: any[];
  public SugeridoVenta: any[];
  public SugeridoCompra: any[];
  public PrecioVentanilla: any[];
  public MaxCompra: any[];
  public MinCompra: any[];
  public MinNoCobro: any[];
  public RedondeoPesosEfectivo: any[];
  public RedondeoPesosCuenta: any[];
  public ComisionEfectivo: any[];
  public PagarComisionDesde: any[];
  public ComisionRecaudo: any[];
  public Cambio: boolean;
  public Giro: boolean;
  public Traslado: boolean;
  public CorresponsalBancario: boolean;
  public ServicioExterno: boolean;
  public Gasto: boolean;
  public Transferencia: boolean;
  public Identificacion: any[];

  public boolNombre: boolean = false;
  public boolCodigo: boolean = false;
  public boolOrden: boolean = false;
  public boolMaxVentaEfectivo: boolean = false;
  public boolMinVentaEfectivo: boolean = false;
  public boolMaxVentaCuenta: boolean = false;
  public boolMinVentaCuenta: boolean = false;
  public boolSugeridoVenta: boolean = false;
  public boolSugeridoCompra: boolean = false;
  public boolPrecioVentanilla: boolean = false;
  public boolMaxCompra: boolean = false;
  public boolMinCompra: boolean = false;
  public boolMinNoCobro: boolean = false;
  public boolRedondeoPesosEfectivo: boolean = false;
  public boolRedondeoPesosCuenta: boolean = false;
  public boolComisionEfectivo: boolean = false;
  public boolPagarComisionDesde: boolean = false;
  public boolComisionRecaudo: boolean = false;

  //Variables checkboxes
  public cambioVal: boolean;
  public cambioVal2: boolean;
  public cambioVal3: boolean;
  public cambioMod: number;
  public cambioMod3: number;
  public giroVal: boolean;
  public giroVal2: boolean;
  public giroVal3: boolean;
  public giroMod: number;
  public giroMod3: number;
  public trasladoVal: boolean;
  public trasladoVal2: boolean;
  public trasladoVal3: boolean;
  public trasladoMod: number;
  public trasladoMod3: number;
  public corresponsalBancarioVal: boolean;
  public corresponsalBancarioVal2: boolean;
  public corresponsalBancarioVal3: boolean;
  public corresponsalBancarioMod: number;
  public corresponsalBancarioMod3: number;
  public servicioExternoVal: boolean;
  public servicioExternoVal2: boolean;
  public servicioExternoVal3: boolean;
  public servicioExternoMod: number;
  public servicioExternoMod3: number;
  public gastoVal: boolean;
  public gastoVal2: boolean;
  public gastoVal3: boolean;
  public gastoMod: number;
  public gastoMod3: number;
  public transferenciaVal: boolean;
  public transferenciaVal2: boolean;
  public transferenciaVal3: boolean;
  public transferenciaMod: number;
  public transferenciaMod3: number;

  @ViewChild('nombre') nombreVal: any;
  @ViewChild('codigo') codigoVal: any;
  @ViewChild('orden') ordenVal: any;
  @ViewChild('maxVentaEfectivo') maxVentaEfectivoVal: any;
  @ViewChild('minVentaEfectivo') minVentaEfectivoVal: any;
  @ViewChild('maxVentaCuenta') maxVentaCuentaVal: any;
  @ViewChild('minVentaCuenta') minVentaCuentaVal: any;
  @ViewChild('sugeridoVenta') sugeridoVentaVal: any;
  @ViewChild('sugeridoCompra') sugeridoCompraVal: any;
  @ViewChild('precioVentanilla') precioVentanillaVal: any;
  @ViewChild('maxCompra') maxCompraVal: any;
  @ViewChild('minCompra') minCompraVal: any;
  @ViewChild('minNoCobro') minNoCobroVal: any;
  @ViewChild('redondeoPesosEfectivo') redondeoPesosEfectivoVal: any;
  @ViewChild('redondeoPesosCuenta') redondeoPesosCuentaVal: any;
  @ViewChild('comisionEfectivo') comisionEfectivoVal: any;
  @ViewChild('pagarComisionDesde') pagarComisionDesdeVal: any;
  @ViewChild('comisionRecaudo') comisionRecaudoVal: any;


  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('saveSwal') saveSwal: any;
  @ViewChild('ModalVerMoneda') ModalVerMoneda: any;
  @ViewChild('ModalEditarMoneda') ModalEditarMoneda: any;
  @ViewChild('ModalMoneda') ModalMoneda: any;
  @ViewChild('FormMoneda') FormMoneda: any;

  constructor(private http: HttpClient, private globales: Globales) { }

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

    this.cambioMod = 0;
    this.cambioMod3 = 0;
    this.giroMod = 0;
    this.giroMod3 = 0;
    this.trasladoMod = 0;
    this.trasladoMod3 = 0;
    this.corresponsalBancarioMod = 0;
    this.corresponsalBancarioMod3 = 0;
    this.servicioExternoMod = 0;
    this.servicioExternoMod3 = 0;
    this.gastoMod = 0;
    this.gastoMod3 = 0;
    this.transferenciaMod = 0;
    this.transferenciaMod3 = 0;
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.OcultarFormularios();
    }
  }

  OcultarFormularios() {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalMoneda);
    this.OcultarFormulario(this.ModalVerMoneda);
    this.OcultarFormulario(this.ModalEditarMoneda);
  }

  InicializarBool() {
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

    this.cambioVal = false;
    this.giroVal = false;
    this.trasladoVal = false;
    this.corresponsalBancarioVal = false;
    this.servicioExternoVal = false;
    this.gastoVal = false;
    this.transferenciaVal = false;
  }

  ActualizarVista() {
    this.http.get(this.globales.ruta + 'php/monedas/lista_monedas.php').subscribe((data: any) => {
      this.Monedas = data;
    });
  }

  GuardarMoneda(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    //formulario.ge
    let datos = new FormData();
    console.log(info);
    datos.append("modulo", 'Moneda');
    datos.append("datos", info);
    this.OcultarFormulario(modal);
    console.log(datos["datos"]);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        //console.log(data);      
        //formulario.reset();
        this.customReset(); //Necesario para corregir ciertos bugs con los checkboxes
        this.ActualizarVista();
        this.InicializarBool();
        this.saveSwal.show();
      });


  }

  customReset() {
    this.nombreVal.reset();
    this.codigoVal.reset();
    this.ordenVal.reset();
    this.maxVentaEfectivoVal = 0;
    this.minVentaEfectivoVal = 0;
    this.maxVentaCuentaVal = 0;
    this.minVentaCuentaVal = 0;
    this.sugeridoVentaVal = 0;
    this.sugeridoCompraVal = 0;
    this.precioVentanillaVal = 0;
    this.maxCompraVal = 0;
    this.minCompraVal = 0;
    this.minNoCobroVal = 0;
    this.redondeoPesosCuentaVal = 0;
    this.redondeoPesosEfectivoVal = 0;
    this.comisionEfectivoVal = 0;
    this.pagarComisionDesdeVal = 0;
    this.comisionRecaudoVal = 0;
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerMoneda(id, modal) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Moneda', id: id }
    }).subscribe((data: any) => {
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Codigo = data.Codigo;
      this.Orden = data.Orden;

      if (data.Cambio == 0) this.cambioVal2 = false;
      if (data.Cambio == 1) this.cambioVal2 = true;
      if (data.Giro == 0) this.giroVal2 = false;
      if (data.Giro == 1) this.giroVal2 = true;
      if (data.Traslado == 0) this.trasladoVal2 = false;
      if (data.Traslado == 1) this.trasladoVal2 = true;
      if (data.Corresponsal_Bancario == 0) this.corresponsalBancarioVal2 = false;
      if (data.Corresponsal_Bancario == 1) this.corresponsalBancarioVal2 = true;
      if (data.Servicio_Externo == 0) this.servicioExternoVal2 = false;
      if (data.Servicio_Externo == 1) this.servicioExternoVal2 = true;
      if (data.Gasto == 0) this.gastoVal2 = false;
      if (data.Gasto == 1) this.gastoVal2 = true;
      if (data.Transferencia == 0) this.transferenciaVal2 = false;
      if (data.Transferencia == 1) this.transferenciaVal2 = true;

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
      /*this.Cambio = data.Cambio;
      this.Giro = data.Giro;
      this.Traslado = data.Traslado;
      this.CorresponsalBancario = data.Corresponsal_Bancario;
      this.ServicioExterno = data.Servicio_Externo;
      this.Gasto = data.Gasto;
      this.Transferencia = data.Transferencia;*/

      modal.show();
    });
  }

  EliminarMoneda(id) {
    let datos = new FormData();
    datos.append("modulo", 'Moneda');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.ActualizarVista();
      this.deleteSwal.show();
    });
  }

  EditarMoneda(id, modal) {
    this.InicializarBool();
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Moneda', id: id }
    }).subscribe((data: any) => {
      console.log(data);
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Codigo = data.Codigo;
      this.Orden = data.Orden;

      if (data.Cambio == 0) this.cambioVal3 = false;
      if (data.Cambio == 1) this.cambioVal3 = true;
      if (data.Giro == 0) this.giroVal3 = false;
      if (data.Giro == 1) this.giroVal3 = true;
      if (data.Traslado == 0) this.trasladoVal3 = false;
      if (data.Traslado == 1) this.trasladoVal3 = true;
      if (data.Corresponsal_Bancario == 0) this.corresponsalBancarioVal3 = false;
      if (data.Corresponsal_Bancario == 1) this.corresponsalBancarioVal3 = true;
      if (data.Servicio_Externo == 0) this.servicioExternoVal3 = false;
      if (data.Servicio_Externo == 1) this.servicioExternoVal3 = true;
      if (data.Gasto == 0) this.gastoVal3 = false;
      if (data.Gasto == 1) this.gastoVal3 = true;
      if (data.Transferencia == 0) this.transferenciaVal3 = false;
      if (data.Transferencia == 1) this.transferenciaVal3 = true;

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
      /*
      this.Cambio = data.Cambio;
      this.Giro = data.Giro;
      this.Traslado = data.Traslado;
      this.CorresponsalBancario = data.Corresponsal_Bancario;
      this.ServicioExterno = data.Servicio_Externo;
      this.Gasto = data.Gasto;
      this.Transferencia = data.Transferencia;
      */

      modal.show();
    });
  }

  OcultarFormulario(modal) {
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

  Cerrar(modal) {
    this.OcultarFormulario(modal)
  }

  CambioCheckbox(value) {
    console.log(value);
    value.checked = true;
    console.log("cambio checkbox");
  }

}