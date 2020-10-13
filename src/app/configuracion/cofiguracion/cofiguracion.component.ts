import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NgbAccordionModule } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-cofiguracion',
  templateUrl: './cofiguracion.component.html',
  styleUrls: ['./cofiguracion.component.scss', '../../../style.scss']
})

export class CofiguracionComponent implements OnInit {

  public configuracion: any=[];
  public Monedas: any=[];
  public Funcionarios: any=[];
  public AtributosMonedas: { [email: string]: any; } = {};

  //variables del formulario configuracion

  public Identificacion: any;
  public NombreEmpresa: any = [];
  public NIT: any = [];
  public Telefono: any = [];
  public Celular: any = [];
  public Direccion: any = [];
  public Correo: any = [];
  public FestivosLegales: any = [];
  public ExtrasLegales: any = [];
  public LlegadasTarde: any = [];
  public HoraInicioDia: any = [];
  public HoraFinDia: any = [];
  public SalarioBase: any = [];
  public SubsidioTransporte: any = [];
  public HoraExtraDiurna: any = [];
  public HoraExtraNocturna: any = [];
  public HoraExtraDomingoDiurna: any = [];
  public HoraExtraDomingoNocturna: any = [];
  public RecargoDiurna: any = [];
  public RecargoNocturno: any = [];
  public RecargoDominicalDiurna: any = [];
  public RecargoDominicalNocturna: any = [];
  public HoraInicioNoche: any = [];
  public HoraFinNoche: any = [];
  public Festivos: any = [];
  public Libres: any = [];

  //variables del formulario moneda
  public MaxVentaEfectivo: any = [];
  public MinVentaEfectivo: any = [];
  public MaxVentaCuenta: any = [];
  public MinVentaCuenta: any = [];
  public SugeridoVenta: any = [];
  public SugeridoCompra: any = [];
  public PrecioVentanilla: any = [];
  public MaxCompra: any = [];
  public MinCompra: any = [];
  public MinNoCobro: any = [];
  public ComisionEfectivo: any = [];
  public PagarComisionDesde: any = [];
  public ComisionRecaudo: any = [];

  public MaxVentaEfectivoCheck: boolean;
  public MinVentaEfectivoCheck: boolean;
  public MaxVentaCuentaCheck: boolean;
  public MinVentaCuentaCheck: boolean;
  public SugeridoVentaCheck: boolean;
  public SugeridoCompraCheck: boolean;
  public PrecioVentanillaCheck: boolean;
  public MaxCompraCheck: boolean;
  public MinCompraCheck: boolean;
  public MinNoCobroCheck: boolean;
  public ComisionEfectivoCheck: boolean;
  public PagarComisionDesdeCheck: boolean;
  public ComisionRecaudoCheck: boolean;

  public MaxVentaEfectivoFuncionario: any = [];
  public MinVentaEfectivoFuncionario: any = [];
  public MaxVentaCuentaFuncionario: any = [];
  public MinVentaCuentaFuncionario: any = [];
  public SugeridoVentaFuncionario: any = [];
  public SugeridoCompraFuncionario: any = [];
  public PrecioVentanillaFuncionario: any = [];
  public MaxCompraFuncionario: any = [];
  public MinCompraFuncionario: any = [];
  public MinNoCobroFuncionario: any = [];
  public ComisionEfectivoFuncionario: any = [];
  public PagarComisionDesdeFuncionario: any = [];
  public ComisionRecaudoFuncionario: any = [];

  public boolNombre: boolean = false;
  public boolNit: boolean = false;
  public boolTelefono: boolean = false;
  public boolCelular: boolean = false;
  public boolCorreo: boolean = false;
  public boolFestivosLegales: boolean = false;
  public boolDireccion: boolean = false;
  public boolExtrasLegales: boolean = false;
  public boolLlegadasTarde: boolean = false;
  public boolHoraInicioDia: boolean = false;
  public boolHoraFinDia: boolean = false;
  public boolSalarioBase: boolean = false;
  public boolSubsidioTransporte: boolean = false;
  public boolHoraExtraDiurna: boolean = false;
  public boolHoraExtraNocturna: boolean = false;
  public boolHoraExtraDomingoDiurna: boolean = false;
  public boolHoraExtraDomingoNocturna: boolean = false;
  public boolRecargoDiurna: boolean = false;
  public boolRecargoNocturno: boolean = false;
  public boolRecargoDominicalDiurna: boolean = false;
  public boolRecargoDominicalNocturna: boolean = false;
  public boolHoraInicioNoche: boolean = false;
  public boolHoraFinNoche: boolean = false;
  public boolFestivos: boolean = false;
  public boolLibres: boolean = false;

  @ViewChild('acordeon') acordeon: NgbAccordionModule;
  @ViewChild('FormEditarConfiguracion') FormEditarConfiguracion: any;
  @ViewChild('saveSwal') saveSwal: any;
  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('confirmswal') confirmswal: any;

  public configuracionGeneral:any = {};

  public checkados = [];
  MonedaCampo= [];
  MonedaValor = [];
  public Switch:boolean;
  
  constructor(private http: HttpClient, private globales: Globales) { }


  ngOnInit() {
    
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Funcionario' } }).subscribe((data: any) => {
      this.Funcionarios = data;
    });
    this.http.get(this.globales.ruta + 'php/configuracion/lista_monedas.php', { params: { modulo: 'Moneda' } }).subscribe((data: any) => {
      this.Monedas = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda_Campo' } }).subscribe((data: any) => {
      this.MonedaCampo = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda_Valor' } }).subscribe((data: any) => {
      this.MonedaValor = data;
    });

    this.EditarConfiguracion();
  }


  InicializarBool() {
    this.boolNombre = false;
    this.boolNit = false;
    this.boolTelefono = false;
    this.boolCelular = false;
    this.boolCorreo = false;
    this.boolFestivosLegales = false;
    this.boolDireccion = false;
    this.boolExtrasLegales = false;
    this.boolLlegadasTarde = false;
    this.boolHoraInicioDia = false;
    this.boolHoraFinDia = false;
    this.boolSalarioBase = false;
    this.boolSubsidioTransporte = false;
    this.boolHoraExtraDiurna = false;
    this.boolHoraExtraNocturna = false;
    this.boolHoraExtraDomingoDiurna = false;
    this.boolHoraExtraDomingoNocturna = false;
    this.boolRecargoDiurna = false;
    this.boolRecargoNocturno = false;
    this.boolRecargoDominicalDiurna = false;
    this.boolRecargoDominicalNocturna = false;
    this.boolHoraInicioNoche = false;
    this.boolHoraFinNoche = false;
    this.boolFestivos = false;
    this.boolLibres = false;
  }

  GuardarConfiguracion(formulario: NgForm) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Configuracion');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        //formulario.reset();    
        //this.EditarConfiguracion();
        this.InicializarBool();
        this.saveSwal.show();
      });
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  EditarConfiguracion() {
    this.InicializarBool();
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Configuracion', id: '1' }
    }).subscribe((data: any) => {
      // console.log(data);
      
      this.Identificacion = '1';
      this.configuracionGeneral = data;
    });
  }

  HabilitarFuncionario(i,j,pos){
    var checkeado = ((document.getElementById("Diario_" + i + "_" + j) as HTMLInputElement).checked);

    switch(checkeado){
      case true:{
       (document.getElementById("Identificacion_funcionario_" + i + "_" + j) as HTMLInputElement).disabled = false;
       this.MonedaValor[(pos-1)].Diario = 1;
        break;
      }
      case false:{
        (document.getElementById("Identificacion_funcionario_" + i + "_" + j) as HTMLInputElement).disabled = true;
        this.MonedaValor[(pos-1)].Identificacion_Funcionario = null;
        this.MonedaValor[(pos-1)].Diario = 0;
        break;
      }
    }
  }

  asignarFuncionario(id, funcionario){
    this.MonedaValor[(id-1)].Identificacion_Funcionario = funcionario;
    this.MonedaValor[(id-1)].Diario = 1;
  }

  GuardarMoneda(pos, moneda) {

    let info = JSON.stringify(this.MonedaValor)
    let datos = new FormData();
    datos.append("modulo", 'Moneda_Funcionario');
    datos.append("datos", info);

    this.http.post(this.globales.ruta + '/php/configuracion/guardar_moneda.php', datos).subscribe((data: any) => {
      this.confirmswal.title = "Configuración de monedas";
      this.confirmswal.text = "La información ha sido guardada correctamente";
      this.confirmswal.type = "success";
      this.confirmswal.show();
    });
  }

  EditarMoneda(id) {
    this.ResetFormulario();
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Moneda', id: id }
    }).subscribe((data: any) => {
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
      this.ComisionEfectivo = data.Comision_Efectivo;
      this.PagarComisionDesde = data.Pagar_Comision_Desde;
      this.ComisionRecaudo = data.Comision_Recaudo;
    });

  }

  ResetFormulario() {
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
    this.ComisionEfectivo = null;
    this.PagarComisionDesde = null;
    this.ComisionRecaudo = null;
    this.MaxVentaEfectivoCheck = null;
    this.MaxVentaEfectivoFuncionario = null;
    this.MinVentaEfectivoCheck = null;
    this.MinVentaEfectivoFuncionario = null;
    this.MaxVentaCuentaCheck = null;
    this.MaxVentaCuentaFuncionario = null;
    this.MinVentaCuentaCheck = null;
    this.MinVentaCuentaFuncionario = null;
    this.MaxCompraCheck = null;
    this.MaxCompraFuncionario = null;
    this.MinCompraCheck = null;
    this.MinCompraFuncionario = null;
    this.SugeridoVentaCheck = null;
    this.SugeridoVentaFuncionario = null;
    this.SugeridoCompraCheck = null;
    this.SugeridoCompraFuncionario = null;
    this.PrecioVentanillaCheck = null;
    this.PrecioVentanillaFuncionario = null;
    this.MinNoCobroCheck = null;
    this.MinNoCobroFuncionario = null;
    this.ComisionRecaudoCheck = null;
    this.ComisionRecaudoFuncionario = null;
    this.ComisionEfectivoCheck = null;
    this.ComisionEfectivoFuncionario = null;
    this.PagarComisionDesdeCheck = null;
    this.PagarComisionDesdeFuncionario = null;
  }

}
