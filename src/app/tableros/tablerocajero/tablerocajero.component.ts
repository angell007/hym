import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { NgForm, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { isEmpty } from 'rxjs/operator/isEmpty';

@Component({
  selector: 'app-tablerocajero',
  templateUrl: './tablerocajero.component.html',
  styleUrls: ['./tablerocajero.component.scss']
})
export class TablerocajeroComponent implements OnInit {
  public IdentificacionFuncionario: any = [];
  public Destinatarios: any = [] = [];
  public Remitentes: any = [] = [];
  public Paises: any = [] = [];
  public Bancos: any = [] = [];
  public TipoCuentas: any = [] = [];
  public Clientes: any = [] = [];
  public DestinatariosFiltrados: any = [] = [];
  public RemitentesFiltrados: any = [] = [];
  public DatosRemitente: any = [] = [];
  public Funcionarios: any = [] = [];
  public ServiciosExternos: any = [] = [];
  public CorresponsalesBancarios: any = [] = [];
  public Documentos: any = [];
  public Cuentas: any = [] = [{
    Id_Destinatario: '',
    Id_Pais: "",
    Id_Banco: '',
    Numero_Cuenta: '',
    Id_Tipo_Cuenta: ''
  }];

  public Envios: any = [] = [{
    Destino: '',
    Numero_Documento_Destino: '',
    Nombre: '',
    Id_Destinatario_Cuenta: '',
    Valor_Transferencia_Bolivar: '',
    Valor_Transferencia_Peso: '',
    Cuentas: [],
    esconder: false,
    disabled: false
  }];
  public CuentasDestinatario: any = [];
  public Cajas: any = [];
  public Cambios: any = [];
  public Monedas: any = [];
  public Recibe: any = "Transferencia";
  public MonedaRecibe: any = "Bolivares";
  public IdCorresponsal: number;
  public IdOficina: number;
  public IdCaja:string = JSON.parse(localStorage['Caja']);
  public Estado: string;
  public DetalleCorresponsal: string;
  public Detalle: any = [];
  public Indice: any = [];

  public MonedaRecibida: any;
  public Cedula: any = [];
  public IdRemitente: any = [];
  public FormaPago: string;
  public Costo: number;
  public PrecioSugeridoEfectivo: any;
  public CantidadRecibida: number;
  public CantidadTransferida: number;
  public ValorTotal: number;
  public ValorEntrega: number;
  public ValorCorresponsal: number;
  public CorresponsalBancario: number;
  public ComisionServicioExterno: number;
  public Comision: number = 0;
  public NumeroDocumentoR: number = 0;

  //Bool validaciones
  public boolFormaPago: boolean = false;
  public boolRecibePara: boolean = false;
  public boolSeleccioneCliente: boolean = false;
  public boolNumeroDocumento: boolean = false;

  //Valores por defecto
  formaPagoDefault: string = "Efectivo";
  recibeParaDefault: string = "Transferencia";
  seleccioneClienteDefault: string = "";
  //numeroDocumentoDefault: string = "";

  @ViewChild('ModalDestinatario') ModalDestinatario: any;
  @ViewChild('ModalRemitente') ModalRemitente: any;
  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('warnSwal') warnSwal: any;
  @ViewChild('warnTotalSwal') warnTotalSwal: any;
  @ViewChild('destinatarioCreadoSwal') destinatarioCreadoSwal: any;
  @ViewChild('remitenteCreadoSwal') remitenteCreadoSwal: any;
  @ViewChild('bancoNoIdentificadoSwal') bancoNoIdentificadoSwal: any;
  @ViewChild('transferenciaExitosaSwal') transferenciaExitosaSwal: any;
  @ViewChild('movimientoExitosoSwal') movimientoExitosoSwal: any;
  @ViewChild('ModalHistorial') ModalHistorial: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('ModalTrasladoEditar') ModalTrasladoEditar: any;
  @ViewChild('ModalServicioEditar') ModalServicioEditar: any;
  @ViewChild('ModalGiroEditar') ModalGiroEditar: any;
  @ViewChild('ModalEditarDestinatario') ModalEditarDestinatario: any;
  @ViewChild('ModalCrearDestinatarioTransferencia') ModalCrearDestinatarioTransferencia: any;
  @ViewChild('ModalAnularTransferencia') ModalAnularTransferencia: any;

  @ViewChild('FormMoneda') FormMoneda: any;
  @ViewChild('FormTransferencia') FormTransferencia: any;
  @ViewChild('FormGiro') FormGiro: any;
  @ViewChild('FormTraslado') FormTraslado: any;
  @ViewChild('FormCorresponsal') FormCorresponsal: any;
  @ViewChild('FormServicio') FormServicio: any;
  @ViewChild('ModalVerRecibo') ModalVerRecibo: any;
  @ViewChild('ModalSaldoInicio') ModalSaldoInicio: any;
  @ViewChild('ModalVerCambio') ModalVerCambio: any;
  @ViewChild('ModalAprobarGiro') ModalAprobarGiro: any;
  @ViewChild('confirmacionGiro') confirmacionGiro: any;

  //SWEET ALERT FOR GENERAL ALERTS
  @ViewChild('alertSwal') alertSwal: any;
  @ViewChild("valorCambio") inputValorCambio: ElementRef;

  vueltos: number;
  Venta = false;
  TextoBoton = "Vender";
  entregar: any;
  cambiar:any;
  MonedaOrigen: any;
  MonedaDestino: any = "Pesos";
  Tipo: string;
  Cambios1 = true;
  Cambios2 = false
  Transferencia = [];
  Transferencia1 = true;
  Transferencia2 = false;
  Traslado1 = true;
  Traslado2 = false;
  LimiteOficina: any;
  public MonedaTransferencia: any;
  MonedaTasaCambio: boolean;
  MonedaComision: boolean;
  PrecioSugeridoTransferencia: any;
  Historial = false;
  HistorialCliente = [];
  Giro1 = true;
  Giro2 = false;



  Giros = [];
  Departamentos = [];
  Municipios_Remitente = [];
  Municipios_Destinatario = [];
  GiroComision = [];
  ValorEnviar: any;
  Departamento_Remitente: any;
  Departamento_Destinatario: any;
  FuncionariosCaja = [];
  Funcionario: any;
  Traslados = [];
  idTraslado: any;
  Traslado:any = {};
  TrasladosRecibidos = [];
  ServicioComision = [];
  ValorComisionServicio: any;
  Servicio2 = false;
  Servicio1 = true;
  Servicios = [];
  Servicio:any = {};
  Giro:any = {};
  idGiro: any;
  Remitente:any = {};
  Destinatario:any = {};
  Tercero = [];
  CuentaBancaria = [];
  defectoDestino: string;
  defectoOrigen: string;
  MaxEfectivo:number = 0;
  MinEfectivo:number = 0;
  MaxCompra:number = 0;
  MinCompra:number = 0;
  PrecioSugeridoEfectivo1: any;
  MonedaRecibidaTransferencia: number;
  maximoTransferencia: any;
  minimoTransferencia: any;
  ActivarEdicion = false;
  Detalle_Destinatario:any = {};
  Lista_Destinatarios = [{
    Id_Pais: '2',
    Id_Banco: '',
    Bancos: [],
    Id_Tipo_Cuenta: '',
    Numero_Cuenta: '',
    Otra_Cuenta: '',
    Observacion: ''
  }];
  Identificacion: any;
  TipoDocumentoExtranjero = [];
  posiciontemporal: any;
  credito = false;
  consignacion = false;
  efectivo = true;
  Id_Destinatario: any;
  frame = false;
  urlCne: string;
  botonDestinatario = false;
  idTransferencia: any;
  frameRiff = false;
  urlRiff: string;
  DestinatarioCuenta = [];
  PrecioSugeridoCompra: any;
  IdentificacionCrearDestinatario: any;
  EncabezadoRecibo = [];
  DestinatarioRecibo = [];

  MontoInicial: any = 0;
  CierreCajaAyer: any = 0;
  IdDiario: any;
  verCambio:any = {};
  currencyOrigen: any;
  currencyDestino: any;
  cupoTercero: any;
  SaldoBolivar: any;
  tasaCambiaria: any;

  //NUEVAS VARIABLES

  //--------------------------------GENERALES-----------------------------//
  
  public funcionario_data = JSON.parse(localStorage['User']);

  //----------------------------------------------------------------------//


  //-----------------------------DATOS CAMBIOS-----------------------------//

  //MODELO CAMBIOS
  public CambioModel:any = {
    Id_Cambio: '',
    Tipo: '',
    Id_Caja:  this.IdCaja == '' ? '0' : this.IdCaja,
    Id_Oficina: '5',
    Moneda_Origen: '',
    Moneda_Destino: '',
    Tasa: '',
    Valor_Origen: '',
    Valor_Destino: '',
    TotalPago: '',
    Vueltos:'0',
    Recibido:'',
    Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario
  };

  public MonedaParaCambio:any = {
    id: '',
    nombre: '',
    Valores:{
      Min_Venta_Efectivo:'0',
      Max_Venta_Efectivo:'0',
      Sugerido_Venta_Efectivo:'',
      Min_Compra_Efectivo:'0',
      Max_Compra_Efectivo:'0',
      Sugerido_Compra_Efectivo:'',
      Min_Venta_Transferencia:'',
      Max_Venta_Transferencia:'',
      Sugerido_Venta_Transferencia:'',
      Costo_Transferencia:'',
      Comision_Efectivo_Transferencia:'',
      Pagar_Comision_Desde:'',
      Min_No_Cobro_Transferencia:'',
    }
  };
  
  public Bolsa_Restante = '0';
  public HabilitarCampos:boolean = true;
  public TotalPagoCambio:any = '';
  public NombreMonedaTasaCambio:string = '';
  public MonedasCambio:any = [];
  public TextoMensajeGuardar:string = 'compra';

  //----------------------------------------------------------------------//



  //-------------------------DATOS TRANSFERENCIAS-------------------------//

  public MonedaParaTransferencia:any = {
    id: '',
    nombre: '',
    Valores:{
      Min_Venta_Efectivo:'',
      Max_Venta_Efectivo:'',
      Sugerido_Venta_Efectivo:'',
      Min_Compra_Efectivo:'',
      Max_Compra_Efectivo:'',
      Sugerido_Compra_Efectivo:'',
      Min_Venta_Transferencia:'',
      Max_Venta_Transferencia:'',
      Sugerido_Venta_Transferencia:'',
      Costo_Transferencia:'',
      Comision_Efectivo_Transferencia:'',
      Pagar_Comision_Desde:'',
      Min_No_Cobro_Transferencia:'',
    }
  };

  public id_remitente:any = '';
  public id_destinatario_transferencia:any = '';
  public tercero_credito:any = '';
  public CuentasPersonales:any = [];
  public ShowClienteSelect:boolean = false;
  public OpcionesTipo:any = ['Transferencia', 'Cliente'];
  public InputBolsaBolivares:boolean = false;
  public MonedasTransferencia:any = [];

  public ControlVisibilidadTransferencia:any = {
    DatosCambio: true,
    Destinatarios: true,
    DatosRemitente: true,
    DatosCredito: false,
    DatosConsignacion: false,
    SelectCliente: false
  };

  //MODELO PARA TRANSFERENCIAS
  public TransferenciaModel:any = {
    Forma_Pago: 'Efectivo',
    Tipo_Transferencia: 'Transferencia',   

    //DATOS DEL CAMBIO
    Moneda_Origen: '2',
    Moneda_Destino: '',
    Cantidad_Recibida: '',
    Cantidad_Transferida: '',
    Tasa_Cambio: '',
    Identificacion_Funcionario: '',
    Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
    Observacion_Transferencia:'',

    //DESTINATARIOS
    Destinatarios: [
      {
        id_destinatario_transferencia: '',
        Numero_Documento_Destino: '',
        Nombre_Destinatario: '',
        Id_Destinatario_Cuenta: '',
        Valor_Transferencia: '',
        Cuentas: [],
        EditarVisible: false
      }
    ], 

    //DATOS REMITENTE
    Documento_Origen: '',
    Nombre_Remitente: '',
    Telefono_Remitente: '',

    //DATOS CREDITO
    Id_Tercero: '',
    Cupo_Tercero: 0,
    Bolsa_Bolivares: 0,

    //DATOS CONSIGNACION
    Id_Cuenta_Bancaria: '',

    //DATOS PARA TRANSFERENCIAS DIRECTO A UN CLIENTE(TERCERO)
    Id_Tercero_Destino: ''
  };


  //--------------------------------------------------------------------------//

  //-------------------------DATOS GIROS-------------------------//
  //MODELO PARA GIROS
  public GiroModel:any = {
    
    //REMITENTE
    Departamento_Remitente: '',
    Municipio_Remitente: '',
    Documento_Remitente: '',
    Nombre_Remitente: '',
    Telefono_Remitente: '',
  
    //DESTINATARIO
    Departamento_Destinatario: '',
    Municipio_Destinatario: '',
    Documento_Destinatario: '',
    Nombre_Destinatario: '',
    Telefono_Destinatario: '',    

    //DATOS GIRO
    Valor_Recibido: '',
    Comision: '',
    Valor_Total: '',
    Valor_Entrega: '',
    Detalle: '',
    Giro_Libre: false,
    Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
    Id_Oficina: 5,
    Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja
  };

  //VARIABLES GIRO VIEJAS
  GirosBuscar = [];
  public Aparecer = false;

  DatosRemitenteEditarGiro:any = {};
  DatosDestinatario:any = {};
  DatosDestinatarioEditarGiro:any = {};
  informacionGiro:any = {};
  ValorTotalGiro: any;
  //FIN VARIABLES VIEJAS

  public Remitente_Giro:any = '';
  public Destinatario_Giro:any = '';

  //--------------------------------------------------------------------------//


  //--------------------------------DATOS TRASLADOS---------------------------//
  //MODELO TRASLADOS
  public TrasladoModel:any = {
    Id_Traslado_Caja: '',
    Funcionario_Destino: '',
    Id_Cajero_Origen: this.funcionario_data.Identificacion_Funcionario,
    Valor: '',
    Detalle: '',
    Id_Moneda: '',
    Estado: 'Activo',
    Identificacion_Funcionario: '',
    Aprobado: 'No'
  };

  public CajerosTraslados:any = [];
  public MonedasTraslados:any = [];
  public MonedaSeleccionadaTraslado:string = '';

  public TrasladosEnviados:any = [];
  public TrasladoRecibidos:any = [];

  //--------------------------------------------------------------------------//

  //-----------------------------DATOS CORRESPONSALES-------------------------//
  //MODELO CORRESPONSAL
  public CorresponsalModel:any = {
    Id_Corresponsal_Diario: '',
    Id_Corresponsal_Bancario: '',
    Detalle: '',
    Valor: '',
    Fecha: '',
    Hora: '',
    Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario
  };

  public CorresponsalesBancos:any = [];

  //--------------------------------------------------------------------------//

  //------------------------DATOS SERVICIOS EXTERNOS-------------------------//
  //MODELO SERVICIOS
  public ServicioExternoModel:any = {
    Id_Servicio: '',
    Servicio_Externo: '',
    Comision: '',
    Valor: '',
    Detalle: '',
    Estado: 'Activo',
    Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
    Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja
  };

  public ListaServiciosExternos:any = [];
  public ComisionServicio:any = [];

  //--------------------------------------------------------------------------//

  //Fin nuevas variables

  constructor(private http: HttpClient, private globales: Globales, public sanitizer: DomSanitizer) { }
  CierreCajaAyerBolivares = 0;
  MontoInicialBolivar = 0;

  GirosAprobados = [];

  public boolId:boolean = false;
  public boolNombre:boolean = false;
  public boolIdR:boolean = false;
  public boolNombreR:boolean = false;
  public boolTelefonoR:boolean = false;

  ngOnInit() {

    this.actualizarVista();
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    this.IdOficina = JSON.parse(localStorage['Oficina']);
    //this.IdCaja = JSON.parse(localStorage['Caja']);
    //this.Costo = 1;
    this.Estado = "Enviado";
    this.FormaPago = "Efectivo";
    this.MonedaRecibidaTransferencia = 2;
    this.Bancos_Pais(2, 0);
    this.bancosDestinatarios();

    setTimeout(() => {
      this.CargarDatosCambios();
      this.CargarDatosTraslados();
      this.CargarDatosServicios();
      this.AsignarMonedas();
      this.AsignarPaises();
      this.AsignarCuentasPersonales();      
    }, 500);
    

    //hacer la peticion si este usuario tiene un 'diario' ya registrado en la DB y si el saldo de inicio es vacio

    this.http.get(this.globales.ruta + 'php/diario/detalle_diario.php', { params: { id: this.IdentificacionFuncionario } }).subscribe((data: any) => {

      if (data.hoy[0]) {
        this.MontoInicial = data.hoy[0].MontoInicial;
        this.MontoInicialBolivar = data.hoy[0].MontoInicialBolivar;
        this.IdDiario = data.hoy[0].Diario;

        if (data.hoy[0].MontoInicial == "0" && data.hoy[0].MontoInicialBolivar == "0") {
          this.ModalSaldoInicio.show();
        }
      }

      if (data.ayer[0]) {
        this.CierreCajaAyer = data.ayer[0].MontoCierre;
        this.CierreCajaAyerBolivares = data.ayer[0].MontoCierreBolivar
      }


    });
  }

  //CAMBIOS EFECTIVO

  SetMonedaCambio(value){
    this.MonedaParaCambio.id = value;
    //this.MonedaParaCambio.Moneda_Destino = value;

    if(value != ''){
      let c = this.MonedasCambio.find(x =>  x.Id_Moneda == value);
      this.MonedaParaCambio.nombre = c.Nombre;

      this.http.get(this.globales.ruta+'php/monedas/buscar_valores_moneda.php', { params: {id_moneda:value} }).subscribe((data:any) => {
        this.MonedaParaCambio.Valores = data;

        if (this.Venta) {
          
          this.CambioModel.Tasa = data.Sugerido_Venta_Efectivo;
          this.CambioModel.Moneda_Origen = '2';
          this.CambioModel.Moneda_Destino = value;
        } else {         
          this.CambioModel.Tasa = data.Sugerido_Compra_Efectivo;
          this.CambioModel.Moneda_Origen = value;
          this.CambioModel.Moneda_Destino = '2';
        }

        this.HabilitarCamposCambio();
      });
    }else{
      if (this.Venta) {          
        this.CambioModel.Moneda_Origen = '2';
        this.CambioModel.Moneda_Destino = value;
      } else {         
        this.CambioModel.Moneda_Origen = value;
        this.CambioModel.Moneda_Destino = '2';
      }

      this.MonedaParaCambio.nombre = '';
      this.CambioModel.Tasa = '';
      this.ResetMonedaParaCambio();      
      this.HabilitarCamposCambio();
    }

    console.log(this.CambioModel);    
  }

  ResetMonedaParaCambio(){
    this.MonedaParaCambio = {
      id: '',
      nombre: '',
      Valores:{
        Min_Venta_Efectivo:'0',
        Max_Venta_Efectivo:'0',
        Sugerido_Venta_Efectivo:'',
        Min_Compra_Efectivo:'0',
        Max_Compra_Efectivo:'0',
        Sugerido_Compra_Efectivo:'',
        Min_Venta_Transferencia:'',
        Max_Venta_Transferencia:'',
        Sugerido_Venta_Transferencia:'',
        Costo_Transferencia:'',
        Comision_Efectivo_Transferencia:'',
        Pagar_Comision_Desde:'',
        Min_No_Cobro_Transferencia:'',
      }
    };
  }

  guardarCambio(formulario: NgForm, item) {

    if (this.ValidateCambioBeforeSubmit()) {
        
      if(this.ValidacionTasaCambio()){

      
        /*formulario.value.Moneda_Destino = this.MonedaDestino;
        formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;*/
        
        //let info = JSON.stringify(formulario.value);
        if (this.Venta) {
          this.CambioModel.Tipo = 'Venta';
          this.CambioModel.Estado = 'Realizado';
        }else{
          this.CambioModel.Tipo = 'Compra';
          this.CambioModel.Recibido = '0';
          this.CambioModel.Estado = 'Realizado';
        }
        let info = JSON.stringify(this.CambioModel);
        let datos = new FormData();
        datos.append("modulo", 'Cambio');
        datos.append("datos", info);
        datos.append("PagoTotal", this.TotalPagoCambio);
  
        this.http.post(this.globales.ruta + '/php/pos/guardar_cambio.php', datos).subscribe((data: any) => {
          //formulario.reset();
          this.LimpiarModeloCambio();
          this.confirmacionSwal.title = "Guardado con exito";
          this.confirmacionSwal.text = "Se ha guardado correctamente la " + item
          this.confirmacionSwal.type = "success"
          this.confirmacionSwal.show();
          this.Cambios1 = true;
          this.Cambios2 = false;
          this.tasaCambiaria = "";
          this.entregar = "";
          this.MonedaDestino = "Pesos";
          this.actualizarVista();
        });
      }
    }        
  }

  ObtenerVueltos() {

    let pagoCon = this.CambioModel.Recibido;
    let recibido = this.CambioModel.Valor_Origen;

    if (recibido == '' || recibido == undefined || isNaN(recibido)) {
      
      this.ShowSwal('warning', 'Alerta', 'Debe colocar primero el valor a cambiar!');
      this.CambioModel.Recibido = '';
      return;
    }

    if (pagoCon == '' || pagoCon == undefined || isNaN(pagoCon)) {
      
      this.ShowSwal('warning', 'alerta', 'El valor del campo "Pago Con" debe ser un valor numerico!');
      return;
    }    

    recibido = parseFloat(recibido);
    pagoCon = parseFloat(pagoCon);
    
    if (pagoCon > 0) {

      if (pagoCon < recibido) {
        this.ShowSwal('warning', 'alerta', 'El valor a cambiar no puede ser mayor al valor recibido!');
        this.CambioModel.Recibido = '';
        return;
      }else{
        let vuelto = pagoCon - recibido;
        this.CambioModel.TotalPago = pagoCon;
        this.CambioModel.Vueltos = vuelto;
      }
    }

    /*if (parseInt(valor) > 0) {
      (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = false;
      var plata = ((document.getElementById("Cambia") as HTMLInputElement).value);
      
      this.vueltos = valor - parseInt(this.cambiar);
      if (this.vueltos < 0) {
        (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = true;
        (document.getElementById("pagocon") as HTMLInputElement).value = "0";
        this.vueltos = 0;
        this.confirmacionSwal.title = "Problemas Cambio";
        this.confirmacionSwal.text = "El dinero Recibido es inferior a lo que va a cambiar";
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();
      }
    }*/
  }

  validarDestino(value) {
    /*if (value != "") {
      this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda' } }).subscribe((data: any) => {
        this.MonedaOrigenDestino = data;
        var index = this.MonedaOrigenDestino.findIndex(x => x.Id_Moneda === value);
        if (index > -1) {
          this.MonedaOrigenDestino.splice(index, 1);
        }
      });
    } else {
      this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda' } }).subscribe((data: any) => {
        this.MonedaOrigenDestino = data;
      });
    }*/

    this.validarTasaCambio(value);
    this.HabilitarCamposCambio();

  }

  validarTasaCambio(value) {

    this.http.get(this.globales.ruta + 'php/pos/buscar_tasa.php', {
      params: { id: value }
    }).subscribe((data: any) => {
      
      if(!this.globales.IsObjEmpty(data)){
        
        this.MaxEfectivo = parseInt(data.Dependencia[0].Valor);
        this.MinEfectivo = parseInt(data.Dependencia[1].Valor);
        this.PrecioSugeridoEfectivo = data.Dependencia[2].Valor;

        this.MaxCompra = parseInt(data.Dependencia[3].Valor);
        this.MinCompra = parseInt(data.Dependencia[4].Valor);
        this.PrecioSugeridoCompra = data.Dependencia[5].Valor;

        this.maximoTransferencia = data.Dependencia[6].Valor;
        this.minimoTransferencia = data.Dependencia[7].Valor;
        this.PrecioSugeridoTransferencia = data.Dependencia[8].Valor;

        if (this.Venta == true) {
          this.tasaCambiaria = parseInt(this.PrecioSugeridoEfectivo);
          this.MonedaOrigen = "Pesos";
          this.MonedaDestino = data.Moneda[0].Nombre;
          this.NombreMonedaTasaCambio = this.MonedaDestino;
        } else {
          this.tasaCambiaria = this.PrecioSugeridoCompra;
          var index = this.MonedaOrigenCambio.findIndex(x => x.Id_Moneda === value);
          this.MonedaOrigen = this.MonedaOrigenCambio[index].Nombre;
          this.NombreMonedaTasaCambio = this.MonedaOrigen;
        }
      }else{

        if (this.Venta == true) {
          
          this.MonedaOrigen = 'Pesos';
          this.MonedaDestino = '';
        } else {

          this.MonedaOrigen = '';
          this.MonedaDestino = 'Pesos';
        }
        
        this.tasaCambiaria = undefined;
        this.cambiar = undefined;
        this.entregar = undefined;
        this.MinCompra = 0;
        this.MaxCompra = 0;
        this.MinEfectivo = 0;
        this.MaxEfectivo = 0;
        this.NombreMonedaTasaCambio = '';
      }           
      
    this.HabilitarCamposCambio();
    });
  }

  conversionMoneda() {
    
    if(this.ValidacionTasaCambio()){

      if (this.Venta == false) {
        
        var cambio = parseFloat(this.CambioModel.Valor_Origen) * parseFloat(this.CambioModel.Tasa);
        this.CambioModel.Valor_Destino = cambio;
        //(document.getElementById("BotonEnviar") as HTMLInputElement).disabled = false;
      } else {

        var cambio = parseFloat(this.CambioModel.Valor_Origen) / parseFloat(this.CambioModel.Tasa);
        this.CambioModel.Valor_Destino = cambio.toFixed(2);
      }
    }
  }

  ValidacionTasaCambio(){
    if(this.CambioModel.Valor_Origen == '' || this.CambioModel.Valor_Origen == 0 || this.CambioModel.Valor_Origen === undefined){

      this.ShowSwal('warning', 'Alerta', 'Debe colocar el valor a cambiar!');
      this.CambioModel.Tasa = '';
      this.CambioModel.Valor_Destino = '';
      return false;
    }else{

      if(this.CambioModel.Tasa == '' || this.CambioModel.Tasa == 0 || this.CambioModel.Tasa === undefined){
      
        this.ShowSwal('warning', 'Tasa incorrecta', 'No se ha establecido una tasa de cambio!');
        this.CambioModel.Tasa = '';
        this.CambioModel.Valor_Destino = '';
        return false;

      }else{

        let tasa = parseFloat(this.CambioModel.Tasa);

        if(this.Venta){
          if(tasa > parseFloat(this.MonedaParaCambio.Valores.Max_Venta_Efectivo) || tasa < parseFloat(this.MonedaParaCambio.Valores.Min_Venta_Efectivo) ){
            this.ShowSwal('warning', 'Tasa Incorrecta', 'La tasa de cambio indicada es inferior/superior a los límites establecidos.\nRevise nuevamente.');
            this.CambioModel.Tasa = (parseFloat(this.MonedaParaCambio.Valores.Max_Venta_Efectivo) + parseFloat(this.MonedaParaCambio.Valores.Min_Venta_Efectivo)) / 2;
            this.CambioModel.Valor_Destino = '';
            return false;
          }
        }else{
          if(tasa > parseFloat(this.MonedaParaCambio.Valores.Max_Compra_Efectivo) || tasa < parseFloat(this.MonedaParaCambio.Valores.Min_Compra_Efectivo) ){
            this.ShowSwal('warning', 'Tasa Incorrecta', 'La tasa de cambio indicada es inferior/superior a los límites establecidos.\nRevise nuevamente.');
            this.CambioModel.Tasa = (parseFloat(this.MonedaParaCambio.Valores.Max_Compra_Efectivo) + parseFloat(this.MonedaParaCambio.Valores.Min_Compra_Efectivo)) / 2;
            this.CambioModel.Valor_Destino = '';
            return false;
          }
        }
        
      }
    }
    
    return true;
  }

  AnulaCambio(id) {
    let datos = new FormData();
    datos.append("id", id);
    this.http.post(this.globales.ruta + '/php/cambio/anular_cambio.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = "Cambio Anulado";
      this.confirmacionSwal.text = "Se ha anulado el cambio seleccionado"
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();
      this.actualizarVista();

    });

  }


  tituloCambio = "Compras o Ventas";
  VerCambio(id, modal) {

    this.http.get(this.globales.ruta + '/php/genericos/detalle.php', { params: { id: id, modulo: "Cambio" } }).subscribe((data: any) => {
      this.verCambio = data;

      if (data.Moneda_Origen == "Bolivares") {
        this.currencyOrigen = "BsS.";
      }
      if (data.Moneda_Origen == "Pesos") {
        this.currencyOrigen = "$";
      }

      if (data.Moneda_Destino == "Bolivares") {
        this.currencyDestino = "BsS.";
      }

      if (data.Moneda_Destino == "Pesos") {
        this.currencyDestino = "$";
      }
      modal.show();
    });

  }

  HabilitarCamposCambio(){

    if(this.Venta){
      
      if(this.CambioModel.Moneda_Destino == '' || this.CambioModel.Moneda_Destino == undefined){
        this.HabilitarCampos = true;
      }else{
        this.HabilitarCampos = false;
      }

    }else{
      
      if(this.CambioModel.Moneda_Origen == '' || this.CambioModel.Moneda_Origen == undefined){
        this.HabilitarCampos = true;
      }else{        
        this.HabilitarCampos = false;
      }
    }
  }

  LimpiarModeloCambio(){
    this.CambioModel = {
      Id_Cambio: '',
      Tipo: '',
      Id_Caja:  this.IdCaja == '' ? '0' : this.IdCaja,
      Id_Oficina: '5',
      Moneda_Origen: '',
      Moneda_Destino: '',
      Tasa: '',
      Valor_Origen: '',
      Valor_Destino: '',
      TotalPago: '',
      Vueltos:'0',
      Recibido:'',
      Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario
    };
  
    this.MonedaParaCambio = {
      id: '',
      nombre: '',
      Valores:{
        Min_Venta_Efectivo:'0',
        Max_Venta_Efectivo:'0',
        Sugerido_Venta_Efectivo:'',
        Min_Compra_Efectivo:'0',
        Max_Compra_Efectivo:'0',
        Sugerido_Compra_Efectivo:'',
        Min_Venta_Transferencia:'',
        Max_Venta_Transferencia:'',
        Sugerido_Venta_Transferencia:'',
        Costo_Transferencia:'',
        Comision_Efectivo_Transferencia:'',
        Pagar_Comision_Desde:'',
        Min_No_Cobro_Transferencia:'',
      }
    };
    
    this.HabilitarCampos = true;
    this.TotalPagoCambio = '';
    this.NombreMonedaTasaCambio = '';
  }

  ValidateCambioBeforeSubmit(){
    if (this.Venta) {
      
      if (this.CambioModel.Moneda_Destino == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe escoger una moneda para el cambio!');
        return false;

      }else if (this.CambioModel.Valor_Origen == '') {

        this.ShowSwal('warning', 'Alerta', 'El monto a cambiar no puede ser 0!');
        return false;

      }else if (this.CambioModel.Tasa == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe colocar una tasa para el cambio!');
        return false;

      }else if (this.CambioModel.Valor_Destino == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe recalcular el monto a entregar!');
        return false;

      }else if (this.CambioModel.Recibido == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe colocar el monto en el campo "Paga Con"!');
        return false;

      }else{
        
        return true;
      }

    }else{

      if (this.CambioModel.Moneda_Origen == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe escoger una moneda para el cambio!');
        return false;

      }else if (this.CambioModel.Valor_Origen == '') {

        this.ShowSwal('warning', 'Alerta', 'El monto a cambiar no puede ser 0!');
        return false;

      }else if (this.CambioModel.Tasa == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe colocar una tasa para el cambio!');
        return false;

      }else if (this.CambioModel.Valor_Destino == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe recalcular el monto a entregar!');
        return false;

      }else{

        return true;
      }
    }
  }

  //FIN CAMBIOS EFECTIVO

  //FUNCIONES TRANSFERENCIAS

  CalcularCambioMoneda(valor:string, tipo_cambio:string){

    if (this.TransferenciaModel.Moneda_Destino == '') {
      this.ShowSwal('warning', 'Alerta', 'Debe escoger la moneda antes de realizar la conversión!');
      this.TransferenciaModel.Cantidad_Recibida = '';
      this.TransferenciaModel.Cantidad_Transferida = '';
      return;
    }

    let tasa_cambio = this.TransferenciaModel.Tasa_Cambio;
    let value = parseFloat(valor);

    switch (tipo_cambio) {
      case 'por origen': 
        if (value > 0) {

          this.CalcularCambio(value, tasa_cambio, 'recibido');
        }else{
          this.LimpiarCantidades();
        }
        break;

      case 'por destino': 
        if (value > 0) {

          this.CalcularCambio(value, tasa_cambio, 'transferencia');
        }else{
          this.LimpiarCantidades();
        }
        break;

      case 'por tasa':
        if (!this.ValidarTasaCambio(tasa_cambio)) {
          return;
        }

        let valor_recibido = parseFloat(this.TransferenciaModel.Cantidad_Recibida);

        if (value > 0) {
          this.CalcularCambio(valor_recibido, value, 'recibido');
        }else{
          this.LimpiarCantidades();
        }
        break;
    
      default:
        this.confirmacionSwal.title = "Tipo cambio erroneo: "+tipo_cambio;
        this.confirmacionSwal.text = "La opcion para la conversion de la moneda es erronea! Contacte con el administrador del sistema!";
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();
        break;
    }
  }

  LimpiarCantidades(){
    this.TransferenciaModel.Cantidad_Recibida = '';
    this.TransferenciaModel.Cantidad_Transferida = '';

    this.TransferenciaModel.Destinatarios.forEach((d,i) => {
        this.TransferenciaModel.Destinatarios[i].Valor_Transferencia = '';
    });
  }

  ValidarTasaCambio(tasa_cambio){
    let max = parseFloat(this.MonedaParaTransferencia.Valores.Max_Compra_Efectivo);
    let min = parseFloat(this.MonedaParaTransferencia.Valores.Min_Compra_Efectivo);

    if (tasa_cambio > max || tasa_cambio < min) {
      this.TransferenciaModel.Tasa_Cambio = (max + min) / 2;
      this.confirmacionSwal.title = "Alerta";
      this.confirmacionSwal.text = "La tasa digitada es inferior/superior al mínimo/máximo establecido para la moneda"
      this.confirmacionSwal.type = "warning"
      this.confirmacionSwal.show();
      return false;
    }

    return true;
  }

  ValidarCupoTercero(){

    if (this.TransferenciaModel.Forma_Pago == 'Credito') {

      if (this.TransferenciaModel.Cupo_Tercero == '' || this.TransferenciaModel.Cupo_Tercero == '0' || this.TransferenciaModel.Cupo_Tercero == undefined) {
        this.ShowSwal('warning', 'Alerta', 'El tercero no posee un cupo de crédito disponible!');
        this.TransferenciaModel.Cantidad_Recibida = '';
        return false;
      }
  
      let cupo = parseFloat(this.TransferenciaModel.Cupo_Tercero);
      let recibido = parseFloat(this.TransferenciaModel.Cantidad_Recibida);
  
      if (cupo < recibido) {
        this.ShowSwal('warning', 'Alerta', 'El cupo disponible es menor a la cantidad recibida!');
        this.TransferenciaModel.Cantidad_Recibida = cupo;
        return false;
      }
  
      return true;
    }else{
      return true;
    }
  }

  ValidarBolsaBolivares(){

    if (this.TransferenciaModel.Forma_Pago == 'Credito') {
      if (this.MonedaParaTransferencia.nombre == 'Bolivares Soberanos') {
        if (this.TransferenciaModel.Bolsa_Bolivares == '' || this.TransferenciaModel.Bolsa_Bolivares == '0' || this.TransferenciaModel.Bolsa_Bolivares == undefined) {
          return true;
        }else{
          let bolsa = parseFloat(this.TransferenciaModel.Bolsa_Bolivares);
          let transferido = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
    
          if (bolsa < transferido) {
            this.ShowSwal('warning', 'Alerta', 'El valor a transferir es mayor a la cantidad bolsa pendiente!');
            return false;
          }else{
            return true;
          }
        }
      }else{
        return true;
      }
    }else{
      return true;
    }
  }

  CalcularCambio(valor:number, tasa:number, tipo:string){

    let conversion_moneda = 0;

    switch (tipo) {
      case 'recibido':

        if (!this.ValidarCupoTercero()) {
          return;
        }

        if (!this.ValidarTasaCambio(tasa)) {
          return;
        }
        
        conversion_moneda = parseFloat((valor / tasa).toFixed(2));
        this.TransferenciaModel.Cantidad_Transferida = conversion_moneda;
        //this.AsignarValorDestinatarios(conversion_moneda, TotalTransferenciaDestinatario, count);
        this.AsignarValorTransferirDestinatario(conversion_moneda);
        break;

      case 'transferencia':

        if (!this.ValidarCupoTercero()) {
          return;
        }
      
        if (!this.ValidarTasaCambio(tasa)) {
          return;
        }
        
        conversion_moneda = parseFloat((valor * tasa).toFixed(2));
        this.TransferenciaModel.Cantidad_Recibida = Math.round(conversion_moneda);
        //this.AsignarValorDestinatarios(valor, TotalTransferenciaDestinatario, count);
        this.AsignarValorTransferirDestinatario(valor);
        
        break;
    
      default:
        this.confirmacionSwal.title = "Opcion erronea o vacía: "+tipo;
        this.confirmacionSwal.text = "La opcion para la operacion es erronea! Contacte con el administrador del sistema!";
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();
        break;
    }
  }

  GetTotalTransferenciaDestinatarios():number{

    let TotalTransferenciaDestinatario = 0;

    this.TransferenciaModel.Destinatarios.forEach(e => {
      
      if (e.Valor_Transferencia == undefined || isNaN(e.Valor_Transferencia) || e.Valor_Transferencia == '') {
        TotalTransferenciaDestinatario += 0;
      }else{
        TotalTransferenciaDestinatario += parseFloat(e.Valor_Transferencia);
      }
    });

    return TotalTransferenciaDestinatario;
  }

  AsignarValorDestinatarios(valor_conversion:number, total_transferencia_destinatarios:number, count:number):void{
    if (count == 1) {
      this.TransferenciaModel.Destinatarios[(count - 1)].Valor_Transferencia = valor_conversion;
    }else{    

      if (valor_conversion > total_transferencia_destinatarios) {
        let acumulado = 0;
        this.TransferenciaModel.Destinatarios.forEach((d, i) => {
          if(i < (count - 1)){
            
            if (d.Valor_Transferencia == undefined || isNaN(d.Valor_Transferencia) || d.Valor_Transferencia == '') {
              acumulado += 0;
            }else{
              acumulado += parseFloat(d.Valor_Transferencia);
            }
          }else if(i == (count - 1)){
            
            let restante = valor_conversion - acumulado;
            this.TransferenciaModel.Destinatarios[i].Valor_Transferencia = restante;
          }
            
        });
      }else if(valor_conversion < total_transferencia_destinatarios){
        this.TransferenciaModel.Destinatarios.forEach((d,i) => {
            this.TransferenciaModel.Destinatarios[i].Valor_Transferencia = '';
        });
      }               
    }
  }

  AsignarValorTransferirDestinatario(valor){

    if (valor == '' || valor == '0') {
      this.TransferenciaModel.Destinatarios.array.forEach(d => {
        d.Valor_Transferencia = '';
      });
      return;
    }

    valor = parseFloat(valor).toFixed(2);
    let total_destinatarios = this.GetTotalTransferenciaDestinatarios();
    let count = this.TransferenciaModel.Destinatarios.length;    
    
    setTimeout(() => {
      this.Asignar(valor, total_destinatarios, count);
    }, 300);
  }

  Asignar(valor, total_destinatarios, count){

    if (this.TransferenciaModel.Bolsa_Bolivares != '' || this.TransferenciaModel.Bolsa_Bolivares != '0') {
      let valor_bolsa = parseFloat(this.TransferenciaModel.Bolsa_Bolivares);
      let nuevo_valor = valor + valor_bolsa;
      
      if (nuevo_valor > total_destinatarios) {
      
        if(this.TransferenciaModel.Destinatarios[(count - 1)].Valor_Transferencia == ''){
          this.TransferenciaModel.Destinatarios[(count - 1)].Valor_Transferencia = '0';
        }
        let v_transferir = parseFloat(this.TransferenciaModel.Destinatarios[(count - 1)].Valor_Transferencia);
        let operacion = v_transferir + (nuevo_valor - total_destinatarios);
        this.TransferenciaModel.Destinatarios[(count - 1)].Valor_Transferencia = operacion.toFixed(2);
  
      }else if (nuevo_valor < total_destinatarios) {
  
        let resta = total_destinatarios;
        
        for (let index = count; index > 0; index--) {
          let valor_pos = parseFloat(this.TransferenciaModel.Destinatarios[index - 1].Valor_Transferencia).toFixed(2);
          
          resta -= Number(valor_pos);
  
          if (resta > nuevo_valor) {
            
            this.TransferenciaModel.Destinatarios[index - 1].Valor_Transferencia = '0';
  
          }else if (resta < nuevo_valor && resta > valor) {
            let asignar = nuevo_valor - resta;
            this.TransferenciaModel.Destinatarios[index - 1].Valor_Transferencia = asignar.toFixed(2);    
            if (asignar > 0) {
              break;
            }   
          
          }else if (resta < nuevo_valor && resta < valor) {
            let asignar = valor - resta;
            this.TransferenciaModel.Destinatarios[index - 1].Valor_Transferencia = asignar.toFixed(2);    
            if (asignar > 0) {
              break;
            }   
          
          }else if (resta == nuevo_valor) {
            break;   
          }        
        }
      }

    }else{

      if (valor > total_destinatarios) {
      
        if(this.TransferenciaModel.Destinatarios[(count - 1)].Valor_Transferencia == ''){
          this.TransferenciaModel.Destinatarios[(count - 1)].Valor_Transferencia = '0';
        }
        let v_transferir = parseFloat(this.TransferenciaModel.Destinatarios[(count - 1)].Valor_Transferencia);
        let operacion = v_transferir + (valor - total_destinatarios);
        this.TransferenciaModel.Destinatarios[(count - 1)].Valor_Transferencia = operacion.toFixed(2);
  
      }else if (valor < total_destinatarios) {
  
        let resta = total_destinatarios;
        
        for (let index = count; index > 0; index--) {
          let valor_pos = parseFloat(this.TransferenciaModel.Destinatarios[index - 1].Valor_Transferencia).toFixed(2);
          
          resta -= Number(valor_pos);
  
          if (resta > valor) {
            
            this.TransferenciaModel.Destinatarios[index - 1].Valor_Transferencia = '0';
  
          }else if (resta < valor) {
            let asignar = valor - resta;
            this.TransferenciaModel.Destinatarios[index - 1].Valor_Transferencia = asignar.toFixed(2);    
            if (asignar > 0) {
              break;
            }   
          
          }else if (resta == valor) {
            break;   
          }        
        }
      }
    }
  }

  ValidarValorTransferirDestinatario(valor, index){

    if (this.TransferenciaModel.Forma_Pago == 'Credito') {
      if (this.MonedaParaTransferencia.nombre == 'Bolivares Soberanos') {
        if (this.TransferenciaModel.Bolsa_Bolivares == '' || this.TransferenciaModel.Bolsa_Bolivares == '0' || this.TransferenciaModel.Bolsa_Bolivares == undefined) {
        }else{
          
          if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == '0' || this.TransferenciaModel.Cantidad_Transferida == undefined) {
            this.TransferenciaModel.Destinatarios[index].Valor_Transferencia = '';
            this.ShowSwal('warning', 'Alerta', 'Debe colocar primero el valor a transferir!');
            return;
          }
      
          if (valor == '') {
            return;
          }
                
          let bolsa = parseFloat(this.TransferenciaModel.Bolsa_Bolivares);
          let transferir = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
          let total_sumado = bolsa + transferir;
          valor = parseFloat(valor);
          let total_valor_destinatarios = this.GetTotalTransferenciaDestinatarios();
      
          if (total_valor_destinatarios > total_sumado) {
            
            let asignar = valor - (total_valor_destinatarios - total_sumado);
            this.TransferenciaModel.Destinatarios[index].Valor_Transferencia = asignar.toFixed(2);

          }else if (total_valor_destinatarios < total_sumado) {

            let restante = - (total_valor_destinatarios - total_sumado);
            this.Bolsa_Restante = restante.toFixed(2);
          }
        }
      }
    }else{
      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == '0' || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        
        this.TransferenciaModel.Destinatarios[index].Valor_Transferencia = '';
        this.ShowSwal('warning', 'Alerta', 'Debe colocar primero el valor a transferir!');
        return;
      }
  
      if (valor == '') {
        this.TransferenciaModel.Destinatarios[index].Valor_Transferencia = '';
        return;
      }
  
      let transferir = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
      valor = parseFloat(valor).toFixed(2);
      let total_valor_destinatarios = this.GetTotalTransferenciaDestinatarios();
  
      if (total_valor_destinatarios > transferir) {

        let asignar = valor - (total_valor_destinatarios - transferir);
        this.TransferenciaModel.Destinatarios[index].Valor_Transferencia = asignar.toFixed(2);

      }else if(total_valor_destinatarios < transferir){

        //let asignar = valor + (transferir - total_valor_destinatarios);
        //this.TransferenciaModel.Destinatarios[index].Valor_Transferencia = asignar.toFixed(2);
      }
    }

    /*if (this.TransferenciaModel.Cantidad_Transferida != '' || this.TransferenciaModel.Cantidad_Transferida != '0' || this.TransferenciaModel.Cantidad_Transferida != undefined) {
      
      this.ShowSwal('warning', 'Alerta', 'Debe colocar primero el valor a transferir!');
      return;
    }

    if (valor == '') {
      return;
    }

    let transferir = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
    valor = parseFloat(valor);
    let total_valor_destinatarios = this.GetTotalTransferenciaDestinatarios();

    if (total_valor_destinatarios > transferir || total_valor_destinatarios < transferir) {
      
      let asignar = valor - (total_valor_destinatarios - transferir);
      this.TransferenciaModel.Destinatarios[index].Valor_Transferencia = asignar.toString();
    }*/
  }

  ValidarCantidadTransferidaDestinatarios(){   

    let totalDestinatarios = this.GetTotalTransferenciaDestinatarios();
    
    if (this.TransferenciaModel.Forma_Pago == 'Credito') {
      if (this.MonedaParaTransferencia.nombre == 'Bolivares Soberanos') {
        if (this.TransferenciaModel.Bolsa_Bolivares == '' || this.TransferenciaModel.Bolsa_Bolivares == '0' || this.TransferenciaModel.Bolsa_Bolivares == undefined) {
          return true;
        }else{
          let bolsa = parseFloat(this.TransferenciaModel.Bolsa_Bolivares);
          let transferido = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
          let total = bolsa + transferido;
    
          if (totalDestinatarios > total) {
            this.ShowSwal('warning', 'Alerta', 'La suma del valor a transferir entre los destinatarios es mayor al máximo total a transferir!');
            return false;
          }else{
            return true;
          }
        }
      }else{
        return true;
      }
    }else{
      return true;
    }
  }



  GuardarTransferencia(formulario: NgForm) {
    let forma_pago = this.TransferenciaModel.Forma_Pago;
    console.log(this.TransferenciaModel.Forma_Pago);
    

    //NUEVO CODIGO
    switch (forma_pago) {
      case 'Efectivo':        
        this.GuardarTransferenciaEfectivo();
        break;

      case 'Consignacion':
        this.GuardarTransferenciaEfectivo();
        break;

      case 'Credito':
        this.GuardarTransferenciaEfectivo();
        break;
    
      default:
        this.ShowSwal("warning","Alerta","Tipo de Transferencia erronea");
        break;
    }
  }

  GuardarTransferenciaEfectivo(){  
    
    let tipo_transferencia = this.TransferenciaModel.Tipo_Transferencia;
    let total_a_transferir = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
    let total_suma_transferir_destinatarios = this.GetTotalTransferenciaDestinatarios(); 
    this.TransferenciaModel.Identificacion_Funcionario = this.funcionario_data.Identificacion_Funcionario;  

    console.log(this.TransferenciaModel);
    
    
    if(!this.ValidateBeforeSubmit()){
      return;
    }

    switch (tipo_transferencia) {
      case 'Transferencia':

        if (this.TransferenciaModel.Bolsa_Bolivares != '' || this.TransferenciaModel.Bolsa_Bolivares != '0' ) {
          
          if (total_suma_transferir_destinatarios < (parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir)) {
            let restante_bolsa = ((parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir) - total_suma_transferir_destinatarios).toFixed(2);

            this.SaveTransferencia(restante_bolsa);
          }else{
            this.ShowSwal('warning', 'Alerta', 'La suma total del monto a transferir de los destinatarios es mayor que el total asignado a la transferencia!');
          }
        }else{

          if(total_suma_transferir_destinatarios > 0 && total_a_transferir == total_suma_transferir_destinatarios){

            this.SaveTransferencia();
          }else{
            this.ShowSwal('warning', 'Alerta', 'El total repartido entre los destinatarios es mayor al total a entegar');
          }
        }        
        break;

      case 'Cliente':
        
        let info = JSON.stringify(this.TransferenciaModel);
        let datos = new FormData();
        datos.append("datos", info); 
        this.http.post(this.globales.ruta + 'php/pos/movimiento.php', datos)
        //this.http.post(this.globales.ruta + 'php/transferencias/pruebas_envio_transferencia.php', datos)
          .catch(error => {
            console.error('An error occurred:', error.error);
            this.errorSwal.show();
            return this.handleError(error);
          })
          .subscribe((data: any) => {
            this.LimpiarModeloTransferencia();
            this.SetTransferenciaDefault();
            //formulario.reset();
            this.opcionDefaultFormaPago = "Efectivo";
            this.opcionTipoTransferencia  = "Transferencia";
            this.seleccioneClienteDefault = "";
            this.movimientoExitosoSwal.show();
            //////////console.log(data);
            this.TipoPagoTransferencia("Efectivo");
            this.Transferencia1 = true;
            this.Transferencia2 = false;
            this.actualizarVista();
            this.VerificarTipoTransferencia();
          });
        break;
    
      default:
        break;
    }
  }

  SaveTransferencia(bolsa = ''){
    this.TransferenciaModel.Id_Tercero_Destino = '0';
  
    this.LimpiarBancosDestinatarios(this.TransferenciaModel.Destinatarios);
    let info = JSON.stringify(this.TransferenciaModel);
    let destinatarios = JSON.stringify(this.TransferenciaModel.Destinatarios);
    //return;
    
    let datos = new FormData();
    datos.append("datos", info);
    datos.append("destinatarios", destinatarios);

    if (bolsa != '') {
      datos.append("bolsa_restante", bolsa);
    }
    this.http.post(this.globales.ruta + 'php/pos/guardar_transferencia.php', datos)
    //this.http.post(this.globales.ruta + 'php/transferencias/pruebas_envio_transferencia.php', datos)
    .catch(error => {
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    }).subscribe((data: any) => {
      this.LimpiarModeloTransferencia();
      this.SetTransferenciaDefault();
      //formulario.reset();
      this.transferenciaExitosaSwal.show();
      this.TipoPagoTransferencia("Efectivo");
      this.Transferencia1 = true;
      this.Transferencia2 = false;
      this.recargarDestinatario();
      this.actualizarVista();
      this.ReiniciarTransferencias();

    });
  }

  LimpiarModeloTransferencia(dejarFormaPago:boolean = false, dejarTipoTransferencia:boolean = false){
    //MODELO PARA TRANSFERENCIAS
    this.TransferenciaModel = {
      Forma_Pago: dejarFormaPago ? this.TransferenciaModel.Forma_Pago : 'Efectivo',
      Tipo_Transferencia: dejarTipoTransferencia ? this.TransferenciaModel.Tipo_Transferencia : 'Transferencia',

      //DATOS DEL CAMBIO
      Moneda_Origen: '2',
      Moneda_Destino: '',
      Cantidad_Recibida: '',
      Cantidad_Transferida: '',
      Tasa_Cambio: '',
      Identificacion_Funcionario: '',
      Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
      Observacion_Transferencia:'',

      //DESTINATARIOS
      Destinatarios: [
        {
          id_destinatario_transferencia: '',
          Numero_Documento_Destino: '',
          Nombre_Destinatario: '',
          Id_Destinatario_Cuenta: '',
          Valor_Transferencia: '',
          Cuentas: [],
          EditarVisible: false
        }
      ], 

      //DATOS REMITENTE
      Documento_Origen: '',
      Nombre_Remitente: '',
      Telefono_Remitente: '',

      //DATOS CREDITO
      Id_Tercero: '',
      Cupo_Tercero: 0,
      Bolsa_Bolivares: 0,

      //DATOS CONSIGNACION
      Id_Cuenta_Bancaria: '',

      //DATOS PARA TRANSFERENCIAS DIRECTO A UN CLIENTE(TERCERO)
      Id_Tercero_Destino: ''
    };

    this.MonedaParaTransferencia = {
      id: '',
      nombre: '',
      Valores:{
        Min_Venta_Efectivo:'',
        Max_Venta_Efectivo:'',
        Sugerido_Venta_Efectivo:'',
        Min_Compra_Efectivo:'',
        Max_Compra_Efectivo:'',
        Sugerido_Compra_Efectivo:'',
        Min_Venta_Transferencia:'',
        Max_Venta_Transferencia:'',
        Sugerido_Venta_Transferencia:'',
        Costo_Transferencia:'',
        Comision_Efectivo_Transferencia:'',
        Pagar_Comision_Desde:'',
        Min_No_Cobro_Transferencia:'',
      }
    };

    this.id_remitente = '';
    this.tercero_credito = '';
  }

  LimpiarBancosDestinatarios(listaLimpiar){
    listaLimpiar.forEach(e => {
      e.Cuentas = [];
      e.id_destinatario_transferencia = '';
    });
  }

  SetTransferenciaDefault(){
    this.ControlVisibilidadTransferencia.DatosCambio = true;
    this.ControlVisibilidadTransferencia.Destinatarios = true;
    this.ControlVisibilidadTransferencia.DatosRemitente = true;
    this.ControlVisibilidadTransferencia.DatosCredito = false;
    this.ControlVisibilidadTransferencia.DatosConsignacion = false;
    this.ControlVisibilidadTransferencia.SelectCliente = false;
  }

  AutoCompletarTerceroCredito(datos_tercero){
    
    if (typeof(datos_tercero) == 'object') {

      this.TransferenciaModel.Id_Tercero = datos_tercero.Id_Tercero;
      this.TransferenciaModel.Cupo_Tercero = datos_tercero.Cupo;
    }else{
      this.TransferenciaModel.Id_Tercero = '';
      this.TransferenciaModel.Cupo_Tercero = '';
    }
    
  }

  ValidarValorRecibidoCredito(){
    
    let cupo = (this.TransferenciaModel.Cupo_Tercero == '' || this.TransferenciaModel.Cupo_Tercero == '0' || isNaN(this.TransferenciaModel.Cupo_Tercero)) ? 0 : parseFloat(this.TransferenciaModel.Cupo_Tercero);
    let recibido = parseFloat(this.TransferenciaModel.Cantidad_Recibida); 

    if (cupo == 0) {
      this.ShowSwal('warning', 'Alerta', 'El tercero no posee crédito disponible o no se ha cargado la información del tercero');
      this.TransferenciaModel.Cantidad_Recibida = '';
      return false;
    }

    if(recibido == 0){
      this.ShowSwal('warning', 'Alerta', 'Debe colocar un valor en este campo');
      return false;
    }

      
    console.log(cupo);
    console.log(recibido);
    if (recibido > cupo) {
      this.ShowSwal('warning', 'Alerta', 'No puede asignar un monto mayor al cupo disponible');
      this.TransferenciaModel.Cantidad_Recibida = cupo;
      this.CalcularCambioMoneda(cupo.toString(), 'por origen');
      return true;
    }

    return true;
  }

  ValidarValorTransferenciaCredito(){

    let moneda_cambio = this.TransferenciaModel.Moneda_Destino;

    if (moneda_cambio == 1) {
      
      let transferido = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
      let bolsa = (this.TransferenciaModel.Bolsa_Bolivares == '' || isNaN(this.TransferenciaModel.Bolsa_Bolivares)) ? 0 : parseFloat(this.TransferenciaModel.Bolsa_Bolivares);

      if(bolsa == 0){
        return true;
      }

      if(transferido == 0){
        this.ShowSwal('warning', 'Alerta', 'Debe colocar un monto para la transferencia');
        return false;
      }

      if (transferido > bolsa) {
        this.ShowSwal('warning', 'Alerta', 'No puede asignar un monto mayor a la bolsa de bolivares disponible');
        this.TransferenciaModel.Cantidad_Transferida = this.TransferenciaModel.Bolsa_Bolivares;
        return false;
      }
    }
    
    return true;
  }

  AgregarDestinatarioTransferencia(){

    if (this.TransferenciaModel.Cantidad_Recibida > 0) {
      
      let listaDestinatarios = this.TransferenciaModel.Destinatarios;
      for (let index = 0; index < listaDestinatarios.length; index++) {
        
        if(listaDestinatarios[index].Numero_Documento_Destino == 0 || listaDestinatarios[index].Numero_Documento_Destino == '' || listaDestinatarios[index].Numero_Documento_Destino === undefined){
          this.ShowSwal('warning', 'Alerta', 'Debe anexar toda la información del(de los) destinatario(s) antes de agregar uno nuevo');
          return;
        }

        if(listaDestinatarios[index].Id_Destinatario_Cuenta == '' || listaDestinatarios[index].Id_Destinatario_Cuenta === undefined){
          this.ShowSwal('warning', 'Alerta', 'Debe anexar la información del(de los) destinatario(s) antes de agregar uno nuevo');
          return;
        }

        if(listaDestinatarios[index].Valor_Transferencia == '' || listaDestinatarios[index].Valor_Transferencia === undefined){
          this.ShowSwal('warning', 'Alerta', 'Debe anexar la información del(de los) destinatario(s) antes de agregar uno nuevo');
          return;
        }      
      }

      let nuevoDestinatario = {
        id_destinatario_transferencia: '',
        Numero_Documento_Destino: '',
        Nombre_Destinatario: '',
        Id_Destinatario_Cuenta: '',
        Valor_Transferencia: '',
        Cuentas: [],
        EditarVisible: false
      };
      
      this.TransferenciaModel.Destinatarios.push(nuevoDestinatario);
    }else{
      this.ShowSwal('warning','Alerta','Debe colocar la cantidad a transferir antes de agregar destinatarios!');
    }
  }

  SetMonedaTransferencia(value){
    this.MonedaParaTransferencia.id = value;
    this.TransferenciaModel.Moneda_Destino = value;

    if(value != ''){
      let c = this.Monedas.find(x =>  x.Id_Moneda == value);
      this.MonedaParaTransferencia.nombre = c.Nombre;

      this.http.get(this.globales.ruta+'php/monedas/buscar_valores_moneda.php', { params: {id_moneda:value} }).subscribe((data:any) => {
        this.MonedaParaTransferencia.Valores = data;
        
        this.TransferenciaModel.Tasa_Cambio = data.Sugerido_Compra_Efectivo;

        if (this.MonedaParaTransferencia.nombre == 'Bolivares Soberanos') {
          this.InputBolsaBolivares  = true;
        }else{
          this.InputBolsaBolivares  = false;
        }
      });
    }else{
      this.MonedaParaTransferencia.nombre = '';
      this.TransferenciaModel.Tasa_Cambio = '';
      this.InputBolsaBolivares  = false;
    }
    
    console.log(this.MonedaParaTransferencia); 
    console.log(this.TransferenciaModel);    
  }

  ValidateBeforeSubmit(){

    let Forma_Pago = this.TransferenciaModel.Forma_Pago;
    let tipo = this.TransferenciaModel.Tipo_Transferencia;

    if (Forma_Pago == 'Efectivo' && tipo == 'Transferencia') {
      //VALIDAR DESTINATARIOS
      //VALIDAR DATOS DEL CAMBIO
      //VALIDAR DATOS DEL REMITENTE
      
      let qty_destinatarios = this.TransferenciaModel.Destinatarios.length;
      for (let index = 0; index < (qty_destinatarios); index++) {
        let d = this.TransferenciaModel.Destinatarios[index];
        if (d.Numero_Documento_Destino == '' || d.Numero_Documento_Destino == undefined) {
          
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignado su nro. de documento!');
          return false;
        }

        if (d.Id_Destinatario_Cuenta == '' || d.Id_Destinatario_Cuenta == undefined) {

          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada un nro. de cuenta para la transacción!');
          return false;
        }

        if (d.Valor_Transferencia == '' || d.Valor_Transferencia == 0 || d.Valor_Transferencia == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada el valor a transferir o es 0, por favor revise!');
          return false;
        }
      }

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == 0 || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == 0 || this.TransferenciaModel.Tasa_Cambio == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
        return false;
      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == 0 || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == 0 || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se han asignado los datos del remitente!');
        return false;
      }

      return true;

    }else if (Forma_Pago == 'Efectivo' && tipo == 'Cliente') {
      //VALIDAR DESTINATARIO
      //VALIDAR DATOS DEL CAMBIO
      //VALIDAR DATOS DEL REMITENTE

      if (this.TransferenciaModel.Id_Tercero_Destino == '' || this.TransferenciaModel.Id_Tercero_Destino == 0 || this.TransferenciaModel.Id_Tercero_Destino == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado un destinatario para la transferencia!');
        return false;
      }

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == 0 || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == 0 || this.TransferenciaModel.Tasa_Cambio == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
        return false;
      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == 0 || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == 0 || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se han asignado los datos del remitente!');
        return false;
      }

      return true;

    }else if (Forma_Pago == 'Credito' && tipo == 'Transferencia') {
      //VALIDAR TERCERO CREDITO
      //VALIDAR DESTINATARIOS
      //VALIDAR DATOS DEL CAMBIO

      if (this.TransferenciaModel.Id_Tercero == '' || this.TransferenciaModel.Id_Tercero == 0 || this.TransferenciaModel.Id_Tercero == undefined) {
        this.ShowSwal('warning', 'Alerta', 'Debe agregar un tercero antes de guardar una transferencia');
        return false;
      }

      let qty_destinatarios = this.TransferenciaModel.Destinatarios.length;
      this.TransferenciaModel.Destinatarios.forEach(d => {
        if (d.Numero_Documento_Destino == '' || d.Numero_Documento_Destino == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignado su nro. de documento!');
          return false;
        }

        if (d.Id_Destinatario_Cuenta == '' || d.Id_Destinatario_Cuenta == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada un nro. de cuenta para la transacción!');
          return false;
        }

        if (d.Valor_Transferencia == '' || d.Valor_Transferencia == 0 || d.Valor_Transferencia == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada el valor a transferir o es 0, por favor revise!');
          return false;
        }
      });

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == 0 || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == 0 || this.TransferenciaModel.Tasa_Cambio == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
        return false;
      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == 0 || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      return true;

    }else if (Forma_Pago == 'Credito' && tipo == 'Cliente') {
      //AQUI NO SE HACEN VALIDACIONES YA QUE NO PUEDE HABER UNA TRANSFERENCIA CREDITO EN ESTE FORMATO
      this.ShowSwal('warning', 'Alerta', 'La forma de pago credito no permite tipos de pago a clientes!');
      return false;

    }else if (Forma_Pago == 'Consignacion' && tipo == 'Transferencia') {
      //VALIDAR CONSIGNACION
      //VALIDAR DESTINATARIOS
      //VALIDAR DATOS DEL CAMBIO
      //VALIDAR DATOS DEL REMITENTE

      if (this.TransferenciaModel.Id_Cuenta_Bancaria == '' || this.TransferenciaModel.Id_Cuenta_Bancaria == 0 || this.TransferenciaModel.Id_Cuenta_Bancaria == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado la cuenta para la consignacion!');
        return false;
      }

      this.TransferenciaModel.Destinatarios.forEach(d => {
        if (d.Numero_Documento_Destino == '' || d.Numero_Documento_Destino == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignado su nro. de documento!');
          return false;
        }

        if (d.Id_Destinatario_Cuenta == '' || d.Id_Destinatario_Cuenta == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada un nro. de cuenta para la transacción!');
          return false;
        }

        if (d.Valor_Transferencia == '' || d.Valor_Transferencia == 0 || d.Valor_Transferencia == undefined) {
          this.ShowSwal('warning', 'Alerta', 'Uno de los destinatarios no tiene asignada el valor a transferir o es 0, por favor revise!');
          return false;
        }
      });

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == 0 || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == 0 || this.TransferenciaModel.Tasa_Cambio == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
        return false;
      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == 0 || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == 0 || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se han asignado los datos del remitente!');
        return false;
      }

      return true;

    }else if (Forma_Pago == 'Consignacion' && tipo == 'Cliente') {
      //VALIDAR DESTINATARIO
      //VALIDAR CONSIGNACION
      //VALIDAR DATOS DEL CAMBIO
      //VALIDAR DATOS DEL REMITENTE

      if (this.TransferenciaModel.Id_Tercero_Destino == '' || this.TransferenciaModel.Id_Tercero_Destino == 0 || this.TransferenciaModel.Id_Tercero_Destino == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado un destinatario para la consignacion!');
        return false;
      }

      if (this.TransferenciaModel.Id_Cuenta_Bancaria == '' || this.TransferenciaModel.Id_Cuenta_Bancaria == 0 || this.TransferenciaModel.Id_Cuenta_Bancaria == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado la cuenta para la consignacion!');
        return false;
      }

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == 0 || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == 0 || this.TransferenciaModel.Tasa_Cambio == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
        return false;
      }

      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == 0 || this.TransferenciaModel.Cantidad_Transferida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == 0 || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se han asignado los datos del remitente!');
        return false;
      }

      return true;
    }
  }

  //FIN TRANSFERENCIAS

  //GIROS  
  
  ModalVerGiro(id) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { modulo: 'Giro', id: id } }).subscribe((data: any) => {
      this.informacionGiro = data;
      this.ValorTotalGiro = Number(data.Valor_Total);
    });
    this.ModalAprobarGiro.show();
  }

  FiltrarGiroCedula(value) {

    this.Aparecer = false;
    this.http.get(this.globales.ruta + 'php/giros/giros_cedula.php', { params: { id: value, funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.GirosBuscar = data;
      if (this.GirosBuscar.length > 0) {
        this.Aparecer = true;
      }
    });

  }

  PagarGiro(id, modal, value) {
    let datos = new FormData();
    datos.append("id", id);
    datos.append("caja", JSON.parse(localStorage['User']).Identificacion_Funcionario);
    this.http.post(this.globales.ruta + 'php/giros/pagar_giro.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        this.confirmacionSwal.title = "Pago Exitoso";
        this.confirmacionSwal.text = "Se ha realizado el pago del giro correctamente";
        this.confirmacionSwal.type = "success";
        this.confirmacionSwal.show();
        modal.hide();

        this.http.get(this.globales.ruta + 'php/giros/giros_cedula.php', { params: { id: value } }).subscribe((data: any) => {
          this.GirosBuscar = data;
          this.actualizarVista();
          if (this.GirosBuscar.length > 0) {
            this.Aparecer = true;
          }
        });

      });

  }

  ConfirmacionGiro(valor) {
    this.confirmacionGiro.title = "¿ esta seguro ?";
    this.confirmacionGiro.text = "Confirme que el valor entregado sea de " + valor;
    this.confirmacionGiro.type = "warning"
    this.confirmacionGiro.show();
  }

  EditarGiro(id) {

    this.http.get(this.globales.ruta + '/php/pos/detalle_giro.php', { params: { modulo: 'Giro', id: id } }).subscribe((data: any) => {
      this.idGiro = id;
      this.Giro = data.giro;
      this.Remitente = data.remitente;
      this.Destinatario = data.destinatario;
      this.ModalGiroEditar.show();
      this.ValorEnviar = data.giro.ValorEnviar;
      this.valorComision(data.giro.Valor_Total);
      this.Municipios_Departamento(data.remitente.Id_Departamento, 'Remitente');
      this.Municipios_Departamento(data.destinatario.Id_Departamento, 'Destinatario');
      this.Departamento_Remitente = this.Departamentos[data.remitente.Id_Departamento].Nombre;
      this.Departamento_Destinatario = this.Departamentos[data.destinatario.Id_Departamento].Nombre;
      this.DatosRemitenteEditarGiro = data.remitente.DatosRemitenteEditarGiro;
      this.DatosDestinatarioEditarGiro = data.destinatario.DatosDestinatarioEditarGiro;
    });
  }

  resultado = [{
    Id_Transferencia_Remitente: "",
    Nombre: "",
    Telefono: ""
  }];

  AutoCompletarDatosPersonalesGiro(modelo, tipo_persona:string) {
    console.log(modelo);

    if (typeof(modelo) == 'object') {
      
      let validacion = this.ValidarRemitenteDestinatario(modelo.Id_Transferencia_Remitente, tipo_persona);
      if(validacion){
        return;
      };

      this.AsignarValoresPersonaGiro(modelo, tipo_persona);

    }else if(typeof(modelo) == 'string'){
      if(modelo == ''){
        this.VaciarValoresPersonaGiro(tipo_persona);
      }
    }

    /*if (modelo) {
      if (modelo.length > 0) {
        this.RemitentesFiltrados = this.Remitentes.filter(number => number.Id_Transferencia_Remitente.slice(0, modelo.length) == modelo);
        console.log("filtrados");
        
        console.log(this.RemitentesFiltrados);
        
      }
      else {
        this.RemitentesFiltrados = null;
      }
    }*/
  }

  ValidarRemitenteDestinatario(id_persona, tipo_persona:string){

    if (tipo_persona == 'remitente') {
      let d = this.GiroModel.Documento_Destinatario;

      if(d == '' || d == undefined){
        return false;
      }

      if (id_persona == d) {
        this.ShowSwal('warning', 'Alerta', 'El remitente y el destinatario no pueden ser la misma persona');
        this.VaciarValoresPersonaGiro(tipo_persona);
        return true;
      }
    }else if(tipo_persona == 'destinatario'){

      let r = this.GiroModel.Documento_Remitente;

      if(r == '' || r == undefined){
        return false;
      }

      if (id_persona == r) {
        this.ShowSwal('warning', 'Alerta', 'El remitente y el destinatario no pueden ser la misma persona');
        this.VaciarValoresPersonaGiro(tipo_persona);
        return true;
      }
    }

    return false;
  }

  AsignarValoresPersonaGiro(modelo, tipo_persona){

    if (tipo_persona == 'remitente') {
      this.GiroModel.Documento_Remitente = modelo.Id_Transferencia_Remitente;
      this.GiroModel.Nombre_Remitente = modelo.Nombre;
      this.GiroModel.Telefono_Remitente = modelo.Telefono;
      
    }else if(tipo_persona == 'destinatario'){

      this.GiroModel.Documento_Destinatario = modelo.Id_Transferencia_Remitente;
      this.GiroModel.Nombre_Destinatario = modelo.Nombre;
      this.GiroModel.Telefono_Destinatario = modelo.Telefono;
    }
  }

  VaciarValoresPersonaGiro(tipo_persona){    

    if (tipo_persona == 'remitente') {
      this.GiroModel.Documento_Remitente = '';
      this.GiroModel.Nombre_Remitente = '';
      this.GiroModel.Telefono_Remitente = '';
      this.Remitente_Giro = '';
      
    }else if(tipo_persona == 'destinatario'){

      this.GiroModel.Documento_Destinatario = '';
      this.GiroModel.Nombre_Destinatario = '';
      this.GiroModel.Telefono_Destinatario = '';
      this.Destinatario_Giro = '';
    }
  }

  IdRemitenteGiro: any = "";
  NombreRemitenteGiro: any = "";
  TelefonoRemitenteGiro: any = "";
  CompletarDatosRemitenteGiro() {
    var valor = ((document.getElementById("DocumentoGiroRemitente") as HTMLInputElement).value);
    var index = this.Remitentes.findIndex(x => x.Id_Transferencia_Remitente === valor)
    if (index > -1) {
      this.IdRemitenteGiro = this.Remitentes[index].Id_Transferencia_Remitente;
      this.NombreRemitenteGiro = this.Remitentes[index].Nombre;
      this.TelefonoRemitenteGiro = this.Remitentes[index].Telefono;
    } else {
      this.IdRemitenteGiro = valor;
      this.NombreRemitenteGiro = "";
      this.TelefonoRemitenteGiro = "";
    }
  }

  IdDestinatarioGiro: any = "";
  NombreDestinatarioGiro: any = "";
  TelefonoDestinatarioGiro: any = "";
  CompletarDatosDestinatarioGiro() {
    var valor = ((document.getElementById("DocumentoGiroDestinatario") as HTMLInputElement).value);
    var index = this.Remitentes.findIndex(x => x.Id_Transferencia_Remitente === valor)
    if (index > -1) {
      this.IdDestinatarioGiro = this.Remitentes[index].Id_Transferencia_Remitente;
      this.NombreDestinatarioGiro = this.Remitentes[index].Nombre;
      this.TelefonoDestinatarioGiro = this.Remitentes[index].Telefono;
    } else {
      this.IdDestinatarioGiro = valor;
      this.NombreDestinatarioGiro = "";
      this.TelefonoDestinatarioGiro = "";
    }
  }

  valorComision(value) {
    
    let recibido = parseFloat(this.GiroModel.Valor_Recibido);
    
    if(typeof(value) == 'boolean'){
      if(recibido == 0 || recibido == undefined || isNaN(recibido)){
        this.ShowSwal('warning', 'Alerta', 'Debe introducir el valor a enviar para hacer el cálculo!');
        return;
      }
    }

    //this.ValorEnviar = value;
    this.GiroComision.forEach(element => {
      if ((parseFloat(element.Valor_Minimo) < recibido) && (recibido < parseFloat(element.Valor_Maximo))) {
        this.GiroModel.Comision = element.Comision;
        //this.Costo = element.Comision;

        var checkeado = ((document.getElementById("libre") as HTMLInputElement).checked);
        
        switch (checkeado) {
          case true: {
            this.GiroModel.Valor_Total = recibido;
            this.GiroModel.Valor_Entrega = recibido + parseFloat(element.Comision);
            /*this.ValorTotal = parseFloat(value);
            this.ValorEntrega = parseFloat(value) + parseFloat(element.Comision);*/
            break;
          }
          case false: {
            this.GiroModel.Valor_Total = recibido - parseFloat(element.Comision);
            this.GiroModel.Valor_Entrega = recibido;
            /*this.ValorTotal = parseFloat(value) - parseFloat(element.Comision);
            this.ValorEntrega = parseFloat(value);*/
            break;
          }
        }
      }
    });
  }

  RealizarGiro(formulario: NgForm) {

    console.log(this.GiroModel);

    if(!this.ValidateGiroBeforeSubmit()){
      return;
    }

    let info = JSON.stringify(this.GiroModel);

    /*formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    formulario.value.Documento_Remitente = this.IdRemitenteGiro;
    formulario.value.Documento_Destinatario = this.IdDestinatarioGiro
    formulario.value.Id_Oficina = 5;
    formulario.value.Id_Caja = 4;
    let info = JSON.stringify(formulario.value);*/
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/pos/guardar_giro.php', datos).subscribe((data: any) => {
      //formulario.reset();
      this.LimpiarModeloGiro('creacion');
      this.Giro1 = true;
      this.Giro2 = false;
      this.confirmacionSwal.title = "Guardado con exito";
      this.confirmacionSwal.text = "Se ha guardado correctamente el giro"
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();
      this.actualizarVista();
    });
  }

  RealizarEdicionGiro(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/pos/guardar_giro.php', datos).subscribe((data: any) => {
      modal.hide();
      this.confirmacionSwal.title = "Guardado con exito";
      this.confirmacionSwal.text = "Se ha guardado correctamente el giro"
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();
      this.actualizarVista();
    });
  }

  ValidateGiroBeforeSubmit(){
    if (this.GiroModel.Departamento_Remitente == '' || this.GiroModel.Departamento_Remitente == 0 || this.GiroModel.Departamento_Remitente == undefined) {
      this.ShowSwal('warning', 'Alerta', 'No se ha escogido el departamento del remitente!');
      return false;
    }

    if (this.GiroModel.Municipio_Remitente == '' || this.GiroModel.Municipio_Remitente == 0 || this.GiroModel.Municipio_Remitente == undefined) {
      this.ShowSwal('warning', 'Alerta', 'No se ha escogido el municipio del remitente!');
      return false;
    }

    if (this.GiroModel.Documento_Remitente == '' || this.GiroModel.Documento_Remitente == 0 || this.GiroModel.Documento_Remitente == undefined) {
      this.ShowSwal('warning', 'Alerta', 'No se ha escogido el nro. de documento del remitente!');
      return false;
    }

    if (this.GiroModel.Departamento_Destinatario == '' || this.GiroModel.Departamento_Destinatario == 0 || this.GiroModel.Departamento_Destinatario == undefined) {
      this.ShowSwal('warning', 'Alerta', 'No se ha escogido el departamento del destinatario!');
      return false;
    }

    if (this.GiroModel.Municipio_Destinatario == '' || this.GiroModel.Municipio_Destinatario == 0 || this.GiroModel.Municipio_Destinatario == undefined) {
      this.ShowSwal('warning', 'Alerta', 'No se ha escogido el municipio del destinatario!');
      return false;
    }

    if (this.GiroModel.Documento_Destinatario == '' || this.GiroModel.Documento_Destinatario == 0 || this.GiroModel.Documento_Destinatario == undefined) {
      this.ShowSwal('warning', 'Alerta', 'No se ha escogido el nro. de documento del destinatario!');
      return false;
    }

    if (this.GiroModel.Valor_Recibido == '' || this.GiroModel.Valor_Recibido == 0 || this.GiroModel.Valor_Recibido == undefined) {
      this.ShowSwal('warning', 'Alerta', 'Digite el valor a enviar en el giro!');
      return false;
    }

    return true;
  }

  LimpiarModeloGiro(tipo:string){

    if (tipo == 'creacion') {
      this.GiroModel = {
    
        //REMITENTE
        Departamento_Remitente: '',
        Municipio_Remitente: '',
        Documento_Remitente: '',
        Nombre_Remitente: '',
        Telefono_Remitente: '',
      
        //DESTINATARIO
        Departamento_Destinatario: '',
        Municipio_Destinatario: '',
        Documento_Destinatario: '',
        Nombre_Destinatario: '',
        Telefono_Destinatario: '',    
    
        //DATOS GIRO
        Valor_Recibido: '',
        Comision: '',
        Valor_Total: '',
        Valor_Entrega: '',
        Detalle: '',
        Giro_Libre: false,
        Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
        Id_Oficina: 5,
        Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja
      };
  
      this.Remitente_Giro = '';
      this.Destinatario_Giro = '';
    }

    if (tipo == 'edicion') {
      this.GiroModel = {
    
        //REMITENTE
        Departamento_Remitente: '',
        Municipio_Remitente: '',
        Documento_Remitente: '',
        Nombre_Remitente: '',
        Telefono_Remitente: '',
      
        //DESTINATARIO
        Departamento_Destinatario: '',
        Municipio_Destinatario: '',
        Documento_Destinatario: '',
        Nombre_Destinatario: '',
        Telefono_Destinatario: '',    
    
        //DATOS GIRO
        Valor_Recibido: '',
        Comision: '',
        Valor_Total: '',
        Valor_Entrega: '',
        Detalle: '',
        Giro_Libre: false,
        Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
        Id_Oficina: 5,
        Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja
      };
  
      this.Remitente_Giro = '';
      this.Destinatario_Giro = '';
    }
  }

  //FIN GIROS

  //FUNCIONES TRASLADOS

  SetMonedaTraslados(idMoneda){
    //console.log(idMoneda);

    if (idMoneda == '') {
      this.MonedaSeleccionadaTraslado = idMoneda;
      this.TrasladoModel.Valor = '';
      return;
    }
    
    let monedaObj = this.MonedasTraslados.find(x => x.Id_Moneda == idMoneda);
    if (!this.globales.IsObjEmpty(monedaObj)) {
      this.MonedaSeleccionadaTraslado = monedaObj.Nombre;
      //this.TrasladoModel.Valor = '';
    }
  }

  RealizarTraslado(formulario: NgForm, modal) {
    //formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    //let info = JSON.stringify(formulario.value);
    console.log(this.TrasladoModel);
    
    let info = JSON.stringify(this.TrasladoModel);
    let datos = new FormData();
    datos.append("modulo", 'Traslado_Caja');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/traslados/guardar_traslado_caja.php', datos).subscribe((data: any) => {
      //formulario.reset();
      this.ShowSwal('success', 'Registro Exitoso', 'Traslado guardado satisfactoriamente!');
      this.LimpiarModeloTraslados('creacion');
      this.volverTraslado();
      modal.hide();
      this.actualizarVista();
    });
  }

  AnularTraslado(id, estado) {
    let datos = new FormData();
    datos.append("modulo", 'Traslado_Caja');
    datos.append("id", id);
    datos.append("estado", estado);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.actualizarVista();
    });
  }

  esconder(estado, valor) {
    switch (estado) {
      case "Inactivo": {
        return false;
      }
      default: {
        return this.revisionDecision(valor);
      }
    }
  }

  editarTraslado(id) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { modulo: 'Traslado_Caja', id: id } }).subscribe((data: any) => {
      this.idTraslado = id;
      this.Traslado = data;
      this.TrasladoModel = data;
      console.log(this.TrasladoModel);
      
      this.ModalTrasladoEditar.show();
    });
  }

  decisionTraslado(id, valor) {
    let datos = new FormData();
    datos.append("modulo", 'Traslado_Caja');
    datos.append("id", id);
    datos.append("estado", valor);

    this.http.post(this.globales.ruta + 'php/pos/decision_traslado.php', datos).subscribe((data: any) => {
      this.actualizarVista();
    });
  }

  revisionDecision(valor) {
    switch (valor) {
      case "Si": {
        return false;
      }
      case "No": {
        return false;
      }
      default: {
        return true;
      }
    }
  }

  revisionDecisionLabel(valor) {
    switch (valor) {
      case "Si": {
        return true;
      }
      case "No": {
        return false;
      }
    }
  }

  LimpiarModeloTraslados(tipo:string){

    if (tipo == 'creacion') {
      this.TrasladoModel = {
        Id_Traslado_Caja: '',
        Funcionario_Destino: '',
        Id_Cajero_Origen: this.funcionario_data.Identificacion_Funcionario,
        Valor: '',
        Detalle: '',
        Id_Moneda: '',
        Estado: 'Activo',
        Identificacion_Funcionario: '',
        Aprobado: 'No'
      };

      this.CajerosTraslados = [];
      this.MonedasTraslados = [];
      this.MonedaSeleccionadaTraslado = '';
    }

    if (tipo == 'edicion') {
      this.TrasladoModel = {
        Id_Traslado_Caja: '',
        Funcionario_Destino: '',
        Id_Cajero_Origen: this.funcionario_data.Identificacion_Funcionario,
        Valor: '',
        Detalle: '',
        Id_Moneda: '',
        Estado: 'Activo',
        Identificacion_Funcionario: '',
        Aprobado: 'No'
      };
    }
  }

  //FIN TRASLADOS

  //FUNCIONES CORRESPONSAL BANCARIO

  GuardarCorresponsal(formulario: NgForm) {
    //formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario
    //let info = JSON.stringify(formulario.value);
    let info = JSON.stringify(this.CorresponsalModel);
    let datos = new FormData();
    datos.append("modulo", 'Corresponsal_Diario');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/corresponsaldiario/guardar_corresponsal_diario.php', datos).subscribe((data: any) => {
      this.LimpiarModeloCorresponsal('creacion');
      //formulario.reset();
      //(document.getElementById("GuardarCorresponsalBancario") as HTMLInputElement).disabled = false;
    });
  }

  /*ConsultarCorresponsal(id) {
    this.CorresponsalBancario = id;
    this.ValorCorresponsal = 0;
    this.DetalleCorresponsal = "";
    let datos = new FormData();
    //let funcionario = this.IdentificacionFuncionario;
    datos.append("Identificacion_Funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);
    datos.append("Id_Corresponsal_Bancario", id);
    this.http.post(this.globales.ruta + 'php/corresponsaldiario/lista_corresponsales.php', datos).subscribe((data: any) => {
      this.IdCorresponsal = data.Id_Corresponsal_Diario;
      this.ValorCorresponsal = data.Valor;
      this.DetalleCorresponsal = data.Detalle;
      //(document.getElementById("GuardarCorresponsalBancario") as HTMLInputElement).disabled = false;
    });
  }*/

  ConsultarCorresponsalDiario() {
    let id_corresponsal_bancario = this.CorresponsalModel.Id_Corresponsal_Bancario;
    let id_funcionario = this.CorresponsalModel.Identificacion_Funcionario;

    if (id_corresponsal_bancario == '') {
      //this.ShowSwal('warning', 'Alerta', 'Seleccione un corresponsal bancario!');
      this.LimpiarModeloCorresponsalParcial();
      return;
    }

    if (id_funcionario == '') {
      //this.ShowSwal('warning', 'Alerta', 'Seleccione un corresponsal bancario!');
      console.log("No hay funcionario asignado para corresponsal bancario!");
      return;
    }

    let parametros = {funcionario:id_funcionario, id_corresponsal_bancario:id_corresponsal_bancario};

    this.http.get(this.globales.ruta + 'php/corresponsaldiario/lista_corresponsales.php', {params: parametros}).subscribe((data: any) => {
      /*this.CorresponsalModel.Id_Corresponsal_Diario = data.Id_Corresponsal_Diario;
      this.CorresponsalModel.Valor = data.Valor;
      this.CorresponsalModel.Detalle = data.Detalle;*/
      if (data.length == 0) {
        this.LimpiarModeloCorresponsalParcial();
      }else{
        this.CorresponsalModel = data;
      }
      
      console.log(this.CorresponsalModel);
      
      //(document.getElementById("GuardarCorresponsalBancario") as HTMLInputElement).disabled = false;
    });
  }

  LimpiarModeloCorresponsalParcial(){
    this.CorresponsalModel.Valor = '';
    this.CorresponsalModel.Detalle = '';
    this.CorresponsalModel.Id_Corresponsal_Diario = '';
    this.CorresponsalModel.Fecha = '';
    this.CorresponsalModel.Hora = '';
  }

  LimpiarModeloCorresponsal(tipo:string){

    if (tipo == 'creacion') {
      this.CorresponsalModel = {
        Id_Corresponsal_Diario: '',
        Id_Corresponsal_Bancario: '',
        Detalle: '',
        Valor: '',
        Fecha: '',
        Hora: '',
        Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario
      };
    }

    if (tipo == 'edicion') {
      this.CorresponsalModel = {
        Id_Corresponsal_Diario: '',
        Id_Corresponsal_Bancario: '',
        Detalle: '',
        Valor: '',
        Fecha: '',
        Hora: '',
        Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario
      };
    }
  }

  //FIN CORRESPONSAL BANCARIO

  //FUNCIONES SERVICIOS EXTERNOS

  calcularComisionServicioExterno(value) {
    this.ServicioComision.forEach(element => {
      if ((parseFloat(element.Valor_Minimo) <= parseFloat(value)) && (parseFloat(value) < parseFloat(element.Valor_Maximo))) {
        this.ValorComisionServicio = element.Comision;
      }
    });
  }

  /*GuardarServicio(formulario: NgForm, modal) {
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Servicio');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/pos/guardar_pos.php', datos).subscribe((data: any) => {
      formulario.reset();
      modal.hide();
      this.volverServicio();
      this.actualizarVista();
    });
  }*/

  GuardarServicio(formulario: NgForm, modal, tipo:string = 'creacion') {
    /*formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    let info = JSON.stringify(formulario.value);*/

    let info = JSON.stringify(this.ServicioExternoModel);
    let datos = new FormData();
    datos.append("modulo", 'Servicio');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/serviciosexternos/guardar_servicio.php', datos).subscribe((data: any) => {
      //formulario.reset();
      this.LimpiarModeloServicios(tipo);
      this.ShowSwal('success', 'Registro Existoso', 'SE ha registrado exitosamente el servicio!');
      modal.hide();
      this.volverServicio();
      this.actualizarVista();
    });
  }

  AnulaServicio(id, estado) {
    let datos = new FormData();
    datos.append("modulo", 'Servicio');
    datos.append("id", id);
    datos.append("estado", estado);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.actualizarVista();
    });
  }

  esconderAnular(valor) {
    switch (valor) {
      case "Activo": {
        return true;
      }
      case "Inactivo": {
        return false;
      }
    }
  }

  editarServicio(id) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { id: id, modulo: "Servicio" } }).subscribe((data: any) => {
      /*this.Servicio = data;
      this.ValorComisionServicio = data.Comision;*/
      this.ServicioExternoModel = data;
      this.ModalServicioEditar.show();
    });
  }

  /*AsignarComisionServicioExterno(value) {
    this.http.get(this.globales.ruta + 'php/serviciosexternos/comision_servicios.php', {
      params: { valor: value }
    }).subscribe((data: any) => {
      this.ComisionServicio = data;
    });
  }*/

  AsignarComisionServicioExterno() {

    let valorAsignado = this.ServicioExternoModel.Valor;

    if (valorAsignado == '' || valorAsignado == undefined || valorAsignado == '0') {
      this.ShowSwal('warning', 'Alerta', 'El valor no puede estar vacio ni ser 0!');
      this.ServicioExternoModel.Valor = '';
      this.ServicioExternoModel.Comision = '';
      return;
    }

    this.http.get(this.globales.ruta + 'php/serviciosexternos/comision_servicios.php', {
      params: { valor: valorAsignado }
    }).subscribe((data: any) => {
      this.ServicioExternoModel.Comision = data;
    });
  }

  LimpiarModeloServicios(tipo:string){

    if (tipo == 'creacion') {
      this.ServicioExternoModel = {
        Id_Servicio: '',
        Servicio_Externo: '',
        Comision: '',
        Valor: '',
        Detalle: '',
        Estado: 'Activo',
        Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
        Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja
      };
    }

    if (tipo == 'edicion') {
      this.ServicioExternoModel = {
        Id_Servicio: '',
        Servicio_Externo: '',
        Comision: '',
        Valor: '',
        Detalle: '',
        Estado: 'Activo',
        Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
        Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja
      };
    }
  }

  //FIN SERVICIOS EXTERNOS

  //GENERALES


  CargarDatosModulos(modulo:string){
    switch (modulo) {
      case 'cambios':
        this.CargarDatosCambios();
        break;

      case 'transferencias':
        this.CargarDatosTransferencia();
        break;

      case 'giros':
        this.CargarDatosGiros();
        break;

      case 'traslados':
        this.CargarDatosTraslados();
        break;

      case 'corresponsal':
        this.CargarDatosCorresponsal();
        break;

      case 'servicios':
        this.CargarDatosServicios();
        break;
    
      default:
        this.ShowSwal('error', 'Modulo inexistente', 'Se ha intentado cargar un modulo que no existe, contacte con el administrador del sistema!');
        break;
    }
  }

  CargarDatosCambios(){
    //this.ShowSwal("warning", "Alerta", "Desarrollar");

    this.MonedasCambio = [];
    this.AsignarMonedasSinMonedaLocal(this.MonedasCambio);


  }

  CargarDatosTransferencia(){
    this.MonedasTransferencia = [];
    this.globales.Monedas.forEach(moneda => {
      if (moneda.Nombre != 'Pesos') {
        this.MonedasTransferencia.push(moneda);     
      }
    });

    this.ShowSwal("warning", "Alerta", "Terminar de cargar datos");
  }

  CargarDatosGiros(){
    this.ShowSwal("warning", "Alerta", "Desarrollar");
  }

  CargarDatosTraslados(){
    this.CajerosTraslados = [];
    this.globales.FuncionariosCaja.forEach(fc => {
      if (fc.Nombres != this.funcionario_data.Nombres) {
        this.CajerosTraslados.push(fc);     
      }
    });

    this.MonedasTraslados = [];
    this.MonedasTraslados = this.globales.Monedas;

    //console.log(this.CajerosTraslados);
    //console.log(this.MonedasTraslados);
    
  }

  AsignarMonedasSinMonedaLocal(listaMonedasVacia){
    this.globales.Monedas.forEach(moneda => {
      if (moneda.Nombre != 'Pesos') {
        listaMonedasVacia.push(moneda);     
      }
    });
  }

  CargarDatosCorresponsal(){
    this.ShowSwal("warning", "Alerta", "Desarrollar");
  }

  CargarDatosServicios(){
    //this.ShowSwal("warning", "Alerta", "Desarrollar");

    this.ListaServiciosExternos = this.globales.ServiciosExternos;
  }

  Municipios_Departamento(Departamento, tipo) {
    this.http.get(this.globales.ruta + 'php/genericos/municipios_departamento.php', { params: { id: Departamento } }).subscribe((data: any) => {
      switch (tipo) {
        case "Remitente": {
          this.GiroModel.Municipio_Remitente = '';
          this.Municipios_Remitente = data;
          //this.Departamento_Remitente = this.Departamentos[(Departamento) - 1].Nombre;
          break;
        }
        case "Destinatario": {
          this.GiroModel.Municipio_Destinatario = '';
          this.Municipios_Destinatario = data;
          //this.Departamento_Destinatario = this.Departamentos[(Departamento) - 1].Nombre;
          break;
        }

      }
    });
  }

  CerrarModal(modal, modulo:string){

    switch (modulo) {
      case 'cambios':
        
        break;

      case 'transferencias':
        
        break;

      case 'giros':
        
        break;

      case 'traslados':
        modal.hide();
        this.LimpiarModeloTraslados('edicion');
        break;

      case 'corresponsal':
        
        break;

      case 'servicios':
        
        break;
    
      default:
        break;
    }
  }

  //FIN GENERALES



  GuardarMontoInicial(formulario: NgForm, modal) {

    var peso = formulario.value.Monto_Inicio;
    var bolivares = formulario.value.Monto_Inicio_Bolivar;

    if (peso > 0 && bolivares > 0) {
      let info = JSON.stringify(formulario.value);
      let datos = new FormData();
      datos.append("datos", info);
      datos.append("id", JSON.parse(localStorage['User']).Identificacion_Funcionario);
      datos.append("caja", "5");
      datos.append("oficina", "16");
      datos.append("idDiario", this.IdDiario);
      this.http.post(this.globales.ruta + 'php/diario/apertura_caja.php', datos)
        .catch(error => {
          console.error('An error occurred:', error.error);
          this.errorSwal.show();
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          formulario.reset();
          this.confirmacionSwal.title = "Apertura de caja";
          this.confirmacionSwal.text = "Se ha realizado la apertura de caja exitosamente";
          this.confirmacionSwal.type = "success";
          this.confirmacionSwal.show();
          modal.hide();

        });
    } else {
      this.confirmacionSwal.title = "Ojo";
      this.confirmacionSwal.text = "No se puede aperturar caja con los valores digitados, por favor compruebe";
      this.confirmacionSwal.type = "warning";
      this.confirmacionSwal.show();
    }

  }


  HabilitarGuardar(valor) {
    console.log(valor);
    //return;
    if (valor.length > 0) {
      if (this.Recibe == 'Cliente') {
        (document.getElementById("BotonMovimientoGuardar") as HTMLInputElement).disabled = false;
      } else {
        (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = false;
      }
    } else {
      if (this.Recibe == 'Cliente') {
        (document.getElementById("BotonMovimientoGuardar") as HTMLInputElement).disabled = true;
      } else {
        (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
      }
    }

  }

  bancosDestinatarios() {
    this.http.get(this.globales.ruta + '/php/destinatarios/cuenta_bancaria_destinatario.php').subscribe((data: any) => {
      this.DestinatarioCuenta = data;
    });
  }

  ngAfterViewInit() {
    if (this.recibeParaDefault == "Transferencia") {
      this.CambiarTasa(1);
      this.MonedaTransferencia = 1;
      
    }

    //(document.getElementById("GuardarCorresponsalBancario") as HTMLInputElement).disabled = true;

  }

  search_destino = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 4 ? []
        : this.Destinatarios.filter(v => v.Id_Destinatario.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  formatter_destino = (x: { Id_Destinatario: string }) => x.Id_Destinatario;

  search_remitente = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 4 ? []
        : this.Remitentes.filter(v => v.Id_Transferencia_Remitente.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  formatter_remitente = (x: { Id_Transferencia_Remitente: string }) => x.Id_Transferencia_Remitente;

  search_cuenta = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 4 ? []
        : this.Remitentes.filter(v => v.Numero_Cuenta.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  formatter_cuenta = (x: { Numero_Cuenta: string }) => x.Numero_Cuenta;

  search_tercero_credito = (text$: Observable<string>) =>        
    text$
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap( term => 
        this.http.get(this.globales.ruta+'php/terceros/filtrar_terceros.php', {params: {nombre:term}})
        .map(response => response)
        .do(data => console.log(this.tercero_credito))
      )
    );
  formatter_tercero_credito = (x: { Nombre: string }) => x.Nombre;

  muestra_tabla(id) {
    var tot = document.getElementsByClassName('modulos').length;
    for (let i = 0; i < tot; i++) {
      var id2 = document.getElementsByClassName('modulos').item(i).getAttribute("id");
      document.getElementById(id2).style.display = 'none';

      this.volverCambioEfectivo();
      this.volverReciboTransferencia();
      this.volverReciboGiro();
      this.volverTraslado();
      this.volverServicio();
      this.volverReciboServicio();

    }
    document.getElementById(id).style.display = 'block';
  }

  AutoCompletarDestinatario(modelo, i, listaDestinatarios) {
    
    /*if (modelo.Cuentas != undefined) {
      this.Envios[i].Numero_Documento_Destino = modelo.Id_Destinatario;
      this.Envios[i].Nombre = modelo.Nombre;
      this.Envios[i].Cuentas = modelo.Cuentas;
      this.Envios[i].esconder = true;
    } else {
      this.Envios[i].esconder = false;
    }*/

    

    let validacion = this.BuscarCedulaRepetida(modelo, i, listaDestinatarios);
    if (typeof(modelo) == 'object') {
      if(validacion){
        return;
      };

      if (modelo.Cuentas != undefined) {
        listaDestinatarios[i].Numero_Documento_Destino = modelo.Id_Destinatario;
        listaDestinatarios[i].Nombre_Destinatario = modelo.Nombre;
        listaDestinatarios[i].Cuentas = modelo.Cuentas;
        listaDestinatarios[i].esconder = true;
      } else {
        listaDestinatarios[i].esconder = false;
      }
    }else if(typeof(modelo) == 'string'){
      if(modelo == ''){
        listaDestinatarios[i].Numero_Documento_Destino = '';
        listaDestinatarios[i].Id_Destinatario_Cuenta = '';
        listaDestinatarios[i].Nombre_Destinatario = '';
        listaDestinatarios[i].Valor_Transferencia = '';
        listaDestinatarios[i].Cuentas = [];
      }
    }
  }

  BuscarCedulaRepetida(object, index, dest:any){
    let existe = false;

    for (let ind = 0; ind < dest.length; ind++) {
      
      if(ind != index){
        if(dest[ind].Numero_Documento_Destino == object.Id_Destinatario){
        
          this.confirmacionSwal.title = "Atención";
          this.confirmacionSwal.text = "Ya tiene un destinatario agregado con la misma cédula!";
          this.confirmacionSwal.type = "warning";
          this.confirmacionSwal.show();

          dest[index].id_destinatario_transferencia = '';
          dest[index].Numero_Documento_Destino = '';
          dest[index].Nombre_Destinatario = '';
          dest[index].Cuentas = [];
          dest[index].esconder = false;
          
          existe = true;
          break;
        };
      }
    }

    return existe;
  }

  CrearDestinatrioModal(value, pos) {

    let v = this.TransferenciaModel.Destinatarios[pos].Numero_Documento_Destino;

    if(v == ''){
      return;
    }

    this.http.get(this.globales.ruta+'php/destinatarios/validar_existencia_destinatario.php', { params: {id_destinatario:v}}).subscribe((data)=>{
      if (data == 0) {
        var longitud = this.LongitudCarateres(v);
        if (longitud > 6) {
          this.IdentificacionCrearDestinatario = v;
          this.ModalCrearDestinatarioTransferencia.show();
          this.Id_Destinatario = v;
          this.Lista_Destinatarios = [{
            Id_Pais: '2',
            Id_Banco: '',
            Bancos: [],
            Id_Tipo_Cuenta: '',
            Numero_Cuenta: '',
            Otra_Cuenta: '',
            Observacion: ''
          }];
        }else if(longitud < 6){

        }
      }
    });

    /*this.posiciontemporal = pos;
    var encontrar = this.Destinatarios.findIndex(x => x.Id_Destinatario === value);

    if (encontrar == -1) {
      var longitud = this.LongitudCarateres(value);
      if (longitud > 6) {
        this.IdentificacionCrearDestinatario = value;
        this.ModalCrearDestinatarioTransferencia.show();
        this.Id_Destinatario = value;
        this.Lista_Destinatarios = [{
          Id_Pais: '2',
          Id_Banco: '',
          Bancos: [],
          Id_Tipo_Cuenta: '',
          Numero_Cuenta: '',
          Otra_Cuenta: '',
          Observacion: ''
        }];
      }
      this.Bancos_Pais(2, 0);
    }*/
  }

  LongitudCarateres(i) {
    return parseInt(i.length);
  }

  BuscarCNE(valor) {

    var cedula = this.Id_Destinatario;
    if (cedula == undefined) {
      cedula = (document.getElementById("idDestinatario") as HTMLInputElement).value;
    }

    switch (valor) {
      case "V": {
        //this.frame = true;
        this.urlCne = "http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=" + cedula;
        window.open("http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=" + cedula, '_blank');
        break;
      }
      case "E": {
        //this.frame = true;
        this.urlCne = "http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=E&cedula=" + cedula;
        window.open("http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=E&cedula=" + cedula, '_blank');
        break;
      }
      default: {
        this.frame = false;
      }
      /*if (window.frames['myframe'] && !userSet){
         this.setAttribute('data-userset', 'true');
         frames['myframe'].location.href='http://test.com/hello?uname='+getUserName();
     }*/
    }


  }

  buscarRiff() {
    this.urlRiff = "http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp";
    //this.frameRiff = !this.frameRiff;
    window.open("http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp", '_blank');
  }

  recargarBancos(i, id) {
    this.http.get(this.globales.ruta + 'php/pos/cuentas_destinatarios.php', { params: { id: id } }).subscribe((data: any) => {
      this.Envios[i].Cuentas = data.Numero_Cuenta;
      this.ActivarEdicion = true;
    });
  }

  recargarDestinatario() {
    this.http.get(this.globales.ruta + 'php/pos/lista_destinatarios.php').subscribe((data: any) => {
      this.Destinatarios = data;
    });
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  ResetValues() {
    //////////console.log("resetear valores");
    this.PrecioSugeridoEfectivo = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Bolivares")].Sugerido_Venta;
    this.MonedaTransferencia = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Bolivares")].Nombre;
    this.MonedaRecibida = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Pesos")].Nombre;
  }

  GuardarMovimiento(formulario: NgForm) {

    formulario.value.Id_Oficina = 5;
    formulario.value.Id_Caja = 4;
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    formulario.value.Tipo_Oficina = localStorage['Tipo_Oficina'];
    formulario.value.Cantidad_Transferida = this.entregar;
    var index = this.Monedas.findIndex(x=>x.Id_Moneda === formulario.value.Moneda_Destino);
    formulario.value.Moneda_Destino = this.Monedas[index].Nombre;
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("datos", info); 
    this.http.post(this.globales.ruta + 'php/pos/movimiento.php', datos)
    //this.http.post(this.globales.ruta + 'php/transferencias/pruebas_envio_transferencia.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.opcionDefaultFormaPago = "Efectivo";
        this.opcionTipoTransferencia  = "Transferencia";
        this.seleccioneClienteDefault = "";
        this.movimientoExitosoSwal.show();
        //////////console.log(data);
        this.TipoPagoTransferencia("Efectivo");
        this.Transferencia1 = true;
        this.Transferencia2 = false;
        this.actualizarVista();
        this.VerificarTipoTransferencia();
      });
  }

  AutoCompletarCuenta(modelo) {
    if (modelo) {
      if (modelo.length > 0) {
        this.CuentasDestinatario = this.CuentasDestinatario.filter(number => number.Id_Destinatario.slice(0, modelo.length) == modelo);
      }
      else {
        this.CuentasDestinatario = null;
      }
    }
  }

  LlenarValoresDestinatario(destinatario, index) {
    this.Indice = index;
    this.CuentasDestinatario = null;
    if (destinatario.length == 0) {
      return;
    }
    if (destinatario.length < 5 && destinatario.length > 0) {
      this.warnSwal.show();
    }
    else {
      this.http.get(this.globales.ruta + 'php/pos/cuentas_destinatarios.php', { params: { id: destinatario, nombre: destinatario } }).subscribe((data: any) => {

        if (data.length == 0) {
          this.Envios[index].Numero_Documento_Destino = 0;
          this.CrearDestinatario(destinatario);
        }
        else {
          this.Envios[index].Cuentas = data;
          this.CuentasDestinatario = data;
          (document.getElementById("Numero_Documento_Destino" + index) as HTMLInputElement).value = data[0].Id_Destinatario;
          this.Envios.push({
            Destino: '',
            Numero_Documento_Destino: '',
            Nombre: '',
            Id_Destinatario_Cuenta: '',
            Valor_Transferencia_Bolivar: 0,
            Valor_Transferencia_Peso: 0,
            Cuentas: [],
            esconder: false,
            disabled: false
          });
        }
      });
    }
  }

  AutoSumaBolivares(pos, valor) {
    var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;
    this.Envios[pos].Valor_Transferencia_Peso = (parseInt(valor) * parseInt(divisor));
    this.Envios[pos].Valor_Transferencia_Bolivar = Math.round(this.Envios[pos].Valor_Transferencia_Peso / parseInt(divisor));
    this.AutoSuma(pos);
  }

  AutoSumaPeso(pos, valor) {
    var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;
    this.Envios[pos].Valor_Transferencia_Bolivar = Math.round(parseInt(valor) / parseInt(divisor));
    this.Envios[pos].Valor_Transferencia_Peso = (this.Envios[pos].Valor_Transferencia_Bolivar * parseInt(divisor));
    this.AutoSuma(pos);
  }



  validarCamposBolivares(valor) {
    var longitud = 0;
    longitud = this.LongitudCarateres(valor);
    if (longitud > 0) {
      (document.getElementById("Valor_Transferencia_Bolivar0") as HTMLInputElement).disabled = false;
    } else {
      (document.getElementById("Valor_Transferencia_Bolivar0") as HTMLInputElement).disabled = true;
    }

  }

  EliminarDestinatario(index) {
    if (index > 0) {
      this.Envios.splice(index, 1);
    }
  }

  EliminarDestinatarioTransferencia(index) {
      this.TransferenciaModel.Destinatarios.splice(index, 1);
  }

  LlenarValoresRemitente(remitente) {
    this.DatosRemitente = [];
    if (remitente.length == 0) {
      return;
    }
    if (remitente.length < 5 && remitente.length > 0) {
      this.warnSwal.show();
    }
    else {
      this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { modulo: 'Transferencia_Remitente', id: remitente } }).subscribe((data: any) => {
        if (data.length == 0) {
          this.NumeroDocumentoR = 0;
          this.CrearRemitente(remitente);
        }
        else {
          this.DatosRemitente = data;
        }
      });
    }
  }

  CrearRemitente(remitente) {
    this.ModalRemitente.show();
    this.IdRemitente = remitente;
  }


  CrearDestinatario(destinatario) {
    this.Cuentas = [{
      Id_Destinatario: '',
      Id_Pais: "",
      Id_Banco: '',
      Numero_Cuenta: '',
      Id_Tipo_Cuenta: ''
    }];
    this.ModalDestinatario.show();
    for (let i = 0; i < this.Cuentas.length; ++i) {
      this.Cuentas[i].Id_Destinatario = destinatario;
    }
    this.Cedula = destinatario;
  }

  AutoSeleccionarBanco(identificador: string, indice) {
    if (this.Bancos.filter(banco => banco.Identificador == identificador).length > 0) {
      this.Cuentas[indice].Banco = this.Bancos.filter(banco => banco.Identificador == identificador)[0].Nombre;
    }
  }

  AgregarFormCuenta() {
    let agregar: boolean = true;
    for (let i = 0; i < this.Cuentas.length; ++i) {
      if (this.Cuentas[i].Banco === "" || this.Cuentas[i].Pais === "" || this.Cuentas[i].Numero_Cuenta === "") {
        agregar = false;
        return;
      }
    }
    if (agregar) {
      this.Cuentas.push({
        Id_Destinatario: this.Cedula,
        Id_Pais: "",
        Id_Banco: '',
        Numero_Cuenta: '',
        Id_Tipo_Cuenta: ''
      });
    }
  }

  EliminarFormCuenta(index) {
    this.Cuentas.splice(index, 1);
  }

  recargarVistaDestinatario(identificador, i) {
    this.http.get(this.globales.ruta + 'php/pos/detalle_lista_destinatario.php', { params: { id: identificador } }).subscribe((data: any) => {
      this.Envios[i].Cuentas = data[0].Cuentas;
      this.Envios[i].Numero_Documento_Destino = data[0].Id_Destinatario;
      this.Envios[i].Nombre = data[0].Nombre;
      this.Envios[i].esconder = true;
    });
  }

  GuardarDestinatario(formulario: NgForm, modal:any = null) {

    this.Lista_Destinatarios.forEach((element, index) => {
      if (element.Numero_Cuenta == "") {
        this.Lista_Destinatarios.splice(index, 1);
      }
    });

    let info = JSON.stringify(formulario.value);
    let cuentas = JSON.stringify(this.Lista_Destinatarios);
    let datos = new FormData();
    datos.append("datos", info);
    datos.append("destinatario", cuentas);

    this.http.post(this.globales.ruta + 'php/destinatarios/guardar_destinatario.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        //autocompletar destinatario
        var i = this.posiciontemporal
        this.recargarVistaDestinatario(this.IdentificacionCrearDestinatario, i);

        this.destinatarioCreadoSwal.show();
        formulario.reset();
        modal.hide();
        this.recargarDestinatario();
        this.Lista_Destinatarios = [{
          Id_Pais: '2',
          Id_Banco: '',
          Bancos: [],
          Id_Tipo_Cuenta: '',
          Numero_Cuenta: '',
          Otra_Cuenta: '',
          Observacion: ''
        }];

      });
    //this.actualizarVista();
  }

  GuardarRemitente(formulario: NgForm) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", "Transferencia_Remitente");
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        //////////console.log(data);
        this.LlenarValoresRemitente(formulario.value.Id_Transferencia_Remitente);
        this.ModalRemitente.hide();
        this.remitenteCreadoSwal.show();
        formulario.reset();
      });
  }

  RealizarCambio(value, accion) {
    //////////console.log(value);    
    if (this.MonedaRecibida != this.MonedaTransferencia) {
      switch (accion) {
        case "transferir":
          this.CantidadTransferida = value * this.PrecioSugeridoEfectivo;
          break;

        case "recibir":
          this.CantidadRecibida = value / this.PrecioSugeridoEfectivo;
          break;
      }
    }
  }

  SeleccionarMonedaRecibe(moneda) {
    this.MonedaRecibe = moneda;
    var origen = ((document.getElementById("Moneda_Origen") as HTMLInputElement).value);

    if (parseInt(origen) > 0) {
      this.PrecioSugeridoEfectivo = this.Monedas[(parseInt(origen) - 1)].Sugerido_Venta;
    } else {
      this.PrecioSugeridoEfectivo = 0;
    }
  }

  CalcularTotal(value) {
    this.ValorTotal = Number.parseInt(value) + this.Costo;
    this.ValorEntrega = Number.parseInt(value) - this.Costo;
  }


  

  


  // --------------------------------------------------------------------------- //  

  // aquí ando haciendo mis metodos


  // --------------------------------------------------------------------------- //

  MonedaOrigenCambio = [];
  MonedaOrigenDestino = [];
  FuncionariosCajaDestino = [];
  TerceroCliente = [];
  //MonedasTransferencia = [];
  MonedasOrigen = [];
  TransferenciasAnuladas =[];
  RemitentesTransferencias = [];
  CuentasBancarias =[];
  actualizarVista() {
    this.Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario
    this.MonedaOrigenCambio = [];
    this.MonedaOrigenDestino = [];

    this.http.get(this.globales.ruta + 'php/cambio/lista_cambios.php', { params: { modulo: 'Cambio' , funcionario: JSON.parse(localStorage['User']).Identificacion_Funcionario } }).subscribe((data: any) => {
      this.Cambios = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Documento_Extranjero' } }).subscribe((data: any) => {
      this.TipoDocumentoExtranjero = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Cuenta' } }).subscribe((data: any) => {
      this.Cuentas = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Documento' } }).subscribe((data: any) => {
      this.Documentos = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Corresponsal_Bancario' } }).subscribe((data: any) => {
      this.CorresponsalesBancarios = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio_Externo' } }).subscribe((data: any) => {
      this.ServiciosExternos = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Caja' } }).subscribe((data: any) => {
      this.Cajas = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda' } }).subscribe((data: any) => {
      this.Monedas = data;
      this.MonedasTransferencia = [];
      this.MonedasOrigen = [];
      data.forEach(element => {
        if (element.Nombre != "Pesos") {
          this.MonedasTransferencia.push(element);
        }

        if (element.Nombre == "Pesos") {
          this.MonedasOrigen.push(element)
        }

      });

    });

    this.MonedaOrigenCambio = [];
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda' } }).subscribe((data: any) => {
      data.forEach(element => {
        if (element.Nombre != "Pesos") {
          this.MonedaOrigenCambio.push(element);
        }
      });
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Funcionario' } }).subscribe((data: any) => {
      this.Funcionarios = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Cuenta' } }).subscribe((data: any) => {
      this.TipoCuentas = data;
    });
    this.http.get(this.globales.ruta + 'php/pos/lista_destinatarios.php').subscribe((data: any) => {
      this.Destinatarios = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Transferencia_Remitente' } }).subscribe((data: any) => {
      this.Remitentes = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Pais' } }).subscribe((data: any) => {
      this.Paises = data;
    });
    this.http.get(this.globales.ruta + 'php/pos/lista_clientes.php', { params: { modulo: 'Tercero' } }).subscribe((data: any) => {
      this.Clientes = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tercero' } }).subscribe((data: any) => {
      this.TerceroCliente = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Banco' } }).subscribe((data: any) => {
      this.Bancos = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { modulo: 'Oficina', id: '5' } }).subscribe((data: any) => {
      this.LimiteOficina = data.Limite_Transferencia;
    });

    this.http.get(this.globales.ruta + 'php/pos/lista_recibos_transferencia.php' , {params: {funcionario: JSON.parse(localStorage['User']).Identificacion_Funcionario} } ).subscribe((data: any) => {
      this.Transferencia = data;
    });

    this.http.get(this.globales.ruta + 'php/giros/listar_giros_funcionario.php', { params: { modulo: 'Giro', funcionario: JSON.parse(localStorage['User']).Identificacion_Funcionario } }).subscribe((data: any) => {
      this.Giros = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Departamento' } }).subscribe((data: any) => {
      this.Departamentos = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Giro_Comision' } }).subscribe((data: any) => {
      this.GiroComision = data;
    });

    this.http.get(this.globales.ruta + 'php/pos/lista_cajeros_sistema.php').subscribe((data: any) => {
      this.FuncionariosCaja = data;
      this.FuncionariosCajaDestino = data;

      var index = this.FuncionariosCajaDestino.findIndex(x => x.Identificacion_Funcionario === JSON.parse(localStorage['User']).Identificacion_Funcionario);
      this.FuncionariosCajaDestino.splice(index, 1)
    });

    this.http.get(this.globales.ruta + 'php/pos/listar_traslado_funcionario.php', { params: { id: JSON.parse(localStorage['User']).Identificacion_Funcionario } }).subscribe((data: any) => {
      this.Traslados = data;
    });

    this.http.get(this.globales.ruta + 'php/pos/traslado_recibido.php', { params: { id: JSON.parse(localStorage['User']).Identificacion_Funcionario } }).subscribe((data: any) => {
      this.TrasladosRecibidos = data;

    });


    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio_Comision' } }).subscribe((data: any) => {
      this.ServicioComision = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/listar_fecha_hoy.php', { params: { modulo: 'Servicio' } }).subscribe((data: any) => {
      this.Servicios = data;
    });

    this.http.get(this.globales.ruta + 'php/pos/lista_clientes.php', { params: { modulo: 'Tercero' } }).subscribe((data: any) => {
      //this.Tercero = data;
      this.Tercero = [];
      data.forEach(element => {
        if (element.Cupo != "0") {
          this.Tercero.push(element);
        }
      });
    });

    this.http.get(this.globales.ruta + 'php/bancos/lista_bancos_colombianos.php', { params: { modulo: 'Cuenta_Bancaria' } }).subscribe((data: any) => {
      this.CuentaBancaria = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda' } }).subscribe((data: any) => {
      this.MonedaOrigenDestino = [];
      data.forEach(element => {
        if (element.Nombre != "Pesos") {
          this.MonedaOrigenDestino.push(element);
        }

      });
    });


    this.http.get(this.globales.ruta + '/php/giros/giros_aprobados.php', { params: { funcionario: JSON.parse(localStorage['User']).Identificacion_Funcionario } }).subscribe((data: any) => {
      this.GirosAprobados = data;
    });

    this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_anuladas.php').subscribe((data: any) => {
      this.TransferenciasAnuladas = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Transferencia_Remitente' } }).subscribe((data: any) => {
      this.RemitentesTransferencias = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Cuenta_Bancaria' } }).subscribe((data: any) => {
      this.CuentasBancarias = data;
    });

    this.CambiarTasa(1);

  }

  CambiarTasa(value) {
    this.http.get(this.globales.ruta + 'php/pos/buscar_tasa.php', {
      params: { id: value }
    }).subscribe((data: any) => {
      this.MaxEfectivo = parseInt(data.Dependencia[0].Valor);
      this.MinEfectivo = parseInt(data.Dependencia[1].Valor);
      this.PrecioSugeridoEfectivo = data.Dependencia[2].Valor;
      this.PrecioSugeridoEfectivo1 = data.Dependencia[2].Valor;

      this.MaxCompra = parseInt(data.Dependencia[3].Valor);
      this.MinCompra = parseInt(data.Dependencia[4].Valor);
      this.PrecioSugeridoCompra = data.Dependencia[5].Valor;

      this.maximoTransferencia = data.Dependencia[6].Valor;
      this.minimoTransferencia = data.Dependencia[7].Valor;
      this.PrecioSugeridoTransferencia = data.Dependencia[8].Valor;
      //this.MonedaDestino = data.Moneda[0].Nombre;
    });
  }

  validarPrecioSugerido(valor) {

    switch (this.Venta) {
      case true: { //vendo
        if (this.MaxEfectivo < parseInt(valor)) {
          this.PrecioSugeridoEfectivo = this.PrecioSugeridoEfectivo1;
          this.confirmacionSwal.title = "Error"
          this.confirmacionSwal.text = "El precio sugerido supera el máximo de efectivo"
          this.confirmacionSwal.type = "error"
          this.confirmacionSwal.show();
        }
        break;
      }
      case false: {
        //compro
        if (this.MaxCompra < parseInt(valor)) {
          this.PrecioSugeridoEfectivo = this.PrecioSugeridoEfectivo1;
          this.confirmacionSwal.title = "Error"
          this.confirmacionSwal.text = "El precio sugerido supera el máximo de compra"
          this.confirmacionSwal.type = "error"
          this.confirmacionSwal.show();
        }
        break;
      }
    }
  }

  Origen(moneda) {

    /*var index = this.MonedaOrigenDestino.findIndex(x => x.Id_Moneda === moneda);
    this.MonedaOrigenDestino.splice(index, 1)*/

    this.http.get(this.globales.ruta + 'php/pos/buscar_tasa.php', {
      params: { id: moneda }
    }).subscribe((data: any) => {
      //this.MonedaOrigen = data.Moneda[0].Nombre
      if (moneda == 2) {
        this.MonedaTasaCambio = true;
        this.MonedaComision = false;
      } else {
        this.MonedaTasaCambio = false;
        this.MonedaComision = true;
      }
    });

    var index = this.MonedaOrigenDestino.findIndex(x => x.Id_Moneda === moneda);
    this.MonedaOrigen = this.MonedaOrigenCambio[index].Nombre;
  }

  formulaCambio(valor) {
    if (this.Venta == false) {
      var origen = (document.getElementById("Origen") as HTMLInputElement).value;

      if (origen == "1") {
        var resultadoBolivares = valor / this.PrecioSugeridoEfectivo;
        this.entregar = resultadoBolivares;
      }

      if (origen == "2") {
        var resultadoPeso = valor * this.PrecioSugeridoEfectivo;
        this.entregar = resultadoPeso.toFixed(2);
      }


    } else {
      //venta
      //PrecioSugeridoEfectivo 
    }



  }

  RealizarCambioMoneda(value, tipo) {

    //////////console.log(value + " " +this.MonedaTasaCambio +  " " + this.MonedaComision)
    switch (tipo) {
      case 'cambia': {

        var divisor = 1;
        if (parseInt(value) > 0) {
          if (this.MonedaTasaCambio == true) {
            divisor = this.PrecioSugeridoEfectivo;
          } else {
            divisor = this.PrecioSugeridoTransferencia;
          }

          this.entregar = (parseInt(value) / divisor);
          this.entregar = this.entregar.toFixed(2);
          (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = false;
        } else {
          if (this.entregar == 0 || this.entregar == "" || this.entregar == undefined) {
            (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = true;
          }
        }
        break;
      }
      case 'entrega': {
        var divisor = 1;
        if (parseInt(value) > 0) {
          if (this.MonedaTasaCambio == true) {
            divisor = this.PrecioSugeridoEfectivo;
          } else {
            divisor = this.PrecioSugeridoTransferencia;
          }
          this.cambiar = (parseInt(value) * divisor);
          (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = false;
        } else {
          if (this.cambiar == 0 || this.cambiar == "" || this.cambiar == undefined) {
            (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = true;
          }
        }
        break;
      }
    }
  }

  RealizarCambioMonedaTransferencia(value, tipo) {
    switch (tipo) {
      case 'cambia': {
        var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;
        if (parseInt(value) > 0) {
          this.entregar = (parseInt(value) / parseInt(divisor));
          this.entregar = this.entregar.toFixed(2);
          if (this.Envios.length > 0) {
            //reviso si hay valores para realizar la suma
            var suma = 0;
            this.Envios.forEach((element, index) => {
              suma += element.Valor_Transferencia_Peso;
            });
            if (suma == 0) {
              ////////console.log((document.getElementById("Cantidad_Recibida") as HTMLInputElement).value)
              this.Envios[0].Valor_Transferencia_Peso = (document.getElementById("Cantidad_Recibida") as HTMLInputElement).value;
              this.NuevoDestinatario(0, 'Peso')
            }

            if (suma == parseInt(value)) {

              if (this.Recibe != 'Cliente') {
                (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = false;
              }

            } else {

              if (this.Recibe != 'Cliente') {
                this.confirmacionSwal.title = "Valores no coinciden";
                this.confirmacionSwal.text = "Los valores a entregar no coinciden con la sumatoria de los valores de los destiantarios";
                this.confirmacionSwal.type = "error";
                //this.confirmacionSwal.show();
                (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
              }
            }
          }
          var formaPago = (document.getElementById("Forma_Pago") as HTMLInputElement).value;
          if (formaPago == "Credito") {
            var idTercero = (document.getElementById("Id_Tercero") as HTMLInputElement).value;
            if (idTercero != "") {
              var indice = this.Tercero.findIndex(x => x.Id_Tercero === idTercero);
              if (indice > -1) {
                var cupo = this.Tercero[indice].Cupo;
                if (parseInt(value) > parseInt(cupo)) {
                  this.confirmacionSwal.title = "Valor excedido";
                  this.confirmacionSwal.text = "El valor digitado en pesos supera el cupo que tiene el cliente en este momento (" + cupo + ")";
                  this.confirmacionSwal.type = "error";
                  this.confirmacionSwal.show();
                  this.entregar = 0;
                  this.cambiar = 0;
                }
              }
            }
          }
        }
        break;
      }
      case 'entrega': {
        var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;
        if (parseInt(value) > 0) {
          this.cambiar = (parseInt(value) * parseInt(divisor));
          if (this.Envios.length > 0) {
            //reviso si hay valores para realizar la suma
            var suma = 0;
            this.Envios.forEach((element, index) => {
              suma += element.Valor_Transferencia_Bolivar;
            });
            if (suma == 0) {
              this.Envios[0].Valor_Transferencia_Bolivar = (document.getElementById("Cantidad_Transferida") as HTMLInputElement).value;
              this.NuevoDestinatario(0, 'Bolivar')
            }
          }
        }
        break;
      }
    }
  }

  

  CambiarVista(tipo) {

    switch (tipo) {
      case "Compra": {
        this.Venta = false;
        this.TextoBoton = "Comprar"
        this.Tipo = "Compra";
        this.tituloCambio = "Compras"
        this.CambioModel.Moneda_Destino = '2';
        /*this.defectoDestino = "2";
        this.defectoOrigen = ""*/
        break;
      }
      case "Venta": {
        this.Venta = true;
        this.TextoBoton = "Vender"
        this.Tipo = "Venta";
        this.tituloCambio = "Ventas"
        this.CambioModel.Moneda_Origen = '2';
        /*this.defectoDestino = "";
        this.defectoOrigen = "2"*/
        break;
      }
      case "Transferencia": {
        this.Transferencia1 = false;
        this.Transferencia2 = true;
        break;
      }
      case "Cambio": {
        this.Cambios2 = true;
        this.Cambios1 = false;
        break;
      }
      case "Giro": {
        this.Giro2 = true;
        this.Giro1 = false;
        break;
      }
      case "Traslado": {
        this.Traslado2 = true;
        this.Traslado1 = false;
        break;
      }
      case "Servicio": {
        this.Servicio2 = true;
        this.Servicio1 = false;
        break;
      }
    }
  }


  EditarDestinatario(id, pos) {
    this.http.get(this.globales.ruta + 'php/destinatarios/editar_destinatario.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      ////////console.log(data.destinatario);
      this.Detalle_Destinatario = data.destinatario;
      this.Lista_Destinatarios = data.DestinatarioCuenta;

      for (var i = 0; i < this.Lista_Destinatarios.length; i++) {
        this.Bancos_Pais(this.Lista_Destinatarios[i].Id_Pais, i);
      }

      this.Identificacion = id;
      //this.AgregarFila();
      this.Bancos_Pais(2, 1);
      this.ModalEditarDestinatario.show();
      this.posiciontemporal = pos;
    });
  }


  validarBanco(i, valor) {
    var idpais = ((document.getElementById("Id_Pais_Destinatario" + i) as HTMLInputElement).value)

    if (parseInt(idpais) == 2) {
      var longitud = this.LongitudCarateres(valor);
      if (longitud != 20) {
        this.botonDestinatario = false;
        this.confirmacionSwal.title = "Banco no valido";
        this.confirmacionSwal.text = "Digite correctamente el número del banco";
        this.confirmacionSwal.type = "error"
        this.confirmacionSwal.show();
      }

      var indice = this.DestinatarioCuenta.findIndex(x => x.Numero_Cuenta === valor);
      if (indice > -1) {
        this.confirmacionSwal.title = "Cuenta Repetida";
        this.confirmacionSwal.text = "Esta cuenta fue creada anteriormente y le pertenece a " + this.DestinatarioCuenta[indice].Nombre;
        this.confirmacionSwal.type = "error"
        this.confirmacionSwal.show();
        ((document.getElementById("BotonGuardarDestinatarioTransferencia") as HTMLInputElement).disabled) = true;
      } else {
        ((document.getElementById("BotonGuardarDestinatarioTransferencia") as HTMLInputElement).disabled) = false;
      }
    }
  }

  AgregarFila(i, valor) {

    var idpais = ((document.getElementById("Id_Banco" + i) as HTMLInputElement).value)

    if (valor != "" && idpais != "") {
      var pos = parseInt(i) + 1;
      if (this.Lista_Destinatarios[pos] == undefined) {
        this.Lista_Destinatarios.push({
          Id_Pais: '2',
          Id_Banco: '',
          Bancos: [],
          Id_Tipo_Cuenta: '',
          Numero_Cuenta: '',
          Otra_Cuenta: '',
          Observacion: ''
        });

        this.Bancos_Pais(2, pos);
      }
    }

  }

  Bancos_Pais(Pais, i) {
    this.http.get(this.globales.ruta + 'php/genericos/bancos_pais.php', { params: { id: Pais } }).subscribe((data: any) => {
      this.Lista_Destinatarios[i].Bancos = data;
    });
  }

  verificarChequeo(pos, check) {
    var checkeo = (document.getElementById("checkeo_" + pos) as HTMLInputElement).checked;

    switch (check) {
      case true: {
        ((document.getElementById("Observacion_Destinatario" + pos) as HTMLInputElement).disabled) = false;
        ((document.getElementById("Otra_Cuenta_Destinatario" + pos) as HTMLInputElement).disabled) = false;
        break;
      }
      case false: {
        ((document.getElementById("Observacion_Destinatario" + pos) as HTMLInputElement).disabled) = true;
        ((document.getElementById("Otra_Cuenta_Destinatario" + pos) as HTMLInputElement).disabled) = true;
        break;
      }
    }

  }

  GuardarDestinatarioEditar(formulario: NgForm, modal: any) {
    var identificacion = ((document.getElementById("Id_Destinatario") as HTMLInputElement).value);
    let info = JSON.stringify(formulario.value);
    let bancos = JSON.stringify(this.Lista_Destinatarios);
    let datos = new FormData();
    datos.append("modulo", 'Destinatario');
    datos.append("datos", info);
    datos.append("destinatario", bancos);
    this.http.post(this.globales.ruta + 'php/destinatarios/guardar_destinatario.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        this.Lista_Destinatarios = [{
          Id_Pais: '',
          Id_Banco: '',
          Bancos: [],
          Id_Tipo_Cuenta: '',
          Numero_Cuenta: '',
          Otra_Cuenta: '',
          Observacion: ''
        }];

        this.actualizarVista();
        this.AutoCompletarDestinatario(identificacion, this.posiciontemporal, this.Envios);
        //this.recargarBancos(this.posiciontemporal,identificacion)
        this.confirmacionSwal.title = "Actualización exitosa";
        this.confirmacionSwal.text = "Se ha actualizado correctamente el destinatario";
        this.confirmacionSwal.type = "success";
        this.confirmacionSwal.show();
        // this.posicionTemporal= pos

      });

  }

  codigoBanco(seleccion, posicion, texto) {

    //////console.log(seleccion + " , " + posicion + " , " + texto);
    var pais = ((document.getElementById("Id_Pais" + posicion) as HTMLInputElement).value);
    //////console.log("pais = " + 2);

    if (pais == "2") {
      switch (texto) {
        case "check": {
          var buscarBanco = this.Bancos.findIndex(x => x.Id_Banco === seleccion)
          this.Lista_Destinatarios[posicion].Numero_Cuenta = this.Bancos[buscarBanco].Identificador;
          break;
        }
        case "input": {
          //////console.log("soy input");

          var cadena = seleccion.substring(0, 4);
          var buscarBanco = this.Bancos.findIndex(x => x.Identificador === cadena)
          if (buscarBanco > -1) {
            this.Lista_Destinatarios[posicion].Id_Banco = this.Bancos[buscarBanco].Id_Banco;
          } else {
            this.Lista_Destinatarios[posicion].Id_Banco = '';
          }
          break;
        }
      }
    }

  }


  volverCambioEfectivo() {
    this.Cambios1 = true;
    this.Cambios2 = false;
    this.vueltos = 0;
    this.entregar = 0;
    this.tasaCambiaria = "";

    this.LimpiarModeloCambio();
  }

  volverReciboTransferencia() {
    this.Transferencia1 = true;
    this.Transferencia2 = false;
    /*this.Envios = [{
      Destino: '',
      Numero_Documento_Destino: '',
      Nombre: '',
      Id_Destinatario_Cuenta: '',
      Valor_Transferencia_Bolivar: '',
      Valor_Transferencia_Peso: '',
      Cuentas: [],
      esconder: false
    }];*/
    //this.CambiarTasa(1);
    this.LimpiarModeloTransferencia();
  }

  volverReciboGiro() {
    this.Giro1 = true;
    this.Giro2 = false;
    this.LimpiarModeloGiro('creacion');
  }

  volverTraslado() {
    this.Traslado1 = true;
    this.Traslado2 = false;
    this.LimpiarModeloTraslados('creacion');
  }

  volverServicio() {
    this.Servicio1 = true;
    this.Servicio2 = false;
    this.LimpiarModeloServicios('creacion');
  }

  volverReciboServicio() {
    this.Servicio1 = true;
    this.Servicio2 = false;
  }

  NuevaHileraDestinatario(pos) {
    var limite = parseInt(this.LimiteOficina);
    if (this.Envios.length != limite) {
      var index = pos + 1;

      ////console.log(this.Envios[index] == undefined && (this.Envios[pos].Destino != "") && (this.Envios[pos].Id_Destinatario_Cuenta != "") && (this.Envios[pos].Valor_Transferencia_Bolivar > 1));

      if (this.Envios[index] == undefined && (this.Envios[pos].Destino != "") && (this.Envios[pos].Id_Destinatario_Cuenta != "") && (this.Envios[pos].Valor_Transferencia_Bolivar > 1)) {
        this.Envios.push({
          Destino: '',
          Numero_Documento_Destino: '',
          Nombre: '',
          Id_Destinatario_Cuenta: '',
          Valor_Transferencia_Bolivar: 0,
          Valor_Transferencia_Peso: 0,
          Cuentas: [],
          esconder: false,
          disabled: true
        });

        //(document.getElementById("Valor_Transferencia_Bolivar"+(index)) as HTMLInputElement).disabled = false;

        if (this.Recibe == 'Cliente' && this.Envios.length == 1) {
          (document.getElementById("BotonMovimientoGuardar") as HTMLInputElement).disabled = true;
        } else {
          if (this.Envios.length == 1) {
            (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
          }
        }
      } else {
        if (this.Envios[pos].Id_Destinatario_Cuenta == "") {
          this.confirmacionSwal.title = "Información Vacia";
          this.confirmacionSwal.text = "Hay campos vacios que deben ser digitados para poder continuar";
          this.confirmacionSwal.type = "error";
          this.confirmacionSwal.show();

          if (this.Recibe == 'Cliente' && this.Envios.length == 1) {
            (document.getElementById("BotonMovimientoGuardar") as HTMLInputElement).disabled = true;
          } else {
            if (this.Envios.length == 1) {
              (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
            }
          }
        }

      }
    }
  }


  NuevoDestinatario(pos, moneda) {

    var index = pos + 1;
    var limite = parseInt(this.LimiteOficina);

    switch (moneda) {

      case 'Bolivar': {
        var suma = 0;
        var totalBolivar = (document.getElementById("Cantidad_Transferida") as HTMLInputElement).value;
        if (this.Envios.length != limite) {

          if (this.Envios[index] == undefined && (this.Envios[pos].Destino != "") && (this.Envios[pos].Valor_Transferencia_Peso > 0 && this.Envios[pos].Valor_Transferencia_Bolivar > 0)) {
            this.Envios.push({
              Destino: '',
              Numero_Documento_Destino: '',
              Nombre: '',
              Id_Destinatario_Cuenta: '',
              Valor_Transferencia_Bolivar: 0,
              Valor_Transferencia_Peso: 0,
              Cuentas: [],
              esconder: false
            });

            if (this.Recibe == 'Cliente') {
              (document.getElementById("BotonMovimientoGuardar") as HTMLInputElement).disabled = false;
            } else {
              (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = false;
            }
          }
        }
        break;
      }

      case 'Peso': {
        var suma = 0;
        var totalBolivar = (document.getElementById("Cantidad_Recibida") as HTMLInputElement).value;
        var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;

        if (this.Envios.length != limite) {
          if (this.Envios[index] == undefined && (this.Envios[pos].Destino != "") && (this.Envios[pos].Valor_Transferencia_Peso > 0 && this.Envios[pos].Valor_Transferencia_Bolivar > 0)) {
            this.Envios.push({
              Destino: '',
              Numero_Documento_Destino: '',
              Nombre: '',
              Id_Destinatario_Cuenta: '',
              Valor_Transferencia_Bolivar: 0,
              Valor_Transferencia_Peso: 0,
              Cuentas: [],
              esconder: false
            });
          }
        }
        break;
      }
    }
  }

  ValidarTransferencia(value) {
    if (parseInt(value) > this.maximoTransferencia) {
      this.PrecioSugeridoEfectivo = this.PrecioSugeridoEfectivo1;
      this.confirmacionSwal.title = "Error";
      this.confirmacionSwal.text = "La tasa de cambio supera el permitido"
      this.confirmacionSwal.type = "error"
      this.confirmacionSwal.show();
      if (this.Recibe != 'Cliente') {
        (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
      }

    } /*else {
      var monedaOrigen = (document.getElementById("Cantidad_Recibida") as HTMLInputElement).value;
      var monedaDestino = (document.getElementById("Cantidad_Transferida") as HTMLInputElement).value;
      this.RealizarCambioMonedaTransferencia(monedaOrigen, 'cambia');
      this.RealizarCambioMonedaTransferencia(monedaDestino, 'entrega');
      this.entregar = (parseInt(monedaOrigen) / parseInt(value));
      this.entregar = (parseInt(monedaOrigen) / parseInt(value));
      this.entregar = this.entregar.toFixed(2);
      this.cambiar = (parseInt(monedaDestino) * parseInt(value));

      var sumaPeso = 0;
      var sumaBolivar = 0;
      this.Envios.forEach(element => {
        sumaPeso += element.Valor_Transferencia_Peso;
        sumaBolivar += element.Valor_Transferencia_Bolivar;
      });

      if (((this.entregar != sumaBolivar) || (this.cambiar != sumaPeso)) && this.Recibe != 'Cliente') {
        this.confirmacionSwal.title = "Valores no coinciden";
        this.confirmacionSwal.text = "Los valores a entregar no coinciden con la sumatoria de los valores de los destiantarios";
        this.confirmacionSwal.type = "error";
        //this.confirmacionSwal.show();
        if (this.Recibe != 'Cliente') {
          (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
        }
      } else {
        if (this.Recibe != 'Cliente') {
          (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
        }
      }
    }*/

  }

  SeleccionarTipo(tipo) {
    this.Recibe = tipo;
    switch (tipo) {
      case "Transferencia": {
        this.MonedaTransferencia = 1;
        this.CambiarTasa(1);
        break;
      }
      case "Cliente": {
        this.MonedaTransferencia = 1;
        this.CambiarTasa(1);
        break;
      }
    }
  }

  AutoCompletarRemitente(modelo, ind = '') {
    /*if (modelo) {
      if (modelo.length > 0) {
        this.RemitentesFiltrados = this.Remitentes.filter(number => number.Id_Transferencia_Remitente.slice(0, modelo.length) == modelo);
      }
      else {
        this.RemitentesFiltrados = null;
      }
    }*/
    console.log(modelo);
    
    if (modelo) {
      this.TransferenciaModel.Documento_Origen=modelo.Id_Transferencia_Remitente;
      this.TransferenciaModel.Telefono_Remitente=modelo.Telefono;
      this.TransferenciaModel.Nombre_Remitente=modelo.Nombre;
    }    
  }

  HistorialTransferenciaRemitente(remitente) {
    this.http.get(this.globales.ruta + '/php/transferencias/historico_transferencia_remitente.php', { params: { modulo: 'Transferencia', id: remitente.Id_Transferencia_Remitente } }).subscribe((data: any) => {
      this.HistorialCliente = data;
      if (this.HistorialCliente.length > 0) {
        //abre modal
        this.ModalHistorial.show();
      } else {
        // informo que no hay registro
        this.confirmacionSwal.title = "Número no encontrado"
        this.confirmacionSwal.text = "El número de documento digitado no ha realizado alguna transferencia"
        this.confirmacionSwal.type = "error"
        this.confirmacionSwal.show();
      }
    });
  }

  


  

  IdRemitenteTransferencia: any = "";
  NombreRemitenteTransferencia: any = "";
  TelefonoRemitenteTransferencia: any = "";
  CompletarDatosRemitenteTransferencia(i) {
    var valor = ((document.getElementById("remitenteTransferencia") as HTMLInputElement).value);
    var index = this.Remitentes.findIndex(x => x.Id_Transferencia_Remitente === valor)
    if (index > -1) {
      this.IdRemitenteTransferencia = this.Remitentes[index].Id_Transferencia_Remitente;
      this.NombreRemitenteTransferencia = this.Remitentes[index].Nombre;
      this.TelefonoRemitenteTransferencia = this.Remitentes[index].Telefono;
    } else {
      this.IdRemitenteTransferencia = valor;
      this.NombreRemitenteTransferencia = "";
      this.TelefonoRemitenteTransferencia = "";
    }

  }

  AnularGiro(id) {
    let datos = new FormData();
    datos.append("modulo", 'Giro');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/giros/anular_giro.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = "Amulado con Exito";
      this.confirmacionSwal.text = "Se ha anulado correctamente el giro"
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();
      this.actualizarVista();
    });
  }

  anulado(estado) {
    switch (estado) {
      case "Anulada": { return false }
      default: { return true }
    }
  }

  cliente = true;
  TipoPagoTransferencia(value) {
    switch (value) {
      case "Credito": {
        this.credito = true;
        this.consignacion = false;
        this.efectivo = false;
        this.cliente = false;
        break;
      }
      case "Consignacion": {
        this.credito = false;
        this.consignacion = true;
        this.efectivo = false;
        this.cliente = true;
        break;
      }
      case "Efectivo": {
        this.efectivo = true;
        this.consignacion = false;
        this.credito = false;
        this.cliente = true;
        break;
      }
    }
  }

  listaClientes() {
    if (this.efectivo == true && this.cliente == true) {
      return true
    }

    if (this.consignacion == true && this.cliente == true) {
      return true
    }

  }

  AnularTransferencia(id, formulario: NgForm) {
    formulario.value.idTercero = this.idTerceroDestino;
    formulario.value.idDestino = this.destinoTercero;
    let datos = new FormData();
    let info = JSON.stringify(formulario.value);
    datos.append("id", id);
    datos.append("datos", info);
    /*datos.append("idTercero", this.idTerceroDestino);
    datos.append("idDestino", this.destinoTercero);*/
    this.http.post(this.globales.ruta + '/php/transferencias/anular_transferencia.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.ModalAnularTransferencia.hide();
        this.confirmacionSwal.title = "Anulado"
        this.confirmacionSwal.text = "Esta transferencia se anuló"
        this.confirmacionSwal.type = "success"
        this.confirmacionSwal.show();
        this.actualizarVista();
      });

  }

  idTerceroDestino: any;
  destinoTercero:any;
  AnularTransferenciaModal(id, modal, tercero, destino) {
    this.http.get(this.globales.ruta + '/php/transferencias/verificar_realizada.php', { params: { id: id } }).subscribe((data: any) => {
      var conteo = data[0].conteo;
      if (parseInt(conteo) > 0) {
        this.confirmacionSwal.title = "Anulacion"
        this.confirmacionSwal.text = "Esta transferencia no se puede anular"
        this.confirmacionSwal.type = "warning"
        this.confirmacionSwal.show();
      } else {
        this.idTransferencia = id;
        this.idTerceroDestino = tercero;
        this.destinoTercero = destino;
        modal.show();
      }
    });
  }

  itemDestinatario = true;
  NombreTercero:any;
  TituloModalTransferencia ="Envia";
  verRecibo(valor) {
    this.http.get(this.globales.ruta + 'php/transferencias/ver_recibo.php', {
      params: { id: valor }
    }).subscribe((data: any) => {
      this.EncabezadoRecibo = data.encabezado;
      this.DestinatarioRecibo = data.destinatario;
      if (this.DestinatarioRecibo.length > 0) {
        this.itemDestinatario = true;
      } else {
        this.itemDestinatario = false;
      }

      var index = this.TerceroCliente.findIndex(x=>x.Id_Tercero === data.encabezado[0].Id_Tercero);
      if(index >-1){
        this.NombreTercero = this.TerceroCliente[index].Nombre;
        this.TituloModalTransferencia = "Tercero "
      }
      
      var index1 = this.TerceroCliente.findIndex(x=>x.Id_Tercero === data.encabezado[0].Id_Tercero_Destino);
      if(index1 >-1){
        this.NombreTercero = this.TerceroCliente[index1].Nombre;
        this.TituloModalTransferencia = "Tercero "
      }

      var index2 = this.RemitentesTransferencias.findIndex(x=>x.Id_Transferencia_Remitente === data.encabezado[0].Documento_Origen);
      if(index2 >-1){
        this.NombreTercero = this.RemitentesTransferencias[index2].Nombre;
        this.TituloModalTransferencia = "Remitente "
      }
      //CuentasBancarias
      var index3 = this.CuentasBancarias.findIndex(x=>x.Id_Cuenta_Bancaria === data.encabezado[0].Id_Cuenta_Bancaria);
      if(index3 >-1){
        this.NombreTercero = this.CuentasBancarias[index3].Nombre_Titular;
        this.TituloModalTransferencia = "Cuenta De "
      }

      this.ModalVerRecibo.show();
    });
  }


  


  VerificarTercero(valor) {

    var index = this.Tercero.findIndex(x => x.Id_Tercero === valor);
    if (index > -1) {
      this.cupoTercero = this.Tercero[index].Cupo;
    }

    this.http.get(this.globales.ruta + 'php/transferencias/saldo_bolivares.php', { params: { id: valor } }).subscribe((data: any) => {
      this.SaldoBolivar = data.Saldo;
    });
  }

  AutoSuma(pos) {
    var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;
    var sumabolivar = 0;
    this.Envios.forEach((element, index) => {
      sumabolivar += Number(element.Valor_Transferencia_Bolivar);
    });

    var totalBolivares = (document.getElementById("Cantidad_Transferida") as HTMLInputElement).value;

    var formaPago = (document.getElementById("Forma_Pago") as HTMLInputElement).value;
    if (formaPago == "Credito") {
      var total = Number(totalBolivares) + Number(this.SaldoBolivar)
      var idTercero = (document.getElementById("Id_Tercero") as HTMLInputElement).value;
      if (idTercero != "") {
        var indice = this.Tercero.findIndex(x => x.Id_Tercero === idTercero);
        if (indice > -1) {
          if (sumabolivar > total) {
            this.confirmacionSwal.title = "Valor excedido";
            this.confirmacionSwal.text = "La suma de los valores digitados no coinciden con el valor en bolivares para enviar (" + totalBolivares + ")";
            this.confirmacionSwal.type = "error";
            this.confirmacionSwal.show();
            this.Envios[pos].Valor_Transferencia_Bolivar = 0;
          } else {
            if (sumabolivar < parseInt(totalBolivares)) {
              this.NuevaHileraDestinatario(pos);
            }
          }
        }
      }
    } else {
      if (sumabolivar > parseInt(totalBolivares)) {
        this.confirmacionSwal.title = "Valor excedido";
        this.confirmacionSwal.text = "La suma de los valores digitados no coinciden con el valor en bolivares para enviar (" + totalBolivares + ")";
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();
        this.Envios[pos].Valor_Transferencia_Bolivar = 0;
      } else {
        this.NuevaHileraDestinatario(pos);
      }

    }    //this.NuevaHileraDestinatario(pos);
  }

  /*ESTO YA NO SE USA
  NombreTitular: any;
  tipoCuenta: any;

  InformacionCuentaBancaria(id) {
    var index = this.CuentaBancaria.findIndex(x => x.Id_Cuenta_Bancaria === id);
    if (index > -1) {
      var tipoCuenta = this.CuentaBancaria[index].Tipo;
      (document.getElementById("NombreTitular") as HTMLInputElement).value = this.CuentaBancaria[index].Nombre_Titular;
      (document.getElementById("tipoCuenta") as HTMLInputElement).value = this.TipoCuentas[tipoCuenta].Nombre;
    }
  }
  //ESTO YA NO SE USA*/

  

  RecibeCliente = false;
  tipoCliente = true
  transferencia = true;
  Credito = false;
  Consignacion = false;
  datosRemitenteTransferencia = true;
  BotonTransferencia = true;
  BotonMovimiento = false;
  opcionDefaultFormaPago = "Efectivo";
  opcionTipoTransferencia  = "Transferencia";

  VerificarTipoTransferencia() {

    let Forma_Pago = this.TransferenciaModel.Forma_Pago;
    let tipo = this.TransferenciaModel.Tipo_Transferencia;

    if (tipo == "Transferencia") {
      this.BotonTransferencia = true;
      this.BotonMovimiento = false;
      switch (Forma_Pago) {
        case "Efectivo": {
          this.tipoCliente = true;
          this.transferencia = true;
          this.datosRemitenteTransferencia = true;
          this.Credito = false;
          this.Consignacion = false;
          this.RecibeCliente = false;
          this.ShowClienteSelect = true;
          break;
        }
        case "Credito": {
          this.tipoCliente = false;
          this.transferencia = true;
          this.datosRemitenteTransferencia = false;
          this.RecibeCliente = false;
          this.Credito = true;
          this.Consignacion = false;
          this.ShowClienteSelect = false;
          
          break;
        }
        case "Consignacion": {
          this.tipoCliente = true;
          this.transferencia = true;
          this.datosRemitenteTransferencia = false;
          this.Credito = false;
          this.Consignacion = true;
          this.RecibeCliente = false;
          this.ShowClienteSelect = true;
          break;
        }
      }
    }

    if (tipo == "Cliente") {
      this.BotonTransferencia = false;
      this.BotonMovimiento = true;
      switch (Forma_Pago) {
        case "Efectivo": {
          this.RecibeCliente = true;
          this.transferencia =false;
          this.Credito = false;
          this.Consignacion = false;
          this.ShowClienteSelect = true;
          break;
        }
        case "Credito": {
          this.RecibeCliente = false;
          this.tipoCliente = false;
          this.Consignacion = false;
          this.Credito = true;
          this.transferencia = true;
          this.opcionTipoTransferencia = "Transferencia";
          this.ShowClienteSelect = false;
          break;
        }
        case "Consignacion": {
          this.RecibeCliente = true;
          this.transferencia =false;
          this.Credito = false;
          this.Consignacion = true;
          this.ShowClienteSelect = true;
          break;
        }
      }
    }
    
    /*var Forma_Pago = (document.getElementById("Forma_Pago") as HTMLInputElement).value;
    var Tipo_Transferencia = (document.getElementById("Tipo_Transferencia") as HTMLInputElement).value;


    if (Tipo_Transferencia == "Transferencia") {
      this.BotonTransferencia = true;
      this.BotonMovimiento = false;
      switch (Forma_Pago) {
        case "Efectivo": {
          this.tipoCliente = true;
          this.transferencia = true;
          this.datosRemitenteTransferencia = true;
          this.Credito = false;
          this.Consignacion = false;
          this.RecibeCliente = false;
          break;
        }
        case "Credito": {
          this.tipoCliente = false;
          this.transferencia = true;
          this.datosRemitenteTransferencia = false;
          this.RecibeCliente = false;
          this.Credito = true;
          this.Consignacion = false;
          
          break;
        }
        case "Consignacion": {
          this.tipoCliente = true;
          this.transferencia = true;
          this.datosRemitenteTransferencia = false;
          this.Credito = false;
          this.Consignacion = true;
          this.RecibeCliente = false;
          break;
        }
      }
    }

    if (Tipo_Transferencia == "Cliente") {
      this.BotonTransferencia = false;
      this.BotonMovimiento = true;
      switch (Forma_Pago) {
        case "Efectivo": {
          this.RecibeCliente = true;
          this.transferencia =false;
          this.Credito = false;
          this.Consignacion = false;
          break;
        }
        case "Credito": {
          this.RecibeCliente = false;
          this.tipoCliente = false;
          this.Consignacion = false;
          this.Credito = true;
          this.transferencia = true;
          this.opcionTipoTransferencia = "Transferencia";
          break;
        }
        case "Consignacion": {
          this.RecibeCliente = true;
          this.transferencia =false;
          this.Credito = false;
          this.Consignacion = true;
          break;
        }
      }
    }*/

    this.LimpiarModeloTransferencia(false, true);
  }

  ControlarValoresSelect(valor){

    if (valor == 'Efectivo' || valor == 'Credito' || valor == 'Consignación') {
      this.LimpiarModeloTransferencia(true, true);

    }else if (valor == 'Transferencia' || valor == 'Cliente') {
      this.LimpiarModeloTransferencia(true, true);
    }    
    
    let Forma_Pago = this.TransferenciaModel.Forma_Pago;
    let tipo = this.TransferenciaModel.Tipo_Transferencia;

    if (Forma_Pago == 'Efectivo' && tipo == 'Transferencia') {
      this.ControlVisibilidadTransferencia.DatosCambio = true;
      this.ControlVisibilidadTransferencia.Destinatarios = true;
      this.ControlVisibilidadTransferencia.DatosRemitente = true;
      this.ControlVisibilidadTransferencia.DatosCredito = false;
      this.ControlVisibilidadTransferencia.DatosConsignacion = false;
      this.ControlVisibilidadTransferencia.SelectCliente = false;

    }else if (Forma_Pago == 'Efectivo' && tipo == 'Cliente') {
      this.ControlVisibilidadTransferencia.DatosCambio = true;
      this.ControlVisibilidadTransferencia.Destinatarios = false;
      this.ControlVisibilidadTransferencia.DatosRemitente = true;
      this.ControlVisibilidadTransferencia.DatosCredito = false;
      this.ControlVisibilidadTransferencia.DatosConsignacion = false;
      this.ControlVisibilidadTransferencia.SelectCliente = true;

    }else if (Forma_Pago == 'Credito' && tipo == 'Transferencia') {
      this.ControlVisibilidadTransferencia.DatosCambio = true;
      this.ControlVisibilidadTransferencia.Destinatarios = true;
      this.ControlVisibilidadTransferencia.DatosRemitente = false;
      this.ControlVisibilidadTransferencia.DatosCredito = true;
      this.ControlVisibilidadTransferencia.DatosConsignacion = false;
      this.ControlVisibilidadTransferencia.SelectCliente = false;

    }else if (Forma_Pago == 'Credito' && tipo == 'Cliente') {
      this.ControlVisibilidadTransferencia.DatosCambio = false;
      this.ControlVisibilidadTransferencia.Destinatarios = false;
      this.ControlVisibilidadTransferencia.DatosRemitente = false;
      this.ControlVisibilidadTransferencia.DatosCredito = false;
      this.ControlVisibilidadTransferencia.DatosConsignacion = false;
      this.ControlVisibilidadTransferencia.SelectCliente = false;

    }else if (Forma_Pago == 'Consignacion' && tipo == 'Transferencia') {
      this.ControlVisibilidadTransferencia.DatosCambio = true;
      this.ControlVisibilidadTransferencia.Destinatarios = true;
      this.ControlVisibilidadTransferencia.DatosRemitente = true;
      this.ControlVisibilidadTransferencia.DatosCredito = false;
      this.ControlVisibilidadTransferencia.DatosConsignacion = true;
      this.ControlVisibilidadTransferencia.SelectCliente = false;

    }else if (Forma_Pago == 'Consignacion' && tipo == 'Cliente') {
      this.ControlVisibilidadTransferencia.DatosCambio = true;
      this.ControlVisibilidadTransferencia.Destinatarios = false;
      this.ControlVisibilidadTransferencia.DatosRemitente = true;
      this.ControlVisibilidadTransferencia.DatosCredito = false;
      this.ControlVisibilidadTransferencia.DatosConsignacion = true;
      this.ControlVisibilidadTransferencia.SelectCliente = true;
    }
  }

  CargarValoresEfectivo(tipo){
    switch (tipo) {
      case 'Transferencia':

        this.ShowClienteSelect = false;
        this.tipoCliente = true;
        this.transferencia = true;
        this.datosRemitenteTransferencia = true;
        this.Credito = false;
        this.Consignacion = false;
        this.RecibeCliente = false;
        break;
    
      case 'Cliente':
          
          this.ShowClienteSelect = true;
          this.RecibeCliente = true;
          this.transferencia =false;
          this.Credito = false;
          this.Consignacion = false;
        break;

      default:
        break;
    }
  }

  CargarValoresCredito(tipo){
    switch (tipo) {
      case 'Transferencia':
        this.ShowClienteSelect = false;
        this.tipoCliente = false;
        this.transferencia = true;
        this.datosRemitenteTransferencia = false;
        this.RecibeCliente = false;
        this.Credito = true;
        this.Consignacion = false;
        break;
    
      /*case 'Cliente':
        
        this.RecibeCliente = false;
        this.tipoCliente = false;
        this.Consignacion = false;
        this.Credito = true;
        this.transferencia = true;
        this.opcionTipoTransferencia = "Transferencia";
        break;*/

      default:
        break;
    }
  }

  CargarValoresConsignacion(tipo){
    switch (tipo) {
      case 'Transferencia':
        this.ShowClienteSelect = false;
        this.tipoCliente = true;
        this.transferencia = true;
        this.datosRemitenteTransferencia = false;
        this.Credito = false;
        this.Consignacion = true;
        this.RecibeCliente = false;
        break;
    
      case 'Cliente':
        this.ShowClienteSelect = true;
        this.RecibeCliente = true;
        this.transferencia =false;
        this.Credito = false;
        this.Consignacion = true;
        break;

      default:
        break;
    }
  }

  VerificarValoresSelect(valor){
    if(valor == "Credito"){
      this.OpcionesTipo = ['Transferencia'];
    }else{
      this.OpcionesTipo = ['Transferencia', 'Cliente'];
    }
  }

  ReiniciarTransferencias(){
    this.RecibeCliente = false;
    this.tipoCliente = true
    this.transferencia = true;
    this.Credito = false;
    this.Consignacion = false;
    this.datosRemitenteTransferencia = true;
    this.BotonTransferencia = true;
    this.BotonMovimiento = false;
    this.opcionDefaultFormaPago = "Efectivo";
    this.opcionTipoTransferencia  = "Transferencia";
    this.transferencia = true
  }

  OcultarFormularios(activeModal:any){
    activeModal.hide();
  }

  BuscarIdentificacion(event:any){
    console.log(event);
    
  }


  //CODIGO NUEVO - FRANKLIN GUERRA

  //FUNCIONES/METODOS PARA TRANSFERENCIAS

  AsignarMonedas(){
    
    this.Monedas = [];
    this.globales.Monedas.forEach(moneda => {
      if (moneda.Nombre != 'Pesos') {
        this.Monedas.push(moneda);     
      }
    });    
  }

  AsignarPaises(){      
    this.Paises = this.globales.Paises;
  }

  AsignarCuentasPersonales(){      
    this.CuentasPersonales = this.globales.CuentasPersonalesPesos;    
  }

  

  //FIN FUNCIONES/METODOS PARA TRANSFERENCIAS

  FocusField(fieldElement:ElementRef){    
    fieldElement.nativeElement.focus();
  }

  //MOSTRAR ALERTAS DESDE LA INSTANCIA DEL SWEET ALERT GLOBAL
  ShowSwal(tipo:string, titulo:string, msg:string, confirmCallback = null, cancelCallback = null){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  

  
}
