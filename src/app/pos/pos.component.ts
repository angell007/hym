import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Globales } from '../shared/globales/globales';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, delay } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { isEmpty } from 'rxjs/operator/isEmpty';
import { GeneralService } from '../shared/services/general/general.service';
import { CajeroService } from '../shared/services/cajeros/cajero.service';
import { SwalService } from '../shared/services/swal/swal.service';
import { PermisoService } from '../shared/services/permisos/permiso.service';
import { DestinatarioService } from '../shared/services/destinatarios/destinatario.service';
import { MonedaService } from '../shared/services/monedas/moneda.service';
import { ToastService } from '../shared/services/toasty/toast.service';
import { TransferenciaService } from '../shared/services/transferencia/transferencia.service';
import { AperturacajaService } from '../shared/services/aperturacaja/aperturacaja.service';
import { of } from 'rxjs/observable/of';
import { RemitenteModel } from '../Modelos/RemitenteModel';
import * as AccionModalRemitente from '../shared/Enums/AccionModalRemitente';
import { AccionTableroCajero } from '../shared/Enums/AccionTableroCajero';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss', '../../style.scss']
})
export class PosComponent implements OnInit {
  public eventsSubject: Subject<any> = new Subject<any>();
  public openModalGiro: Subject<any> = new Subject<any>();
  public corresponsalView: Subject<any> = new Subject<any>();
  public AbrirModalDestinatario: Subject<any> = new Subject<any>();
  public permisoSubscription: any;
  public aperturaSubscription: any;

  public searchComisionServicio: Subject<string> = new Subject<string>();
  public searchComisionService$ = this.searchComisionServicio.asObservable();
  public comisionServicioSubscription: any;

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
  @ViewChild('ModalAperturaCaja') ModalAperturaCaja: any;

  public Destinatarios: any = [];
  public Remitentes: any = [];
  public Paises: any = [];
  public Clientes: any = [];
  public CorresponsalesBancarios: any = [];
  public Cambios: any = [];
  public Monedas: any = [];
  vueltos: number;
  Venta = false;
  TextoBoton = "Vender";
  entregar: any;
  Tipo: string;

  //CONTROL DE VISTAS
  public CardModulos: Array<any> = [
    { Nombre: 'Cambios Efectivo', Texto_Alternativo: 'Compras o Ventas', Id: 'cambios', Activo: true, Icono: 'ti-calendar', ColorClass: 'text-primary' },
    { Nombre: 'Recibos Transferencias', Texto_Alternativo: 'A cuentas extranjeras', Id: 'transferencias', Activo: false, Icono: 'ti-control-shuffle', ColorClass: 'text-primary' },
    { Nombre: 'Giros', Texto_Alternativo: 'Envío/Recepción Dinero', Id: 'giros', Activo: false, Icono: 'ti-wallet', ColorClass: 'text-success' },
    { Nombre: 'Traslados', Texto_Alternativo: 'Entre Caja de la Empresa', Id: 'traslados', Activo: false, Icono: 'ti-reload', ColorClass: 'text-info' },
    { Nombre: 'Corresponsal Bancario', Texto_Alternativo: 'Saldo del Día', Id: 'corresponsal', Activo: false, Icono: 'ti-money', ColorClass: 'text-warning' },
    { Nombre: 'Servicios Externos', Texto_Alternativo: 'Consignaciones, Pagos, Trámites', Id: 'servicios', Activo: false, Icono: 'ti-truck', ColorClass: 'text-danger' }
  ];
  Cambios1 = true;
  Cambios2 = false
  Transferencia = [];
  Transferencia1 = true;
  Transferencia2 = false;
  Traslado1 = true;
  Traslado2 = false;
  Corresponsal1 = true;
  Corresponsal2 = false;
  Historial = false;
  HistorialCliente = [];
  Giro1 = true;
  Giro2 = false;
  public Corresponsal: boolean = false;

  Giros = [];
  Departamentos = [];
  //Municipios_Remitente = [];
  Municipios_Destinatario = [];
  GiroComision = [];
  ValorEnviar: any;
  Departamento_Remitente: any;
  Departamento_Destinatario: any;
  FuncionariosCaja = [];
  Funcionario: any;
  Traslados = [];
  idTraslado: any;
  Traslado: any = {};
  TrasladosRecibidos = [];
  ServicioComision = [];
  ValorComisionServicio: any;
  Servicio2 = false;
  Servicio1 = true;
  Servicios = [];
  Servicio: any = {};
  Giro: any = {};
  idGiro: any;
  Remitente: any = {};
  Destinatario: any = {};
  Tercero = [];
  CuentaBancaria = [];
  defectoDestino: string;
  defectoOrigen: string;
  MaxEfectivo: number = 0;
  MinEfectivo: number = 0;
  MaxCompra: number = 0;
  MinCompra: number = 0;
  PrecioSugeridoEfectivo1: any;
  MonedaRecibidaTransferencia: number;
  maximoTransferencia: any;
  minimoTransferencia: any;
  ActivarEdicion = false;
  Detalle_Destinatario: any = {};
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
  //TipoDocumentoExtranjero = [];
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

  verCambio: any = {};
  tasaCambiaria: any;

  //NUEVAS VARIABLES

  //#region Variables Generales

  public funcionario_data: any = this.generalService.SessionDataModel.funcionarioData;
  public IdOficina: any = this.generalService.SessionDataModel.idOficina;
  public IdCaja: any = this.generalService.SessionDataModel.idCaja;

  public TerceroCliente: any = [];
  public TransferenciasAnuladas: any = [];
  public RemitentesTransferencias: any = [];
  public CuentasBancarias: any = [];
  public PosicionDestinatarioActivo: any = '';
  public TipoDocumentoNacional: any = [];
  public TipoDocumentoExtranjero: any = [];
  public TiposCuenta: any = [];
  public DestinatarioEditar: boolean = false;
  public DeshabilitarValor: boolean = true;
  public DeshabilitarTasa: boolean = true;

  public DiarioModel: any = {
    Id_Diario: '',
    Id_Funcionario: this.funcionario_data.Identificacion_Funcionario,
    Caja_Apertura: this.IdOficina,
    Oficina_Apertura: this.IdCaja
  };

  public ValoresMonedasApertura: any = [
    { Id_Moneda: '', Valor_Moneda_Apertura: '', NombreMoneda: '', Codigo: '' }
  ];

  public CardSelection: any = {
    cambios: true,
    trans: false,
    giros: false,
    traslados: false,
    corresponsal: false,
    servicios: false,
  }

  public RemitenteModalEnum = AccionModalRemitente.AccionModalRemitente;
  public EditRemitenteTransferencia: boolean = false;
  //#endregion

  //#region VARAIBLES CAMBIOS

  //MODELO CAMBIOS
  public CambioModel: any = {
    Id_Cambio: '',
    Tipo: '',
    Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
    Id_Oficina: this.IdOficina == '' ? '0' : this.IdOficina,
    Moneda_Origen: '',
    Moneda_Destino: '',
    Tasa: '',
    Valor_Origen: '',
    Valor_Destino: '',
    TotalPago: '',
    Vueltos: '0',
    Recibido: '',
    Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario
  };

  public MonedaParaCambio: any = {
    id: '',
    nombre: '',
    Valores: {
      Min_Venta_Efectivo: '0',
      Max_Venta_Efectivo: '0',
      Sugerido_Venta_Efectivo: '',
      Min_Compra_Efectivo: '0',
      Max_Compra_Efectivo: '0',
      Sugerido_Compra_Efectivo: '',
      Min_Venta_Transferencia: '',
      Max_Venta_Transferencia: '',
      Sugerido_Venta_Transferencia: '',
      Costo_Transferencia: '',
      Comision_Efectivo_Transferencia: '',
      Pagar_Comision_Desde: '',
      Min_No_Cobro_Transferencia: '',
    }
  };

  public Bolsa_Restante = '0';
  public HabilitarCampos: boolean = true;
  public TotalPagoCambio: any = '';
  public NombreMonedaTasaCambio: string = '';
  public MonedasCambio: any = [];
  public TextoMensajeGuardar: string = 'compra';
  public MonedaDestino: string = 'Pesos';
  public MonedaOrigen: string = 'Pesos';

  //#endregion

  //#region DATOS TRANSFERENCIAS

  public MonedaParaTransferencia: any = {
    id: '',
    nombre: '',
    Valores: {
      Min_Venta_Efectivo: '',
      Max_Venta_Efectivo: '',
      Sugerido_Venta_Efectivo: '',
      Min_Compra_Efectivo: '',
      Max_Compra_Efectivo: '',
      Sugerido_Compra_Efectivo: '',
      Min_Venta_Transferencia: '',
      Max_Venta_Transferencia: '',
      Sugerido_Venta_Transferencia: '',
      Costo_Transferencia: '',
      Comision_Efectivo_Transferencia: '',
      Pagar_Comision_Desde: '',
      Min_No_Cobro_Transferencia: '',
    }
  };

  public id_remitente: any = '';
  public id_destinatario_transferencia: any = '';
  public tercero_credito: any = '';
  public CuentasPersonales: any = [];
  public ShowClienteSelect: boolean = false;
  public OpcionesTipo: any = ['Transferencia', 'Cliente'];
  public InputBolsaBolivares: boolean = false;
  public MonedasTransferencia: any = [];

  public ControlVisibilidadTransferencia: any = {
    DatosCambio: true,
    Destinatarios: true,
    DatosRemitente: true,
    DatosCredito: false,
    DatosConsignacion: false,
    SelectCliente: false
  };

  //MODELO PARA TRANSFERENCIAS
  public TransferenciaModel: any = {
    Forma_Pago: 'Efectivo',
    Tipo_Transferencia: 'Transferencia',

    //DATOS DEL CAMBIO
    Moneda_Origen: '2',
    Moneda_Destino: '',
    Cantidad_Recibida: '',
    Cantidad_Transferida: '',
    Cantidad_Transferida_Con_Bolivares: '0',
    Tasa_Cambio: '',
    Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
    Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
    Observacion_Transferencia: '',

    //DATOS REMITENTE
    Documento_Origen: '',
    Nombre_Remitente: '',
    Telefono_Remitente: '',

    //DATOS CREDITO
    Cupo_Tercero: 0,
    Bolsa_Bolivares: '0',

    //DATOS CONSIGNACION
    Id_Tercero_Destino: '',
    Id_Cuenta_Bancaria: '',
    Tipo_Origen: 'Remitente',
    Tipo_Destino: 'Destinatario'
  };

  public ListaDestinatarios: any = [
    {
      id_destinatario_transferencia: '',
      Numero_Documento_Destino: '',
      Nombre_Destinatario: '',
      Id_Destinatario_Cuenta: '',
      Valor_Transferencia: '',
      Cuentas: [],
      Id_Moneda: '',
      EditarVisible: false
    }
  ];

  public MotivoAnulacionTransferencia: string = '';
  public RemitenteTransferenciaModel: RemitenteModel = new RemitenteModel();
  public ActulizarTablaRecibos: Subject<any> = new Subject<any>();
  public TransferenciaPesos: boolean = false;

  //#endregion 

  //#region DATOS GIROS

  //MODELO PARA GIROS
  public GiroModel: any = {

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
    Id_Oficina: this.IdOficina == '' ? '0' : this.IdOficina,
    Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
    Id_Moneda: '2'
  };

  //VARIABLES GIRO VIEJAS
  GirosBuscar = [];
  public Aparecer = false;
  public EditarRemitenteGiro: boolean = false;
  public EditarDestinatarioGiro: boolean = false;
  public CrearRemitenteGiro: boolean = false;
  public CrearDestinatarioGiro: boolean = false;

  DatosRemitenteEditarGiro: any = {};
  DatosDestinatario: any = {};
  DatosDestinatarioEditarGiro: any = {};
  informacionGiro: any = {};
  ValorTotalGiro: any;
  //FIN VARIABLES VIEJAS

  public Remitente_Giro: any = '';
  public Destinatario_Giro: any = '';
  public DepartamentosGiros: any = [];
  public Municipios_Remitente = [];
  public DeshabilitarComisionGiro: boolean = true;
  public CedulaBusquedaGiro: string = '';

  //#endregion

  //#region DATOS TRASLADOS

  //MODELO TRASLADOS
  public TrasladoModel: any = {
    Id_Traslado_Caja: '',
    Funcionario_Destino: '',
    Id_Cajero_Origen: this.funcionario_data.Identificacion_Funcionario,
    Id_Caja: this.IdCaja,
    Valor: '',
    Detalle: '',
    Id_Moneda: '',
    Estado: 'Activo',
    Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
    Aprobado: 'No'
  };

  public CajerosTraslados: any = [];
  public MonedasTraslados: any = [];
  public MonedaSeleccionadaTraslado: string = '';

  public TrasladosEnviados: any = [];
  public TrasladoRecibidos: any = [];

  //#endregion

  //#region CORRESPONSAL BANCARIO

  //MODELO CORRESPONSAL
  public CorresponsalModel: any = {
    Id_Corresponsal_Diario: '',
    Id_Corresponsal_Bancario: '',
    Detalle: '',
    Valor: '',
    Fecha: '',
    Hora: '',
    Id_Moneda: '2',
    Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario
  };

  public CorresponsalesBancos: any = [];
  public ActualizarTablaCorresponsal: Subject<any> = new Subject<any>();

  //#endregion

  //#region SERVICIOS EXTERNOS

  //MODELO SERVICIOS
  public ServicioExternoModel: any = {
    Id_Servicio: '',
    Servicio_Externo: '',
    Comision: '',
    Valor: '',
    Detalle: '',
    Id_Moneda: '2',
    Estado: 'Activo',
    Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
    Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja
  };

  public ListaServiciosExternos: any = [];
  public ComisionServicio: any = [];
  public Total_Servicio: number = 0;
  public Comision_Anterior_Servicio: number = 0;

  //#endregion

  //#region VARIABLES DESTINATARIO

  public DestinatarioModel: any = {
    Id_Destinatario: '',
    Nombre: '',
    Detalle: '',
    Estado: 'Activo',
    Tipo_Documento: '',
    Id_Pais: ''
  };

  public Lista_Cuentas_Destinatario: any = [{
    Id_Pais: '',
    Id_Banco: '',
    Bancos: [],
    Id_Tipo_Cuenta: '',
    Numero_Cuenta: '',
    EsVenezolana: false
  }];

  public TipoDocumentoFiltrados: any = [];
  public SePuedeAgregarMasCuentas: boolean = false;

  //#endregion
  //Fin nuevas variables

  public RutaGifCargando: string;
  public CargandoGiros: boolean = false;

  constructor(private http: HttpClient,
    public globales: Globales,
    public sanitizer: DomSanitizer,
    private generalService: GeneralService,
    private cajeroService: CajeroService,
    private swalService: SwalService,
    private permisoService: PermisoService,
    private destinatarioService: DestinatarioService,
    private _monedaService: MonedaService,
    private _toastService: ToastService,
    private _transferenciaService: TransferenciaService,
    private _aperturaCajaService: AperturacajaService) {
    this.RutaGifCargando = generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
    this.AsignarMonedas();
  }

  CierreCajaAyerBolivares = 0;
  MontoInicialBolivar = 0;

  GirosAprobados = [];

  public boolId: boolean = false;
  public boolNombre: boolean = false;
  public boolIdR: boolean = false;
  public boolNombreR: boolean = false;
  public boolTelefonoR: boolean = false;

  ngOnInit() {

    // this.aperturaSubscription = this._aperturaCajaService.event.subscribe((data:any) => {
    //   // this.IdOficina = JSON.parse(localStorage.getItem('Oficina'));
    //   // this.IdCaja = JSON.parse(localStorage.getItem('Caja'));
    //   // this.CheckApertura();
    // });

    this.comisionServicioSubscription = this.searchComisionService$.pipe(
      debounceTime(500),
      switchMap(value => value != '' ?
        this.http.get(this.globales.ruta + 'php/serviciosexternos/comision_servicios.php', { params: { valor: value } }) : ''
      )
    ).subscribe((response: any) => {
      this.Comision_Anterior_Servicio = parseInt(response);
      this.ServicioExternoModel.Comision = parseInt(response);
      this.Total_Servicio = this.ServicioExternoModel.Valor + parseInt(response);
      // console.log(this.Total_Servicio);      
    });

    //this.AsignarMonedasApertura();
    this.AsignarTipoDocumento();
    this.AsignarTiposCuenta();


    setTimeout(() => {
      this.SetDatosIniciales();
      //this.CheckApertura();
    }, 1500);
    //this.GetRegistroDiario();

    this.permisoSubscription = this.permisoService.permisoJefe.subscribe(d => {
      // console.log(d);

      if (d.verificado) {
        if (d.accion == 'transferencia_cajero') {
          this.TransferenciaModel.Tasa_Cambio = d.valor;
          let valor_recibido = parseFloat(this.TransferenciaModel.Cantidad_Recibida);

          if (d.valor > 0) {
            this.CalcularCambio(valor_recibido, d.valor, 'recibido', true);
          } else {
            this.LimpiarCantidades();
          }
        } else if (d.accion == 'servicio_externo') {
          // this.ServicioExternoModel.Comision = d.valor;
          this.Comision_Anterior_Servicio = parseInt(d.valor);
          this.ServicioExternoModel.Comision = parseInt(d.valor);
          this.Total_Servicio = this.ServicioExternoModel.Valor + parseInt(d.valor);
        }

      } else {
        if (d.accion == 'transferencia_cajero') {

        } else if (d.accion == 'servicio_externo') {
          // this.ServicioExternoModel.Comision = d.valor;
          this.ServicioExternoModel.Comision = this.Comision_Anterior_Servicio;
          this.Total_Servicio = this.ServicioExternoModel.Valor + this.Comision_Anterior_Servicio;
        }
      }
    });
  }

  ngAfterViewInit() {
    //this.ModalAperturaCaja.show();
  }

  ngOnDestroy() {
    if (this.permisoSubscription != undefined) {
      this.permisoSubscription.unsubscribe();
    }

    if (this.aperturaSubscription != undefined) {
      this.aperturaSubscription.unsubscribe();
    }

    if (this.comisionServicioSubscription != undefined) {
      this.comisionServicioSubscription.unsubscribe();
    }
  }

  // AbrirModalApertura(){
  //   this.ModalAperturaCaja.show();
  // }

  AbrirModalPermiso() {
    this.permisoService._openSubject.next();
  }

  //#region FUNCIONES CAMBIOS

  SetMonedaCambio(value) {
    this.MonedaParaCambio.id = value;
    //this.MonedaParaCambio.Moneda_Destino = value;
    let c = this.MonedasCambio.find(x => x.Id_Moneda == value);

    if (value != '') {
      this.http.get(this.globales.ruta + 'php/monedas/buscar_valores_moneda.php', { params: { id_moneda: value } }).subscribe((data: any) => {

        // console.log(data);

        if (data.codigo == 'success') {
          this.MonedaParaCambio.Valores = data.query_data;
          this.MonedaParaCambio.nombre = c.Nombre;
          this.CambioModel.Recibido = '';

          if (this.Venta) {

            this.CambioModel.Tasa = data.query_data.Sugerido_Venta_Efectivo;
            this.CambioModel.Moneda_Origen = '2';
            this.CambioModel.Moneda_Destino = value;
          } else {
            this.CambioModel.Tasa = data.query_data.Sugerido_Compra_Efectivo;
            this.CambioModel.Moneda_Origen = value;
            this.CambioModel.Moneda_Destino = '2';
          }

          this.HabilitarCamposCambio();
        } else {
          this.swalService.ShowMessage([data.codigo, data.titulo, 'No se encontraron valores de configuración para esta moneda ' + c.Nombre + ', seleccione otra!']);
          this.HabilitarCampos = true;
          this.ResetMonedaParaCambio();
          this._limpiarCompraVenta(value);
          this.MonedaParaCambio.nombre = '';
          this.CambioModel.Tasa = '';
          this.CambioModel.Recibido = '';
        }

        //this.conversionMoneda();
      });
    } else {
      this._limpiarCompraVenta(value);

      this.MonedaParaCambio.nombre = '';
      this.CambioModel.Tasa = '';
      this.CambioModel.Recibido = '';
      this.ResetMonedaParaCambio();
      this.HabilitarCamposCambio();
    }
  }

  private _limpiarCompraVenta(value: string = '') {
    if (this.Venta) {
      this.CambioModel.Valor_Origen = '';
      this.CambioModel.Valor_Destino = '';
      this.CambioModel.Tasa = '';
      this.CambioModel.TotalPago = '';
      this.CambioModel.Vueltos = '';
      this.CambioModel.Moneda_Origen = '2';
      this.CambioModel.Moneda_Destino = value;
    } else {
      this.CambioModel.Valor_Origen = '';
      this.CambioModel.Valor_Destino = '';
      this.CambioModel.Tasa = '';
      this.CambioModel.Moneda_Origen = value;
      this.CambioModel.Moneda_Destino = '2';
    }
  }

  ResetMonedaParaCambio() {
    this.MonedaParaCambio = {
      id: '',
      nombre: '',
      Valores: {
        Min_Venta_Efectivo: '0',
        Max_Venta_Efectivo: '0',
        Sugerido_Venta_Efectivo: '',
        Min_Compra_Efectivo: '0',
        Max_Compra_Efectivo: '0',
        Sugerido_Compra_Efectivo: '',
        Min_Venta_Transferencia: '',
        Max_Venta_Transferencia: '',
        Sugerido_Venta_Transferencia: '',
        Costo_Transferencia: '',
        Comision_Efectivo_Transferencia: '',
        Pagar_Comision_Desde: '',
        Min_No_Cobro_Transferencia: '',
      }
    };
  }

  guardarCambio(formulario: NgForm, item) {

    if (this.ValidateCambioBeforeSubmit()) {

      if (this.ValidacionTasaCambio()) {

        this.CambioModel.TotalPago == '' ? "0" : this.CambioModel.TotalPago;

        if (this.Venta) {
          this.CambioModel.Tipo = 'Venta';
          this.CambioModel.Estado = 'Realizado';
        } else {
          this.CambioModel.Tipo = 'Compra';
          this.CambioModel.Recibido = '0';
          this.CambioModel.Estado = 'Realizado';
        }

        // console.log(this.CambioModel);
        this.CambioModel.Id_Caja = this.generalService.SessionDataModel.idCaja;
        this.CambioModel.Id_Oficina = this.generalService.SessionDataModel.idOficina;

        let info = this.generalService.normalize(JSON.stringify(this.CambioModel));
        let datos = new FormData();
        datos.append("modulo", 'Cambio');
        datos.append("datos", info);
        datos.append("PagoTotal", this.TotalPagoCambio);

        this.http.post(this.globales.ruta + '/php/pos/guardar_cambio.php', datos).subscribe((data: any) => {
          //formulario.reset();
          let msg = this.Venta ? "Se ha guardado correctamente la venta!" : "Se ha guardado correctamente la compra!";

          this.LimpiarModeloCambio();
          this.confirmacionSwal.title = "Guardado con exito";
          this.confirmacionSwal.text = msg;
          this.confirmacionSwal.type = "success";
          this.confirmacionSwal.show();
          this.Cambios1 = true;
          this.Cambios2 = false;
          this.CargarCambiosDiarios();
        });
      }
    }
  }

  ObtenerVueltos() {

    if (this.Venta) {
      let pagoCon = this.CambioModel.Recibido;
      let recibido = this.CambioModel.Valor_Destino;

      // if (recibido == '' || recibido == undefined || isNaN(recibido)) {

      //   this.ShowSwal('warning', 'Alerta', 'Debe colocar primero el valor a cambiar!');
      //   this.CambioModel.Recibido = '';
      //   return;
      // }

      if (pagoCon == '' || pagoCon == undefined || isNaN(pagoCon)) {

        //this.ShowSwal('warning', 'alerta', 'El valor del campo "Pago Con" debe ser un valor numerico!');
        return;
      }

      recibido = parseFloat(recibido);
      pagoCon = parseFloat(pagoCon);

      if (pagoCon > 0) {

        if (pagoCon < recibido) {
          this.ShowSwal('warning', 'alerta', 'El valor a cambiar no puede ser mayor al valor recibido!');
          this.CambioModel.Recibido = '';
          return;
        } else {
          let vuelto = pagoCon - recibido;
          this.CambioModel.TotalPago = pagoCon;
          this.CambioModel.Vueltos = vuelto;
        }
      }
    }
  }

  conversionMoneda(tipo_cambio: string, tipo_moneda_origen: string) {
    //Tipo cambio posee 2 valores
    //o para origen, es decir que el cambio es desde la moneda local a moneda extranjera
    //e para extranjera, es decir que el cambio es desde moneda extrajera a moneda local

    //Tipo moneda origen posee 2 valores
    //l para local, es decir que el cambio es desde la moneda local a moneda extranjera
    //e para extranjera, es decir que el cambio es desde moneda extrajera a moneda local

    // console.log(tipo_cambio);
    // console.log(tipo_moneda_origen);      

    if (tipo_cambio == 'o') {
      if (this.ValidarAntesDeConversion(tipo_cambio)) {
        // console.log("entro");
        if (tipo_moneda_origen == 'l') {
          var cambio = Math.round(parseFloat(this.CambioModel.Valor_Origen) / parseFloat(this.CambioModel.Tasa));
          this.CambioModel.Valor_Destino = cambio;
        } else {
          var cambio = Math.round(parseFloat(this.CambioModel.Valor_Origen) * parseFloat(this.CambioModel.Tasa));
          // console.log(cambio);

          this.CambioModel.Valor_Destino = cambio;
        }
      }
    } else if (tipo_cambio == 'd') {
      if (this.ValidarAntesDeConversion(tipo_cambio)) {
        if (tipo_moneda_origen == 'l') {
          var cambio = Math.round(parseFloat(this.CambioModel.Valor_Destino) / parseFloat(this.CambioModel.Tasa));
          this.CambioModel.Valor_Origen = cambio;
        } else {
          var cambio = Math.round(parseFloat(this.CambioModel.Valor_Destino) * parseFloat(this.CambioModel.Tasa));
          this.CambioModel.Valor_Origen = cambio;
        }
      }
    }

    setTimeout(() => {
      this.ObtenerVueltos();
    }, 300);


    // if(this.ValidacionTasaCambio()){

    //   if (this.Venta == false) {

    //     var cambio = Math.round(parseFloat(this.CambioModel.Valor_Origen) * parseFloat(this.CambioModel.Tasa));
    //     this.CambioModel.Valor_Destino = cambio;
    //   } else {

    //     var cambio = Math.round(parseFloat(this.CambioModel.Valor_Origen) / parseFloat(this.CambioModel.Tasa));
    //     this.CambioModel.Valor_Destino = cambio;
    //   }
    // }
  }

  ValidarAntesDeConversion(tipo: string): boolean {
    // console.log("validando");

    if (!this.ValidacionTipoCambio(tipo))
      return false;

    if (!this.ValidacionTasa(tipo))
      return false;

    return true;
  }

  ValidacionTipoCambio(tipo: string): boolean {
    if (tipo == 'o') {
      // console.log("entro a validar origen");
      if (this.CambioModel.Valor_Origen == '' || this.CambioModel.Valor_Origen === undefined) {

        this.ShowSwal('warning', 'Alerta', 'Debe colocar el valor a cambiar!');
        //this.CambioModel.Tasa = '';
        this.CambioModel.Valor_Destino = '';
        return false;
      } else {
        // console.log("validar origen true");
        return true;
      }
    } else {
      // console.log("entro a validar destino");
      if (this.CambioModel.Valor_Destino == '' || this.CambioModel.Valor_Destino === undefined) {

        this.ShowSwal('warning', 'Alerta', 'Debe colocar el valor a cambiar!');
        //this.CambioModel.Tasa = '';
        this.CambioModel.Valor_Origen = '';
        return false;
      } else {
        // console.log("validar destino true");
        return true;
      }
    }
  }

  ValidacionTasa(tipo_cambio: string): boolean {
    // console.log("entro a validar tasa");
    if (this.CambioModel.Tasa == '' || this.CambioModel.Tasa == 0 || this.CambioModel.Tasa === undefined) {

      this.ShowSwal('warning', 'Tasa incorrecta', 'No se ha establecido una tasa de cambio!');
      this.CambioModel.Tasa = '';
      if (tipo_cambio == 'o') {
        this.CambioModel.Valor_Destino = '';
      } else {
        this.CambioModel.Valor_Origen = '';
      }
      return false;

    } else {
      // console.log("validando limites de tasa");
      let tasa = parseFloat(this.CambioModel.Tasa);

      if (this.Venta) {
        if (tasa > parseFloat(this.MonedaParaCambio.Valores.Max_Venta_Efectivo) || tasa < parseFloat(this.MonedaParaCambio.Valores.Min_Venta_Efectivo)) {
          this.ShowSwal('warning', 'Tasa Incorrecta', 'La tasa de cambio indicada es inferior/superior a los límites establecidos.\nRevise nuevamente.');
          this.CambioModel.Tasa = Math.round((parseFloat(this.MonedaParaCambio.Valores.Max_Venta_Efectivo) + parseFloat(this.MonedaParaCambio.Valores.Min_Venta_Efectivo)) / 2);
          if (tipo_cambio == 'o') {
            this.CambioModel.Valor_Destino = '';
            this.CambioModel.Valor_Origen = '';
          } else {
            this.CambioModel.Valor_Origen = '';
            this.CambioModel.Valor_Destino = '';
          }
          return false;
        } else {
          // console.log("limite venta true");
          return true;
        }
      } else {
        if (tasa > parseFloat(this.MonedaParaCambio.Valores.Max_Compra_Efectivo) || tasa < parseFloat(this.MonedaParaCambio.Valores.Min_Compra_Efectivo)) {
          this.ShowSwal('warning', 'Tasa Incorrecta', 'La tasa de cambio indicada es inferior/superior a los límites establecidos.\nRevise nuevamente.');
          this.CambioModel.Tasa = Math.round((parseFloat(this.MonedaParaCambio.Valores.Max_Compra_Efectivo) + parseFloat(this.MonedaParaCambio.Valores.Min_Compra_Efectivo)) / 2);
          if (tipo_cambio == 'o') {
            this.CambioModel.Valor_Destino = '';
          } else {
            this.CambioModel.Valor_Origen = '';
          }
          return false;
        } else {
          // console.log("limite compra true");
          return true;
        }
      }
    }
  }

  ValidacionTasaCambio() {
    if (this.CambioModel.Valor_Origen == '' || this.CambioModel.Valor_Origen == 0 || this.CambioModel.Valor_Origen === undefined) {

      this.ShowSwal('warning', 'Alerta', 'Debe colocar el valor a cambiar!');
      //this.CambioModel.Tasa = '';
      this.CambioModel.Valor_Destino = '';
      return false;
    } else {

      if (this.CambioModel.Tasa == '' || this.CambioModel.Tasa == 0 || this.CambioModel.Tasa === undefined) {

        this.ShowSwal('warning', 'Tasa incorrecta', 'No se ha establecido una tasa de cambio!');
        this.CambioModel.Tasa = '';
        this.CambioModel.Valor_Destino = '';
        return false;

      } else {

        let tasa = parseFloat(this.CambioModel.Tasa);

        if (this.Venta) {
          if (tasa > parseFloat(this.MonedaParaCambio.Valores.Max_Venta_Efectivo) || tasa < parseFloat(this.MonedaParaCambio.Valores.Min_Venta_Efectivo)) {
            this.ShowSwal('warning', 'Tasa Incorrecta', 'La tasa de cambio indicada es inferior/superior a los límites establecidos.\nRevise nuevamente.');
            this.CambioModel.Tasa = (parseFloat(this.MonedaParaCambio.Valores.Max_Venta_Efectivo) + parseFloat(this.MonedaParaCambio.Valores.Min_Venta_Efectivo)) / 2;
            this.CambioModel.Valor_Destino = '';
            return false;
          }
        } else {
          if (tasa > parseFloat(this.MonedaParaCambio.Valores.Max_Compra_Efectivo) || tasa < parseFloat(this.MonedaParaCambio.Valores.Min_Compra_Efectivo)) {
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
      setTimeout(() => {
        this.CargarCambiosDiarios();
      }, 300);
    });

  }

  tituloCambio = "Compras o Ventas";
  VerCambio(id, modal) {

    this.http.get(this.globales.ruta + '/php/cambio/get_detalle_cambio.php', { params: { id_cambio: id } }).subscribe((data: any) => {
      this.verCambio = data;


      modal.show();
    });

  }

  HabilitarCamposCambio() {

    if (this.Venta) {

      if (this.CambioModel.Moneda_Destino == '' || this.CambioModel.Moneda_Destino == undefined) {
        this.HabilitarCampos = true;
      } else {
        this.HabilitarCampos = false;
      }

    } else {

      if (this.CambioModel.Moneda_Origen == '' || this.CambioModel.Moneda_Origen == undefined) {
        this.HabilitarCampos = true;
      } else {
        this.HabilitarCampos = false;
      }
    }
  }

  LimpiarModeloCambio() {
    this.CambioModel = {
      Id_Cambio: '',
      Tipo: '',
      Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
      Id_Oficina: '5',
      Moneda_Origen: '',
      Moneda_Destino: '',
      Tasa: '',
      Valor_Origen: '',
      Valor_Destino: '',
      TotalPago: '',
      Vueltos: '0',
      Recibido: '',
      Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario
    };

    this.MonedaParaCambio = {
      id: '',
      nombre: '',
      Valores: {
        Min_Venta_Efectivo: '0',
        Max_Venta_Efectivo: '0',
        Sugerido_Venta_Efectivo: '',
        Min_Compra_Efectivo: '0',
        Max_Compra_Efectivo: '0',
        Sugerido_Compra_Efectivo: '',
        Min_Venta_Transferencia: '',
        Max_Venta_Transferencia: '',
        Sugerido_Venta_Transferencia: '',
        Costo_Transferencia: '',
        Comision_Efectivo_Transferencia: '',
        Pagar_Comision_Desde: '',
        Min_No_Cobro_Transferencia: '',
      }
    };

    this.HabilitarCampos = true;
    this.TotalPagoCambio = '';
    this.NombreMonedaTasaCambio = '';
  }

  ValidateCambioBeforeSubmit() {
    if (this.Venta) {

      if (this.CambioModel.Moneda_Destino == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe escoger una moneda para el cambio!');
        return false;

      } else if (this.CambioModel.Valor_Origen == '') {

        this.ShowSwal('warning', 'Alerta', 'El monto a cambiar no puede ser 0!');
        return false;

      } else if (this.CambioModel.Tasa == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe colocar una tasa para el cambio!');
        return false;

      } else if (this.CambioModel.Valor_Destino == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe recalcular el monto a entregar!');
        return false;

      } else if (this.CambioModel.Recibido == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe colocar el monto en el campo "Paga Con"!');
        return false;

      } else {

        return true;
      }

    } else {

      if (this.CambioModel.Moneda_Origen == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe escoger una moneda para el cambio!');
        return false;

      } else if (this.CambioModel.Valor_Origen == '') {

        this.ShowSwal('warning', 'Alerta', 'El monto a cambiar no puede ser 0!');
        return false;

      } else if (this.CambioModel.Tasa == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe colocar una tasa para el cambio!');
        return false;

      } else if (this.CambioModel.Valor_Destino == '') {

        this.ShowSwal('warning', 'Alerta', 'Debe recalcular el monto a entregar!');
        return false;

      } else {

        return true;
      }
    }
  }

  CargarCambiosDiarios() {
    this.Cambios = [];
    this.http.get(this.globales.ruta + 'php/cambio/lista_cambios_nuevo.php', { params: { funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Cambios = data.query_data;
      } else {

        this.Cambios = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }

    });
  }

  //#endregion

  //#region FUNCIONES TRANSFERENCIAS

  CalcularCambioMoneda(valor: string, tipo_cambio: string) {
    valor = valor.replace(/\./g, '');

    if (this.TransferenciaModel.Moneda_Destino == '') {
      this.ShowSwal('warning', 'Alerta', 'Debe escoger la moneda antes de realizar la conversión!');
      this.TransferenciaModel.Cantidad_Recibida = '';
      this.TransferenciaModel.Cantidad_Transferida = '';
      this.TransferenciaModel.Tasa_Cambio = '';
      return;
    }

    let tasa_cambio = this.TransferenciaModel.Tasa_Cambio;
    let value = parseFloat(valor);
    // console.log(value);


    switch (tipo_cambio) {
      case 'por origen':
        if (value > 0) {

          this.CalcularCambio(value, tasa_cambio, 'recibido');
        } else {
          this.LimpiarCantidades();
        }
        break;

      case 'por destino':
        if (value > 0) {

          this.CalcularCambio(value, tasa_cambio, 'transferencia');
        } else {
          this.LimpiarCantidades();
        }
        break;

      case 'por tasa':
        if (!this.ValidarTasaCambioModal(tasa_cambio)) {
          return;
        }

        let valor_recibido = parseFloat(this.TransferenciaModel.Cantidad_Recibida);

        if (value > 0) {
          this.CalcularCambio(valor_recibido, tasa_cambio, 'recibido');
        } else {
          this.LimpiarCantidades();
        }
        break;

      default:
        this.confirmacionSwal.title = "Tipo cambio erroneo: " + tipo_cambio;
        this.confirmacionSwal.text = "La opcion para la conversion de la moneda es erronea! Contacte con el administrador del sistema!";
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();
        break;
    }
  }

  public ColocarMontoSoloPesos(montoPesos: string) {
    if (montoPesos == '') {
      this.TransferenciaModel.Cantidad_Transferida = '';
      this.TransferenciaModel.Tasa_Cambio = 0;
    } else {
      montoPesos = montoPesos.replace(/\./g, '');

      this.TransferenciaModel.Cantidad_Transferida = montoPesos;
      this.TransferenciaModel.Tasa_Cambio = 0;
    }

    setTimeout(() => {
      this.AsignarValorTransferirDestinatario(montoPesos);
    }, 300);

    // console.log(this.TransferenciaModel);

  }

  LimpiarCantidades() {
    this.TransferenciaModel.Cantidad_Recibida = '';
    this.TransferenciaModel.Cantidad_Transferida = '';

    this.ListaDestinatarios.forEach((d, i) => {
      this.ListaDestinatarios[i].Valor_Transferencia = '';
    });
  }

  ValidarTasaCambio(tasa_cambio) {
    let max = parseFloat(this.MonedaParaTransferencia.Valores.Max_Compra_Efectivo);
    let min = parseFloat(this.MonedaParaTransferencia.Valores.Min_Compra_Efectivo);
    let sug = parseFloat(this.MonedaParaTransferencia.Valores.Sugerido_Compra_Efectivo);
    //tasa_cambio = parseFloat(tasa_cambio);

    // console.log(max);
    // console.log(min);
    // console.log(sug);
    // console.log(tasa_cambio);


    if (tasa_cambio > max || tasa_cambio < min) {
      this.TransferenciaModel.Tasa_Cambio = sug;
      this.confirmacionSwal.title = "Alerta";
      this.confirmacionSwal.text = "La tasa digitada es inferior/superior al mínimo(" + min + ")/máximo(" + max + ") establecido para la moneda"
      this.confirmacionSwal.type = "warning"
      this.confirmacionSwal.show();
      return false;
    }

    return true;
  }

  ValidarTasaCambioModal(tasa_cambio) {
    let max = parseFloat(this.MonedaParaTransferencia.Valores.Max_Compra_Efectivo);
    let min = parseFloat(this.MonedaParaTransferencia.Valores.Min_Compra_Efectivo);
    let sug = parseFloat(this.MonedaParaTransferencia.Valores.Sugerido_Compra_Efectivo);
    //tasa_cambio = parseFloat(tasa_cambio);

    if (tasa_cambio > max || tasa_cambio < min) {
      this.TransferenciaModel.Tasa_Cambio = sug;
      //ABRIR MODAL DE PERMISO PARA PROCEDER
      let p = { accion: "transferencia_cajero", value: tasa_cambio };
      this.permisoService._openSubject.next(p);
      return false;
    }

    return true;
  }

  ValidarCupoTercero(tipo: string, bolsa: number) {
    //EL TIPO SE REFIERE A ORIGEN DEL CAMBIO SI ES DESDE MONEDA RECBIDA O DESDE MONEDA DE TRANSFERENCIA
    //Valores: recibido para moneda recibida, transferencia para moneda de transferencia

    if (this.TransferenciaModel.Forma_Pago == 'Credito') {

      if (this.TransferenciaModel.Cupo_Tercero == '' || this.TransferenciaModel.Cupo_Tercero == '0' || this.TransferenciaModel.Cupo_Tercero == undefined) {
        this.ShowSwal('warning', 'Alerta', 'El tercero no posee un cupo de crédito disponible!');
        this.TransferenciaModel.Cantidad_Recibida = '';
        return false;
      }

      let cupo = parseFloat(this.TransferenciaModel.Cupo_Tercero);
      let valor_digitado = tipo == 'recibido' ? parseFloat(this.TransferenciaModel.Cantidad_Recibida) : (parseFloat(this.TransferenciaModel.Tasa_Cambio) * parseFloat(this.TransferenciaModel.Cantidad_Transferida));

      if (cupo < valor_digitado) {
        this.ShowSwal('warning', 'Alerta', 'El cupo disponible es menor a la cantidad recibida!');
        this.TransferenciaModel.Cantidad_Recibida = cupo;
        this.TransferenciaModel.Cantidad_Transferida = cupo / parseFloat(this.TransferenciaModel.Tasa_Cambio);

        let conversion_con_bolsa2 = (cupo / parseFloat(this.TransferenciaModel.Tasa_Cambio)) + bolsa;
        this.AsignarValorTransferirDestinatario(conversion_con_bolsa2);
        return false;
      }

      return true;
    } else {
      return true;
    }
  }

  ValidarBolsaBolivares() {

    if (this.TransferenciaModel.Forma_Pago == 'Credito') {
      if (this.MonedaParaTransferencia.nombre == 'Bolivares Soberanos') {
        if (this.TransferenciaModel.Bolsa_Bolivares == '' || this.TransferenciaModel.Bolsa_Bolivares == '0' || this.TransferenciaModel.Bolsa_Bolivares == undefined) {
          return true;
        } else {
          let bolsa = parseFloat(this.TransferenciaModel.Bolsa_Bolivares);
          let transferido = parseFloat(this.TransferenciaModel.Cantidad_Transferida);

          if (bolsa < transferido) {
            this.ShowSwal('warning', 'Alerta', 'El valor a transferir es mayor a la cantidad bolsa pendiente!');
            return false;
          } else {
            return true;
          }
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  CalcularCambio(valor: number, tasa: number, tipo: string, permisoJefe: boolean = false) {

    let conversion_moneda = 0;
    let bolsa = 0;
    if (this.TransferenciaModel.Bolsa_Bolivares != '0' && this.TransferenciaModel.Forma_Pago == "Credito") {
      bolsa = parseFloat(this.TransferenciaModel.Bolsa_Bolivares);
    }

    switch (tipo) {
      case 'recibido':

        if (!this.ValidarCupoTercero(tipo, bolsa)) {
          return;
        }

        if (!permisoJefe)
          if (!this.ValidarTasaCambio(tasa)) {
            return;
          }

        conversion_moneda = Math.round(valor / tasa);
        this.TransferenciaModel.Cantidad_Transferida = conversion_moneda;
        let conversion_con_bolsa = Math.round(valor / tasa) + bolsa;
        //this.AsignarValorDestinatarios(conversion_moneda, TotalTransferenciaDestinatario, count);
        this.AsignarValorTransferirDestinatario(conversion_con_bolsa);
        break;

      case 'transferencia':

        if (!this.ValidarCupoTercero(tipo, bolsa)) {
          return;
        }

        if (!this.ValidarTasaCambio(tasa)) {
          return;
        }

        conversion_moneda = Math.round(valor * tasa);
        this.TransferenciaModel.Cantidad_Recibida = Math.round(conversion_moneda);
        //this.AsignarValorDestinatarios(valor, TotalTransferenciaDestinatario, count);
        let conversion_con_bolsa2 = valor + bolsa;
        this.AsignarValorTransferirDestinatario(conversion_con_bolsa2);

        break;

      default:
        this.confirmacionSwal.title = "Opcion erronea o vacía: " + tipo;
        this.confirmacionSwal.text = "La opcion para la operacion es erronea! Contacte con el administrador del sistema!";
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();
        break;
    }
  }

  GetTotalTransferenciaDestinatarios(): number {

    let TotalTransferenciaDestinatario = 0;

    this.ListaDestinatarios.forEach(e => {
      // console.log(e.Valor_Transferencia);

      if (e.Valor_Transferencia == undefined || isNaN(e.Valor_Transferencia) || e.Valor_Transferencia == '') {
        TotalTransferenciaDestinatario += 0;
      } else {
        TotalTransferenciaDestinatario += Math.round(parseFloat(e.Valor_Transferencia));
      }
    });

    return TotalTransferenciaDestinatario;
  }

  AsignarValorDestinatarios(valor_conversion: number, total_transferencia_destinatarios: number, count: number): void {
    if (count == 1) {
      this.ListaDestinatarios[(count - 1)].Valor_Transferencia = valor_conversion;
    } else {

      if (valor_conversion > total_transferencia_destinatarios) {
        let acumulado = 0;
        this.ListaDestinatarios.forEach((d, i) => {
          if (i < (count - 1)) {

            if (d.Valor_Transferencia == undefined || isNaN(d.Valor_Transferencia) || d.Valor_Transferencia == '') {
              acumulado += 0;
            } else {
              acumulado += parseFloat(d.Valor_Transferencia);
            }
          } else if (i == (count - 1)) {

            let restante = valor_conversion - acumulado;
            this.ListaDestinatarios[i].Valor_Transferencia = restante;
          }

        });
      } else if (valor_conversion < total_transferencia_destinatarios) {
        this.ListaDestinatarios.forEach((d, i) => {
          this.ListaDestinatarios[i].Valor_Transferencia = '';
        });
      }
    }
  }

  AsignarValorTransferirDestinatario(valor) {

    if (valor == '' || valor == '0') {
      this.ListaDestinatarios.forEach(d => {
        d.Valor_Transferencia = '';
      });
      return;
    }

    valor = Math.round(parseFloat(valor));
    let total_destinatarios = this.GetTotalTransferenciaDestinatarios();
    let count = this.ListaDestinatarios.length;

    setTimeout(() => {
      this.Asignar(valor, total_destinatarios, count);
    }, 300);
  }

  Asignar(valor, total_destinatarios, count) {
    // if (this.TransferenciaModel.Bolsa_Bolivares != '' && this.TransferenciaModel.Bolsa_Bolivares != '0') {
    //   let valor_bolsa = Math.round(parseFloat(this.TransferenciaModel.Bolsa_Bolivares));
    //   let nuevo_valor = valor + valor_bolsa;

    //   console.log(valor);
    //   console.log(valor_bolsa);
    //   console.log(nuevo_valor);        
    //   console.log(total_destinatarios);

    //   if (nuevo_valor > total_destinatarios) {

    //     if(this.ListaDestinatarios[(count - 1)].Valor_Transferencia == ''){
    //       this.ListaDestinatarios[(count - 1)].Valor_Transferencia = '0';
    //     }
    //     let v_transferir = Math.round(parseFloat(this.ListaDestinatarios[(count - 1)].Valor_Transferencia));
    //     let operacion = v_transferir + (nuevo_valor - total_destinatarios);
    //     this.ListaDestinatarios[(count - 1)].Valor_Transferencia = operacion;

    //   }else if (nuevo_valor < total_destinatarios) {

    //     let resta = total_destinatarios;

    //     for (let index = count; index > 0; index--) {
    //       let valor_pos = Math.round(parseFloat(this.ListaDestinatarios[index - 1].Valor_Transferencia));

    //       resta -= Math.round(Number(valor_pos));

    //       if (resta > nuevo_valor) {

    //         this.ListaDestinatarios[index - 1].Valor_Transferencia = '0';

    //       }else if (resta < nuevo_valor && resta > valor) {
    //         let asignar = nuevo_valor - resta;
    //         this.ListaDestinatarios[index - 1].Valor_Transferencia = asignar;    
    //         if (asignar > 0) {
    //           break;
    //         }   

    //       }else if (resta < nuevo_valor && resta < valor) {
    //         let asignar = valor - resta;
    //         this.ListaDestinatarios[index - 1].Valor_Transferencia = asignar;    
    //         if (asignar > 0) {
    //           break;
    //         }   

    //       }else if (resta == nuevo_valor) {
    //         break;   
    //       }        
    //     }
    //   }

    // }else{

    if (this.ListaDestinatarios[0].Valor_Transferencia == '') {
      this.ListaDestinatarios[0].Valor_Transferencia = '0';
    }

    let v_transferir = parseFloat(this.ListaDestinatarios[0].Valor_Transferencia);
    let operacion = Math.round(v_transferir + (valor - total_destinatarios));
    this.ListaDestinatarios[0].Valor_Transferencia = operacion;

    // this.VerificarDestinatariosConTransferenciaMayorAlTotal();
    // }
  }

  VerificarDestinatariosConTransferenciaMayorAlTotal() {
    let total = 0;
    let total_transferido = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
    let index_colocar_cero_ramificado = 0;

    this.ListaDestinatarios.forEach((d: any, i: number) => {
      if (index_colocar_cero_ramificado == 0) {
        total += parseFloat(d.Valor_Transferencia);

        if (total > total_transferido) {
          index_colocar_cero_ramificado = i;
          let restante = total - total_transferido;
          this.ListaDestinatarios[i].Valor_Transferencia = restante;
        }
      } else {

        this.ListaDestinatarios[i].Valor_Transferencia = '';
      }
    });
  }

  ValidarValorTransferirDestinatario(valor, index) {

    if (this.TransferenciaModel.Forma_Pago == 'Credito') {
      if (this.MonedaParaTransferencia.nombre == 'Bolivares Soberanos') {
        if (this.TransferenciaModel.Bolsa_Bolivares == '' || this.TransferenciaModel.Bolsa_Bolivares == '0' || this.TransferenciaModel.Bolsa_Bolivares == undefined) {
          if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == '0' || this.TransferenciaModel.Cantidad_Transferida == undefined) {

            this.ListaDestinatarios[index].Valor_Transferencia = '';
            this.ShowSwal('warning', 'Alerta', 'Debe colocar primero el valor a transferir!');
            return;
          }

          if (valor == '') {
            this.ListaDestinatarios[index].Valor_Transferencia = '';
            return;
          }

          let transferir = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
          valor = parseFloat(valor).toFixed(4);
          let total_valor_destinatarios = this.GetTotalTransferenciaDestinatarios();

          if (total_valor_destinatarios > transferir) {

            let asignar = Math.round(valor - (total_valor_destinatarios - transferir));
            this.ListaDestinatarios[index].Valor_Transferencia = asignar;

          } else if (total_valor_destinatarios < transferir) {
          }
        } else {
          // console.log("asignando valor con bolsa de bolivares");

          if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == '0' || this.TransferenciaModel.Cantidad_Transferida == undefined) {
            this.ListaDestinatarios[index].Valor_Transferencia = '';
            this.ShowSwal('warning', 'Alerta', 'Debe colocar primero el valor a transferir!');
            return;
          }

          if (valor == '') {
            return;
          }

          let bolsa = Math.round(parseFloat(this.TransferenciaModel.Bolsa_Bolivares));
          let transferir = Math.round(parseFloat(this.TransferenciaModel.Cantidad_Transferida));
          let total_sumado = bolsa + transferir;
          valor = Math.round(parseFloat(valor));
          let total_valor_destinatarios = this.GetTotalTransferenciaDestinatarios();

          if (total_valor_destinatarios > total_sumado) {

            let asignar = Math.round(valor - (total_valor_destinatarios - total_sumado));
            this.ListaDestinatarios[index].Valor_Transferencia = asignar.toFixed(4);

          } else if (total_valor_destinatarios < total_sumado) {

            let restante = - (total_valor_destinatarios - total_sumado);
            this.Bolsa_Restante = Math.round(restante).toString();
          }
        }
      }
    } else {
      if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == '0' || this.TransferenciaModel.Cantidad_Transferida == undefined) {

        this.ListaDestinatarios[index].Valor_Transferencia = '';
        this.ShowSwal('warning', 'Alerta', 'Debe colocar primero el valor a transferir!');
        return;
      }

      if (valor == '') {
        this.ListaDestinatarios[index].Valor_Transferencia = '0';
        return;
      }

      let total_transferir = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
      valor = parseFloat(valor.replace(/\./g, ''));
      let total_valor_destinatarios = this.GetTotalTransferenciaDestinatarios();
      let total_destinatarios_real = total_valor_destinatarios - valor;
      let conteo = this.ListaDestinatarios.length - 1;

      if (valor > total_transferir) {
        // this.ListaDestinatarios[index].Valor_Transferencia = '0';
        this.ListaDestinatarios[index].Valor_Transferencia = total_transferir - total_destinatarios_real;
        let toastObj = { textos: ["Alerta", "El valor que coloco supera el total a transferir!"], tipo: "warning", duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      } else if (total_valor_destinatarios > total_transferir) {
        // this.ListaDestinatarios[index].Valor_Transferencia = '0';
        this.ListaDestinatarios[index].Valor_Transferencia = (total_valor_destinatarios - valor) - total_transferir;
        let toastObj = { textos: ["Alerta", "El valor que coloco supera el total a transferir!"], tipo: "warning", duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      } else if (total_valor_destinatarios <= total_transferir) {
        let asignar = Math.round(parseFloat(valor));
        let asignar_siguiente = Math.round(total_transferir - total_valor_destinatarios);
        this.ListaDestinatarios[index].Valor_Transferencia = asignar;

        if (index < conteo) {
          this.ListaDestinatarios[(index + 1)].Valor_Transferencia = parseFloat(this.ListaDestinatarios[(index + 1)].Valor_Transferencia) > 0 ? this.ListaDestinatarios[(index + 1)].Valor_Transferencia : asignar_siguiente;
        }

        this.VerificarDestinatariosConTransferenciaMayorAlTotal();
      }
    }
  }

  ValidarValorTransferirDestinatario2(valor, index) {
    if (valor == '') {
      this.ListaDestinatarios[index].Valor_Transferencia = '';

    } else if (this.TransferenciaModel.Forma_Pago == 'Credito') {
      if (this.TransferenciaModel.Bolsa_Bolivares != '0') {
        //ASIGNAR VALORES TOMANDO EN CUENTA LA BOLSA DE BOLIVARES
        // console.log("asignando valor con bolsa");
        this._asignarValoresConBolsaBolivares(valor, index);
      } else {
        //ASIGNAR VALORES NORMALMENTE
        // console.log("asignando valor sin bolsa");
        this._asignarValoresSinBolsaBolivares(valor, index);
      }
    } else {
      //ASIGNAR VALORES NORMALMENTE
      // console.log("asignando valor sin bolsa");
      this._asignarValoresSinBolsaBolivares(valor, index);
    }
  }

  private _asignarValoresSinBolsaBolivares(valor, i) {
    if (this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == '0' || this.TransferenciaModel.Cantidad_Transferida == undefined) {

      this.ListaDestinatarios[i].Valor_Transferencia = '';
      this.ShowSwal('warning', 'Alerta', 'Debe colocar primero el valor a transferir!');
      return;
    }

    if (valor == '') {
      this.ListaDestinatarios[i].Valor_Transferencia = '0';
      return;
    }

    // console.log(valor);
    // console.log(i);      

    let total_transferir = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
    // console.log("total_transferir: ", total_transferir);
    valor = parseFloat(valor.replace(/\./g, ''));
    // console.log("valor: ", valor);
    let total_valor_destinatarios = this.GetTotalTransferenciaDestinatarios();
    // console.log("total_valor_destinatarios: ", total_valor_destinatarios);
    let total_destinatarios_real = total_valor_destinatarios - valor;
    // console.log("total_destinatarios_real: ", total_destinatarios_real);
    let conteo = this.ListaDestinatarios.length - 1;
    // console.log("conteo: ", conteo);

    // if (valor > total_transferir) {
    //   // this.ListaDestinatarios[index].Valor_Transferencia = '0';
    //   this.ListaDestinatarios[i].Valor_Transferencia = total_transferir - total_destinatarios_real;
    //   let toastObj = {textos:["Alerta", "El valor que coloco supera el total a transferir!"], tipo:"warning", duracion:4000};
    //   this._toastService.ShowToast(toastObj);
    // }else if (total_valor_destinatarios > total_transferir) {
    //   // this.ListaDestinatarios[i].Valor_Transferencia = '0';
    //   this.ListaDestinatarios[i].Valor_Transferencia = (total_valor_destinatarios - valor) - total_transferir;
    //   let toastObj = {textos:["Alerta", "El valor que coloco supera el total a transferir!"], tipo:"warning", duracion:4000};
    //   this._toastService.ShowToast(toastObj);
    // }else if(total_valor_destinatarios <= total_transferir){
    //   let asignar = Math.round(valor);
    //   let asignar_siguiente = Math.round(total_transferir - total_valor_destinatarios);
    //   console.log(asignar_siguiente);

    //   this.ListaDestinatarios[i].Valor_Transferencia = asignar;

    //   if (i < conteo) {
    //     this.ListaDestinatarios[(i+1)].Valor_Transferencia = parseFloat(this.ListaDestinatarios[(i+1)].Valor_Transferencia) > 0 ? this.ListaDestinatarios[(i+1)].Valor_Transferencia : asignar_siguiente;  
    //   }

    //   this.VerificarDestinatariosConTransferenciaMayorAlTotal();
    // }  

    if ((valor > total_transferir) || (total_valor_destinatarios > total_transferir)) {
      this.ListaDestinatarios[i].Valor_Transferencia = valor - (total_valor_destinatarios - total_transferir);
      let toastObj = { textos: ["Alerta", "El valor que coloco supera el total a transferir!"], tipo: "warning", duracion: 4000 };
      this._toastService.ShowToast(toastObj);
    } else if (total_valor_destinatarios <= total_transferir) {
      let asignar_siguiente = total_transferir - total_valor_destinatarios;
      // console.log(asignar_siguiente);

      this.ListaDestinatarios[i].Valor_Transferencia = valor;

      if (i < conteo) {
        this.ListaDestinatarios[(i + 1)].Valor_Transferencia = parseFloat(this.ListaDestinatarios[(i + 1)].Valor_Transferencia) > 0 ? this.ListaDestinatarios[(i + 1)].Valor_Transferencia : asignar_siguiente;
      }

      this.VerificarDestinatariosConTransferenciaMayorAlTotal();
    }
  }

  private _asignarValoresConBolsaBolivares(valor, i) {
    let bolsa_bolivares = parseFloat(this.TransferenciaModel.Bolsa_Bolivares);
    let transferir = (this.TransferenciaModel.Cantidad_Transferida == '' || isNaN(this.TransferenciaModel.Cantidad_Transferida)) ? 0 : parseFloat(this.TransferenciaModel.Cantidad_Transferida);
    let total_valor_destinatarios = this.GetTotalTransferenciaDestinatarios();
    let transferir_con_bolsa = bolsa_bolivares + transferir;
    valor = parseFloat(valor.replace(/\./g, ''));

    if (total_valor_destinatarios > transferir_con_bolsa) {

      let asignar = Math.round(valor - (total_valor_destinatarios - transferir_con_bolsa));
      this.ListaDestinatarios[i].Valor_Transferencia = asignar;

    } else if (total_valor_destinatarios < transferir_con_bolsa) {
      this.ListaDestinatarios[i].Valor_Transferencia = valor;
    }
  }

  ValidarCantidadTransferidaDestinatarios() {

    let totalDestinatarios = this.GetTotalTransferenciaDestinatarios();

    if (this.TransferenciaModel.Forma_Pago == 'Credito') {
      if (this.MonedaParaTransferencia.nombre == 'Bolivares Soberanos') {
        if (this.TransferenciaModel.Bolsa_Bolivares == '' || this.TransferenciaModel.Bolsa_Bolivares == '0' || this.TransferenciaModel.Bolsa_Bolivares == undefined) {
          return true;
        } else {
          let bolsa = Math.round(parseFloat(this.TransferenciaModel.Bolsa_Bolivares));
          let transferido = Math.round(parseFloat(this.TransferenciaModel.Cantidad_Transferida));
          let total = bolsa + transferido;

          if (totalDestinatarios > total) {
            this.ShowSwal('warning', 'Alerta', 'La suma del valor a transferir entre los destinatarios es mayor al máximo total a transferir!');
            return false;
          } else {
            return true;
          }
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  GuardarTransferencia(formulario: NgForm) {
    let forma_pago = this.TransferenciaModel.Forma_Pago;

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
        this.ShowSwal("warning", "Alerta", "Tipo de Transferencia erronea");
        break;
    }
  }

  GuardarTransferenciaEfectivo() {

    let tipo_transferencia = this.TransferenciaModel.Tipo_Transferencia;
    let total_a_transferir = isNaN(Math.round(parseFloat(this.TransferenciaModel.Cantidad_Transferida))) ? 0 : Math.round(parseFloat(this.TransferenciaModel.Cantidad_Transferida));
    let total_suma_transferir_destinatarios = this.GetTotalTransferenciaDestinatarios();
    this.TransferenciaModel.Identificacion_Funcionario = this.funcionario_data.Identificacion_Funcionario;

    if (!this.ValidateBeforeSubmit()) {
      return;
    }

    switch (tipo_transferencia) {
      case 'Transferencia':

        if (this.TransferenciaModel.Bolsa_Bolivares != '0') {
          // console.log(total_suma_transferir_destinatarios);
          // console.log((parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir));
          // console.log(parseFloat(this.TransferenciaModel.Bolsa_Bolivares));
          // console.log(total_a_transferir);

          if (total_suma_transferir_destinatarios > 0) {
            let restante_bolsa = Math.round(((parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir) - total_suma_transferir_destinatarios)).toString();
            if (total_suma_transferir_destinatarios < (parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir)) {
              this.TransferenciaModel.Cantidad_Transferida_Con_Bolivares = total_suma_transferir_destinatarios;
            } else if (total_suma_transferir_destinatarios >= (parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir)) {
              this.TransferenciaModel.Cantidad_Transferida_Con_Bolivares = parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir;
            }
            // console.log(this.TransferenciaModel);

            this.SaveTransferencia(restante_bolsa);
          } else {
            this.ShowSwal('warning', 'Alerta', 'No se han cargado valores para transferir, ya sea en los destinatarios o en los datos de la transferencia!');
          }

          // if (this.TransferenciaModel.Forma_Pago == 'Credito') {
          //   if (total_suma_transferir_destinatarios > 0) {
          //     let restante_bolsa = Math.round(((parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir) - total_suma_transferir_destinatarios)).toString();  
          //     this.SaveTransferencia(restante_bolsa);
          //   }else{
          //     this.ShowSwal('warning', 'Alerta', 'No se han cargado valores para transferir, ya sea en los destinatarios o en los datos de la transferencia!');
          //   }
          //   if (total_suma_transferir_destinatarios <= (parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir)) {
          //     let restante_bolsa = Math.round(((parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir) - total_suma_transferir_destinatarios)).toString();

          //     this.SaveTransferencia(restante_bolsa);
          //   }else{
          //     this.ShowSwal('warning', 'Alerta', 'La suma total del monto a transferir de los destinatarios es mayor que el total asignado a la transferencia!');
          //   }
          // }else{
          //   if (total_suma_transferir_destinatarios <= (parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir)) {
          //     let restante_bolsa = Math.round(((parseFloat(this.TransferenciaModel.Bolsa_Bolivares) + total_a_transferir) - total_suma_transferir_destinatarios)).toString();

          //     this.SaveTransferencia(restante_bolsa);
          //   }else{
          //     this.ShowSwal('warning', 'Alerta', 'La suma total del monto a transferir de los destinatarios es mayor que el total asignado a la transferencia!');
          //   }
          // }

        } else {

          if (total_suma_transferir_destinatarios > 0 && total_a_transferir == total_suma_transferir_destinatarios) {

            this.SaveTransferencia();
          } else {
            this.ShowSwal('warning', 'Alerta', 'El total repartido entre los destinatarios es mayor al total a entegar');
          }
        }
        break;

      case 'Cliente':

        let info = this.generalService.normalize(JSON.stringify(this.TransferenciaModel));
        let datos = new FormData();
        datos.append("datos", info);
        datos.append('id_oficina', this.IdOficina);
        // console.log(info);

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
            this.movimientoExitosoSwal.show();
            this.Transferencia1 = true;
            this.Transferencia2 = false;
            this.CargarTransferenciasDiarias();
            this.TransferenciaModel.Moneda_Destino = this._getIdMoneda('bolivares soberanos');
            this._getMonedasExtranjeras();
          });
        break;

      default:
        break;
    }
  }

  SaveTransferencia(bolsa = '') {
    this.TransferenciaModel.Id_Tercero_Destino = '0';

    let info = this.generalService.normalize(JSON.stringify(this.TransferenciaModel));
    let destinatarios = this.generalService.normalize(JSON.stringify(this.ListaDestinatarios));
    //return;

    let datos = new FormData();
    datos.append("datos", info);
    datos.append("destinatarios", destinatarios);
    datos.append('id_oficina', this.IdOficina);

    if (bolsa != '') {
      datos.append("bolsa_restante", bolsa);
    }
    this.http.post(this.globales.ruta + 'php/pos/guardar_transferencia.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        // this.TransferenciaModel.Cantidad_Transferida = '';
        this.errorSwal.show();
        return this.handleError(error);
      }).subscribe((data: any) => {
        this.LimpiarBancosDestinatarios(this.ListaDestinatarios);
        this.LimpiarModeloTransferencia();
        this.SetTransferenciaDefault();
        this.transferenciaExitosaSwal.show();
        this.Transferencia1 = true;
        this.Transferencia2 = false;
        this.CargarTransferenciasDiarias();
        this.TransferenciaModel.Moneda_Destino = this._getIdMoneda('bolivares soberanos');
        this._getMonedasExtranjeras();
      });
  }

  EditarDest2(id: string, accion: string, posicionDestinatario: string) {
    if (accion == 'crear especial') {

      let v = this.ListaDestinatarios[posicionDestinatario].Numero_Documento_Destino;

      if (v == '') {
        return;
      }

      let p = { id_destinatario: v };
      this.destinatarioService.validarExistenciaDestinatario(p).subscribe((data) => {

        if (data == 0) {
          var longitud = this.LongitudCarateres(v);
          if (longitud > 6) {
            this.PosicionDestinatarioActivo = posicionDestinatario;
            let objModal = { id_destinatario: id, accion: accion };
            this.AbrirModalDestinatario.next(objModal);

          } else if (longitud < 6) {

          }
        }
      });
    } else if (accion == 'editar cuentas') {

      this.PosicionDestinatarioActivo = posicionDestinatario;
      let objModal = { id_destinatario: id, accion: accion };
      this.AbrirModalDestinatario.next(objModal);
    }
  }

  ValidateTransferenciaBeforeSubmit() {
    if (this.TransferenciaModel.Documento_Origen) {

    }
  }

  LimpiarModeloTransferencia(dejarFormaPago: boolean = false, dejarTipoTransferencia: boolean = false) {
    //MODELO PARA TRANSFERENCIAS
    this.TransferenciaModel = {
      Forma_Pago: dejarFormaPago ? this.TransferenciaModel.Forma_Pago : 'Efectivo',
      Tipo_Transferencia: dejarTipoTransferencia ? this.TransferenciaModel.Tipo_Transferencia : 'Transferencia',

      //DATOS DEL CAMBIO
      Moneda_Origen: '2',
      Moneda_Destino: '',
      Cantidad_Recibida: '',
      Cantidad_Transferida: '',
      Cantidad_Transferida_Con_Bolivares: '0',
      Tasa_Cambio: '',
      Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
      Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
      Observacion_Transferencia: '',

      //DATOS REMITENTE
      Documento_Origen: '',
      Nombre_Remitente: '',
      Telefono_Remitente: '',

      //DATOS CREDITO
      Cupo_Tercero: 0,
      Bolsa_Bolivares: '0',

      //DATOS CONSIGNACION
      Id_Cuenta_Bancaria: '',
      Tipo_Origen: 'Remitente',
      Tipo_Destino: 'Destinatario'
    };

    this.ListaDestinatarios = [
      {
        id_destinatario_transferencia: '',
        Numero_Documento_Destino: '',
        Nombre_Destinatario: '',
        Id_Destinatario_Cuenta: '',
        Valor_Transferencia: '',
        Cuentas: [],
        EditarVisible: false
      }
    ];

    this.MonedaParaTransferencia = {
      id: '',
      nombre: '',
      Valores: {
        Min_Venta_Efectivo: '',
        Max_Venta_Efectivo: '',
        Sugerido_Venta_Efectivo: '',
        Min_Compra_Efectivo: '',
        Max_Compra_Efectivo: '',
        Sugerido_Compra_Efectivo: '',
        Min_Venta_Transferencia: '',
        Max_Venta_Transferencia: '',
        Sugerido_Venta_Transferencia: '',
        Costo_Transferencia: '',
        Comision_Efectivo_Transferencia: '',
        Pagar_Comision_Desde: '',
        Min_No_Cobro_Transferencia: '',
      }
    };

    this.id_remitente = '';
    this.tercero_credito = '';
  }

  LimpiarBancosDestinatarios(listaLimpiar) {
    listaLimpiar.forEach(e => {
      e.Cuentas = [];
      e.id_destinatario_transferencia = '';
    });
  }

  SetTransferenciaDefault() {
    this.ControlVisibilidadTransferencia.DatosCambio = true;
    this.ControlVisibilidadTransferencia.Destinatarios = true;
    this.ControlVisibilidadTransferencia.DatosRemitente = true;
    this.ControlVisibilidadTransferencia.DatosCredito = false;
    this.ControlVisibilidadTransferencia.DatosConsignacion = false;
    this.ControlVisibilidadTransferencia.SelectCliente = false;
  }

  AutoCompletarTerceroCredito(datos_tercero) {

    if (typeof (datos_tercero) == 'object') {

      this.TransferenciaModel.Documento_Origen = datos_tercero.Id_Tercero;
      this.TransferenciaModel.Cupo_Tercero = datos_tercero.Cupo;
      this.TransferenciaModel.Bolsa_Bolivares = datos_tercero.Bolsa_Bolivares;
      if (datos_tercero.Bolsa_Bolivares != '0') {
        this.DeshabilitarValor = false;
      } else {
        this.DeshabilitarValor = true;
      }
    } else {
      this.TransferenciaModel.Documento_Origen = '';
      this.TransferenciaModel.Cupo_Tercero = '';
      this.TransferenciaModel.Bolsa_Bolivares = '0';

    }

  }

  ValidarValorRecibidoCredito() {

    let cupo = (this.TransferenciaModel.Cupo_Tercero == '' || this.TransferenciaModel.Cupo_Tercero == '0' || isNaN(this.TransferenciaModel.Cupo_Tercero)) ? 0 : parseFloat(this.TransferenciaModel.Cupo_Tercero);
    let recibido = parseFloat(this.TransferenciaModel.Cantidad_Recibida);

    if (cupo == 0) {
      this.ShowSwal('warning', 'Alerta', 'El tercero no posee crédito disponible o no se ha cargado la información del tercero');
      this.TransferenciaModel.Cantidad_Recibida = '';
      return false;
    }

    if (recibido == 0) {
      this.ShowSwal('warning', 'Alerta', 'Debe colocar un valor en este campo');
      return false;
    }

    if (recibido > cupo) {
      this.ShowSwal('warning', 'Alerta', 'No puede asignar un monto mayor al cupo disponible');
      this.TransferenciaModel.Cantidad_Recibida = cupo;
      this.CalcularCambioMoneda(cupo.toString(), 'por origen');
      return true;
    }

    return true;
  }

  ValidarValorTransferenciaCredito() {

    let moneda_cambio = this.TransferenciaModel.Moneda_Destino;

    if (moneda_cambio == 1) {

      let transferido = parseFloat(this.TransferenciaModel.Cantidad_Transferida);
      let bolsa = (this.TransferenciaModel.Bolsa_Bolivares == '0' || isNaN(this.TransferenciaModel.Bolsa_Bolivares)) ? 0 : parseFloat(this.TransferenciaModel.Bolsa_Bolivares);

      // console.log(bolsa);        

      if (bolsa == 0) {
        return true;
      }

      if (transferido == 0) {
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

  AgregarDestinatarioTransferencia() {

    // if (this.TransferenciaModel.Cantidad_Recibida > 0) {

    let listaDestinatarios = this.ListaDestinatarios;
    for (let index = 0; index < listaDestinatarios.length; index++) {

      if (listaDestinatarios[index].Numero_Documento_Destino == 0 || listaDestinatarios[index].Numero_Documento_Destino == '' || listaDestinatarios[index].Numero_Documento_Destino === undefined) {
        this.ShowSwal('warning', 'Alerta', 'Debe anexar toda la información del(de los) destinatario(s) antes de agregar uno nuevo');
        return;
      }

      if (listaDestinatarios[index].Id_Destinatario_Cuenta == '' || listaDestinatarios[index].Id_Destinatario_Cuenta === undefined) {
        this.ShowSwal('warning', 'Alerta', 'Debe anexar la información del(de los) destinatario(s) antes de agregar uno nuevo');
        return;
      }

      // if(listaDestinatarios[index].Valor_Transferencia == '' || listaDestinatarios[index].Valor_Transferencia === undefined){
      //   this.ShowSwal('warning', 'Alerta', 'Debe anexar la información del(de los) destinatario(s) antes de agregar uno nuevo');
      //   return;
      // }      
    }

    let nuevoDestinatario = {
      id_destinatario_transferencia: '',
      Numero_Documento_Destino: '',
      Nombre_Destinatario: '',
      Id_Destinatario_Cuenta: '',
      Valor_Transferencia: '',
      Cuentas: [],
      EditarVisible: false,
      Id_Moneda: this.MonedaParaTransferencia.id
    };

    this.ListaDestinatarios.push(nuevoDestinatario);
    this.HabilitarCampoValor();
    // }else{
    //   this.ShowSwal('warning','Alerta','Debe colocar la cantidad a transferir antes de agregar destinatarios!');
    // }
  }

  HabilitarCampoValor() {
    if (this.ListaDestinatarios.length > 1) {
      this.DeshabilitarValor = false;
    } else {
      this.DeshabilitarValor = true;
    }
  }

  SetMonedaTransferencia(value) {
    // console.log(value);
    // console.log(this.Monedas);

    this.MonedaParaTransferencia.id = value;
    this.TransferenciaModel.Moneda_Destino = value;
    this.SetMonedaDestinatarios(value);
    // if (value != '') {         
    //   this._actualizarCuentasDestinatarios();
    // }else{
    //   this._limpiarCuentasBancarias();
    // }

    if (value != '') {
      this._actualizarCuentasDestinatarios();
      let c = this.Monedas.find(x => x.Id_Moneda == value);
      this.MonedaParaTransferencia.nombre = c.Nombre;

      if (c.Nombre == 'Pesos') {
        this.TransferenciaPesos = true;
        this.MonedaParaTransferencia = {
          id: value,
          nombre: c.Nombre,
          Valores: {
            Min_Venta_Efectivo: '',
            Max_Venta_Efectivo: '',
            Sugerido_Venta_Efectivo: '',
            Min_Compra_Efectivo: '',
            Max_Compra_Efectivo: '',
            Sugerido_Compra_Efectivo: '',
            Min_Venta_Transferencia: '',
            Max_Venta_Transferencia: '',
            Sugerido_Venta_Transferencia: '',
            Costo_Transferencia: '',
            Comision_Efectivo_Transferencia: '',
            Pagar_Comision_Desde: '',
            Min_No_Cobro_Transferencia: '',
          }
        };
      } else {
        this.TransferenciaPesos = false;
        this.http.get(this.globales.ruta + 'php/monedas/buscar_valores_moneda.php', { params: { id_moneda: value } }).subscribe((data: any) => {
          this.MonedaParaTransferencia.Valores = data.query_data;

          this.TransferenciaModel.Tasa_Cambio = data.query_data.Sugerido_Compra_Efectivo;

          if (this.MonedaParaTransferencia.nombre == 'Bolivares Soberanos') {
            this.InputBolsaBolivares = true;
          } else {
            this.InputBolsaBolivares = false;
          }
        });
      }
    } else {
      this._limpiarCuentasBancarias();
      this.MonedaParaTransferencia.nombre = '';
      this.TransferenciaModel.Tasa_Cambio = '';
      this.InputBolsaBolivares = false;
    }
  }

  private _actualizarCuentasDestinatarios() {
    // console.log("actualizando cuentas destinatarios por cambio de moneda");

    if (this.ListaDestinatarios.length > 0) {
      let id_destinatarios = this._concatenarDocumentosDestinatarios();
      if (id_destinatarios != '') {
        let p = { moneda: this.MonedaParaTransferencia.id, ids: id_destinatarios };
        // console.log("parametros consulta", p);
        this.destinatarioService.GetCuentasDestinatarios(p).subscribe((data: any) => {
          // console.log(data);

          if (data.destinatarios.length > 0) {
            data.destinatarios.forEach((id_dest, i) => {
              // console.log(id_dest);

              let index_dest = this.ListaDestinatarios.findIndex(x => x.Numero_Documento_Destino == id_dest);
              this.ListaDestinatarios[index_dest].Cuentas = data.cuentas[i];
              if (data.cuentas[i].length == 0) {
                this.ListaDestinatarios[index_dest].Id_Destinatario_Cuenta = '';
              }
            });
          }

          // if (data.codigo == 'success') {
          // data.query_data.forEach((cuentas,i) => {
          //   this.ListaDestinatarios[i].Cuentas = cuentas;
          // });
          // }else{
          //   this.swalService.ShowMessage(data);
          // }
        });
      }
    }
  }

  private _limpiarCuentasBancarias() {
    if (this.ListaDestinatarios.length > 1) {
      this.ListaDestinatarios.forEach((d, i) => {
        this.ListaDestinatarios[i].Cuentas = [];
      });
    }
  }

  private _concatenarDocumentosDestinatarios() {
    let ids = '';
    this.ListaDestinatarios.forEach(d => {
      // console.log(d);
      if (d.Numero_Documento_Destino != '') {

        ids += d.Numero_Documento_Destino + ',';
      }
    });

    return ids;
  }

  SetMonedaDestinatarios(idMoneda) {
    this.ListaDestinatarios.forEach(d => {
      d.Id_Moneda = idMoneda;
    });
  }

  ValidateBeforeSubmit() {

    let Forma_Pago = this.TransferenciaModel.Forma_Pago;
    let tipo = this.TransferenciaModel.Tipo_Transferencia;

    if (Forma_Pago == 'Efectivo' && tipo == 'Transferencia') {
      //VALIDAR DESTINATARIOS
      //VALIDAR DATOS DEL CAMBIO
      //VALIDAR DATOS DEL REMITENTE

      let qty_destinatarios = this.ListaDestinatarios.length;
      for (let index = 0; index < (qty_destinatarios); index++) {
        let d = this.ListaDestinatarios[index];
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
        if (!this.TransferenciaPesos) {
          this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
          return false;
        }

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

    } else if (Forma_Pago == 'Efectivo' && tipo == 'Cliente') {
      //VALIDAR DESTINATARIO
      //VALIDAR DATOS DEL CAMBIO
      //VALIDAR DATOS DEL REMITENTE

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == 0 || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado un destinatario para la transferencia!');
        return false;
      }

      if (this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == 0 || this.TransferenciaModel.Cantidad_Recibida == undefined) {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if (this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == 0 || this.TransferenciaModel.Tasa_Cambio == undefined) {
        if (!this.TransferenciaPesos) {
          this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
          return false;
        }
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

    } else if (Forma_Pago == 'Credito' && tipo == 'Transferencia') {
      //VALIDAR TERCERO CREDITO
      //VALIDAR DESTINATARIOS
      //VALIDAR DATOS DEL CAMBIO

      if (this.TransferenciaModel.Documento_Origen == '' || this.TransferenciaModel.Documento_Origen == 0 || this.TransferenciaModel.Documento_Origen == undefined) {
        this.ShowSwal('warning', 'Alerta', 'Debe agregar un tercero antes de guardar una transferencia');
        return false;
      }

      let qty_destinatarios = this.ListaDestinatarios.length;
      this.ListaDestinatarios.forEach(d => {
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

      if ((this.TransferenciaModel.Cantidad_Recibida == '' || this.TransferenciaModel.Cantidad_Recibida == 0 || this.TransferenciaModel.Cantidad_Recibida == undefined) && this.TransferenciaModel.Bolsa_Bolivares == '0') {
        this.ShowSwal('warning', 'Alerta', 'La cantidad recibida no puede ser 0 o no se ha asignado!');
        return false;
      }

      if ((this.TransferenciaModel.Tasa_Cambio == '' || this.TransferenciaModel.Tasa_Cambio == 0 || this.TransferenciaModel.Tasa_Cambio == undefined) && this.TransferenciaModel.Bolsa_Bolivares == '0') {
        this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
        return false;
      }

      if ((this.TransferenciaModel.Cantidad_Transferida == '' || this.TransferenciaModel.Cantidad_Transferida == 0 || this.TransferenciaModel.Cantidad_Transferida == undefined) && this.TransferenciaModel.Bolsa_Bolivares == '0') {
        this.ShowSwal('warning', 'Alerta', 'La cantidad transferida no puede ser 0 o no se ha asignado!');
        return false;
      }

      return true;

    } else if (Forma_Pago == 'Credito' && tipo == 'Cliente') {
      //AQUI NO SE HACEN VALIDACIONES YA QUE NO PUEDE HABER UNA TRANSFERENCIA CREDITO EN ESTE FORMATO
      this.ShowSwal('warning', 'Alerta', 'La forma de pago credito no permite tipos de pago a clientes!');
      return false;

    } else if (Forma_Pago == 'Consignacion' && tipo == 'Transferencia') {
      //VALIDAR CONSIGNACION
      //VALIDAR DESTINATARIOS
      //VALIDAR DATOS DEL CAMBIO
      //VALIDAR DATOS DEL REMITENTE

      if (this.TransferenciaModel.Id_Cuenta_Bancaria == '' || this.TransferenciaModel.Id_Cuenta_Bancaria == 0 || this.TransferenciaModel.Id_Cuenta_Bancaria == undefined) {
        this.ShowSwal('warning', 'Alerta', 'No se ha asignado la cuenta para la consignacion!');
        return false;
      }

      this.ListaDestinatarios.forEach(d => {
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
        if (!this.TransferenciaPesos) {
          this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
          return false;
        }
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

    } else if (Forma_Pago == 'Consignacion' && tipo == 'Cliente') {
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
        if (!this.TransferenciaPesos) {
          this.ShowSwal('warning', 'Alerta', 'La tasa de cambio no ha sido asignada!');
          return false;
        }
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

  AutoCompletarDestinatario(modelo, i, listaDestinatarios) {

    //let validacion = this.BuscarCedulaRepetida(modelo, i, listaDestinatarios);
    if (typeof (modelo) == 'object') {
      // if(validacion){
      //   return;
      // };

      if (modelo.Cuentas != undefined) {
        listaDestinatarios[i].Numero_Documento_Destino = modelo.Id_Destinatario;
        listaDestinatarios[i].Nombre_Destinatario = modelo.Nombre;
        listaDestinatarios[i].Cuentas = modelo.Cuentas;
        listaDestinatarios[i].esconder = true;
        listaDestinatarios[i].EditarVisible = true;
      } else {
        listaDestinatarios[i].esconder = false;
      }
    } else if (typeof (modelo) == 'string') {
      if (modelo == '') {
        listaDestinatarios[i].Numero_Documento_Destino = '';
      } else {

        listaDestinatarios[i].Numero_Documento_Destino = modelo;
      }

      listaDestinatarios[i].Id_Destinatario_Cuenta = '';
      listaDestinatarios[i].Nombre_Destinatario = '';
      listaDestinatarios[i].Valor_Transferencia = '';
      listaDestinatarios[i].EditarVisible = false;
      listaDestinatarios[i].Cuentas = [];

    }
  }

  BuscarCedulaRepetida(object, index, dest: any) {
    let existe = false;

    for (let ind = 0; ind < dest.length; ind++) {

      if (ind != index) {
        if (dest[ind].Numero_Documento_Destino == object.Id_Destinatario) {

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

  ValidarCuentaBancariaDuplicada(arrPosition: string, idCuenta: string) {
    let conteo = 0;

    let count = this.ListaDestinatarios.filter(x => x.Id_Destinatario_Cuenta == idCuenta);

    if (count.length >= 2) {
      this.confirmacionSwal.title = "Atención";
      this.confirmacionSwal.text = "Está agregando una cuenta que ya existe en la lista de destinatarios agregados!";
      this.confirmacionSwal.type = "warning";
      this.confirmacionSwal.show();
    }

    // for (let ind = 0; ind < this.ListaDestinatarios.length; ind++) {
    //   if(this.ListaDestinatarios[ind].Id_Destinatario_Cuenta == idCuenta){

    //     conteo++;

    //     if (conteo >= 2) {
    //       this.confirmacionSwal.title = "Atención";
    //       this.confirmacionSwal.text = "Está agregando una cuenta que ya existe en la lista de destinatarios agregados!";
    //       this.confirmacionSwal.type = "warning";
    //       this.confirmacionSwal.show();

    //       break;
    //     }
    //   };
    // }
  }

  ControlarValoresSelect(valor) {

    this.CambiarTipoPersonas();
    this.LimpiarModeloTransferencia(true, true);

    // if (valor == 'Efectivo' || valor == 'Consignacion') {
    //   this._getMonedas();
    // }else if ( valor == 'Credito' ) {
    //   this._getMonedaExtranjeras();
    // }   

    if (valor == 'Credito') {
      this.TransferenciaModel.Tipo_Transferencia = 'Transferencia';
    }

    let Forma_Pago = this.TransferenciaModel.Forma_Pago;
    let tipo = this.TransferenciaModel.Tipo_Transferencia;

    if (Forma_Pago == 'Efectivo' && tipo == 'Transferencia') {
      this._getMonedasExtranjeras();
      this.ControlVisibilidadTransferencia.DatosCambio = true;
      this.ControlVisibilidadTransferencia.Destinatarios = true;
      this.ControlVisibilidadTransferencia.DatosRemitente = true;
      this.ControlVisibilidadTransferencia.DatosCredito = false;
      this.ControlVisibilidadTransferencia.DatosConsignacion = false;
      this.ControlVisibilidadTransferencia.SelectCliente = false;
      this.TransferenciaModel.Moneda_Destino = this._getIdMoneda('bolivares soberanos');

    } else if (Forma_Pago == 'Efectivo' && tipo == 'Cliente') {
      this._getMonedas();
      this.ControlVisibilidadTransferencia.DatosCambio = true;
      this.ControlVisibilidadTransferencia.Destinatarios = false;
      this.ControlVisibilidadTransferencia.DatosRemitente = true;
      this.ControlVisibilidadTransferencia.DatosCredito = false;
      this.ControlVisibilidadTransferencia.DatosConsignacion = false;
      this.ControlVisibilidadTransferencia.SelectCliente = true;
      this.TransferenciaModel.Moneda_Destino = this._getIdMoneda('pesos');

    } else if (Forma_Pago == 'Credito' && tipo == 'Transferencia') {
      this._getMonedasExtranjeras();
      this.ControlVisibilidadTransferencia.DatosCambio = true;
      this.ControlVisibilidadTransferencia.Destinatarios = true;
      this.ControlVisibilidadTransferencia.DatosRemitente = false;
      this.ControlVisibilidadTransferencia.DatosCredito = true;
      this.ControlVisibilidadTransferencia.DatosConsignacion = false;
      this.ControlVisibilidadTransferencia.SelectCliente = false;
      this.TransferenciaModel.Moneda_Destino = this._getIdMoneda('bolivares soberanos');

    } else if (Forma_Pago == 'Credito' && tipo == 'Cliente') {
      this.ControlVisibilidadTransferencia.DatosCambio = false;
      this.ControlVisibilidadTransferencia.Destinatarios = false;
      this.ControlVisibilidadTransferencia.DatosRemitente = false;
      this.ControlVisibilidadTransferencia.DatosCredito = false;
      this.ControlVisibilidadTransferencia.DatosConsignacion = false;
      this.ControlVisibilidadTransferencia.SelectCliente = false;

    } else if (Forma_Pago == 'Consignacion' && tipo == 'Transferencia') {
      this._getMonedasExtranjeras();
      this.ControlVisibilidadTransferencia.DatosCambio = true;
      this.ControlVisibilidadTransferencia.Destinatarios = true;
      this.ControlVisibilidadTransferencia.DatosRemitente = true;
      this.ControlVisibilidadTransferencia.DatosCredito = false;
      this.ControlVisibilidadTransferencia.DatosConsignacion = true;
      this.ControlVisibilidadTransferencia.SelectCliente = false;
      this.TransferenciaModel.Moneda_Destino = this._getIdMoneda('bolivares soberanos');

    } else if (Forma_Pago == 'Consignacion' && tipo == 'Cliente') {
      this._getMonedas();
      this.ControlVisibilidadTransferencia.DatosCambio = true;
      this.ControlVisibilidadTransferencia.Destinatarios = false;
      this.ControlVisibilidadTransferencia.DatosRemitente = true;
      this.ControlVisibilidadTransferencia.DatosCredito = false;
      this.ControlVisibilidadTransferencia.DatosConsignacion = true;
      this.ControlVisibilidadTransferencia.SelectCliente = true;
      this.TransferenciaModel.Moneda_Destino = this._getIdMoneda('pesos');
    }

    setTimeout(() => {
      this.SetMonedaTransferencia(this.TransferenciaModel.Moneda_Destino);
    }, 500);
  }

  private _getIdMoneda(nombreMoneda: string) {
    let moneda = this.Monedas.find(x => x.Nombre.toLowerCase() == nombreMoneda.toLowerCase());
    // console.log(moneda);

    if (!this.generalService.IsObjEmpty(moneda)) {
      return moneda.Id_Moneda;
    } else {
      return '1';
    }
  }

  CargarTransferenciasDiarias() {
    // this.Transferencia = [];
    // this._transferenciaService.getRecibosTransferenciasFuncionario(this.funcionario_data.Identificacion_Funcionario).subscribe((data: any) => {
    //   if (data.codigo == 'success') {
    //     this.Transferencia = data.query_data;  
    //   }else{

    //     this.Transferencia = []; 
    //     let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
    //     this._toastService.ShowToast(toastObj);
    //   }

    // });
    // this.Transferencia = [];
    // this.http.get(this.globales.ruta + 'php/pos/lista_recibos_transferencia.php' , {params: {funcionario:this.funcionario_data.Identificacion_Funcionario} } ).subscribe((data: any) => {
    //   this.Transferencia = data;
    // });

    this.ActulizarTablaRecibos.next();
  }

  EliminarDestinatarioTransferencia(index) {
    this.ListaDestinatarios.splice(index, 1);
    this.HabilitarCampoValor();
  }

  AutoCompletarRemitente(modelo: any) {

    if (typeof (modelo) == 'object') {

      this.TransferenciaModel.Documento_Origen = modelo.Id_Transferencia_Remitente;
      this.TransferenciaModel.Telefono_Remitente = modelo.Telefono;
      this.TransferenciaModel.Nombre_Remitente = modelo.Nombre;
      this.EditRemitenteTransferencia = true;

    } else if (typeof (modelo) == 'string') {

      this.TransferenciaModel.Documento_Origen = '';
      this.TransferenciaModel.Telefono_Remitente = '';
      this.TransferenciaModel.Nombre_Remitente = '';
      this.EditRemitenteTransferencia = false;

      // if(modelo == ''){
      //   this.TransferenciaModel.Documento_Origen='';
      //   this.TransferenciaModel.Telefono_Remitente='';
      //   this.TransferenciaModel.Nombre_Remitente='';
      // }else{

      //   this.TransferenciaModel.Documento_Origen=modelo;
      // }
    }
  }

  AnularTransferencia(id, formulario: NgForm) {
    let datos = new FormData();
    datos.append("id_transferencia", this.idTransferencia);
    datos.append("motivo_anulacion", this.MotivoAnulacionTransferencia);
    this._transferenciaService.anularReciboTransferencias(datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.ModalAnularTransferencia.hide();
          this.MotivoAnulacionTransferencia = '';
          this.idTransferencia = '';
          this.swalService.ShowMessage(data);
        } else {

          this.swalService.ShowMessage(data);
        }
      });

    // formulario.value.idTercero = this.idTerceroDestino;
    // formulario.value.idDestino = this.destinoTercero;
    // let datos = new FormData();
    // let info = JSON.stringify(formulario.value);
    // datos.append("id", id);
    // datos.append("datos", info);
    // /*datos.append("idTercero", this.idTerceroDestino);
    // datos.append("idDestino", this.destinoTercero);*/
    // this.http.post(this.globales.ruta + '/php/transferencias/anular_transferencia.php', datos)
    //   .catch(error => {
    //     console.error('An error occurred:', error.error);
    //     this.errorSwal.show();
    //     return this.handleError(error);
    //   })
    //   .subscribe((data: any) => {
    //     formulario.reset();
    //     this.ModalAnularTransferencia.hide();
    //     this.confirmacionSwal.title = "Anulado"
    //     this.confirmacionSwal.text = "Esta transferencia se anuló"
    //     this.confirmacionSwal.type = "success"
    //     this.confirmacionSwal.show();
    //     //this.actualizarVista();
    //   });

  }

  idTerceroDestino: any;
  destinoTercero: any;
  AnularTransferenciaModal(id, modal, tercero, destino) {
    this._transferenciaService.verificarEstadoReciboTransferencia(id).subscribe((data: any) => {
      if (data == 'Anulado') {
        this.confirmacionSwal.title = "Anulacion"
        this.confirmacionSwal.text = "Esta transferencia no se puede anular"
        this.confirmacionSwal.type = "warning"
        this.confirmacionSwal.show();
      } else {
        this.AbrirModalAnularTransferencia(id);
      }
    });

    // this.http.get(this.globales.ruta + '/php/transferencias/verificar_realizada.php', { params: { id: id } }).subscribe((data: any) => {
    //   var conteo = data[0].conteo;
    //   if (parseInt(conteo) > 0) {
    //     this.confirmacionSwal.title = "Anulacion"
    //     this.confirmacionSwal.text = "Esta transferencia no se puede anular"
    //     this.confirmacionSwal.type = "warning"
    //     this.confirmacionSwal.show();
    //   } else {
    //     this.idTransferencia = id;
    //     this.idTerceroDestino = tercero;
    //     this.destinoTercero = destino;
    //     modal.show();
    //   }
    // });
  }

  AbrirModalAnularTransferencia(idTransferencia: string) {
    this.idTransferencia = idTransferencia;
    this.ModalAnularTransferencia.show();
  }

  itemDestinatario = true;
  NombreTercero: any;
  TituloModalTransferencia = "Envia";
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

      var index = this.TerceroCliente.findIndex(x => x.Id_Tercero === data.encabezado[0].Id_Tercero);
      if (index > -1) {
        this.NombreTercero = this.TerceroCliente[index].Nombre;
        this.TituloModalTransferencia = "Tercero "
      }

      var index1 = this.TerceroCliente.findIndex(x => x.Id_Tercero === data.encabezado[0].Id_Tercero_Destino);
      if (index1 > -1) {
        this.NombreTercero = this.TerceroCliente[index1].Nombre;
        this.TituloModalTransferencia = "Tercero "
      }

      var index2 = this.RemitentesTransferencias.findIndex(x => x.Id_Transferencia_Remitente === data.encabezado[0].Documento_Origen);
      if (index2 > -1) {
        this.NombreTercero = this.RemitentesTransferencias[index2].Nombre;
        this.TituloModalTransferencia = "Remitente "
      }
      //CuentasBancarias
      var index3 = this.CuentasBancarias.findIndex(x => x.Id_Cuenta_Bancaria === data.encabezado[0].Id_Cuenta_Bancaria);
      if (index3 > -1) {
        this.NombreTercero = this.CuentasBancarias[index3].Nombre_Titular;
        this.TituloModalTransferencia = "Cuenta De "
      }

      this.ModalVerRecibo.show();
    });
  }

  //EDITAR TRANSFERENCIA
  EditarTransferencia(idTransferencia, formaPago, tipoTransferencia) {
    if (idTransferencia == '') {
      this.ShowSwal('warning', 'Alerta', 'El id de la transferencia es erronea!');
      return;
    }

    if (formaPago == '') {
      this.ShowSwal('warning', 'Alerta', 'La forma de pago es erronea!');
      return;
    }

    let parametros = { transferencia: idTransferencia, forma_pago: formaPago, tipo: tipoTransferencia };

    this.http.get(this.globales.ruta + 'php/transferencias/consultar_datos_transferencia.php', { params: parametros }).subscribe((transferencia: any) => {

      this.TransferenciaModel = transferencia.transferencia;
      this.ListaDestinatarios = transferencia.destinatarios;
      this.id_remitente = transferencia.id_remitente;
      this.MonedaParaTransferencia = transferencia.moneda_transferencia;
      this.CambiarVista('Transferencia');
    });
  }

  //Editar o crear remitente para transferencia desde el panel crear transferencias
  EditarRemitenteTransferencia(idRemitente: any, accion: string) {
    let data = {};

    if (typeof (this.id_remitente) == 'string') {
      data = { id_remitente: idRemitente, tipo: "", accion: accion };
    } else if (typeof (this.id_remitente) == 'object') {
      data = { id_remitente: idRemitente.Id_Transferencia_Remitente, tipo: "", accion: accion };
    }

    this.openModalGiro.next(data);
  }

  //CARGAR LOS DATOS DEL REMITENTE DESDE MODAL DE CREACION/EDICION REMITENTE
  CargarRemitenteTransferencia(remitente: any) {

    this.id_remitente = remitente.model;
    this.TransferenciaModel.Documento_Origen = remitente.model.Id_Transferencia_Remitente;
    this.TransferenciaModel.Nombre_Remitente = remitente.model.Nombre;
    this.TransferenciaModel.Telefono_Remitente = remitente.model.Telefono;
    this.EditRemitenteTransferencia = true;
  }

  //#endregion

  //#region FUNCIONES GIROS  

  public ActualizarTablasGiros() {
    this.CargarGirosDiarios();
    this.CargarGirosAprobados();
  }

  ModalVerGiro(id) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { modulo: 'Giro', id: id } }).subscribe((data: any) => {
      this.informacionGiro = data;
      this.ValorTotalGiro = Number(data.Valor_Total);
    });
    this.ModalAprobarGiro.show();
  }

  FiltrarGiroCedula(value) {

    this.Aparecer = false;
    this.CargandoGiros = true;

    if (value == '') {
      this.GirosBuscar = [];
      this.Aparecer = true;
      this.CargandoGiros = false;
    } else {
      this.http.get(this.globales.ruta + 'php/giros/giros_cedula.php', { params: { id: value, funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
        this.CargandoGiros = false;
        this.GirosBuscar = data;
        if (this.GirosBuscar.length > 0) {
          this.Aparecer = true;
        }
      });
    }
  }

  PagarGiro(id, modal, value) {
    let datos = new FormData();
    datos.append("id", id);
    datos.append("caja", this.generalService.SessionDataModel.idCaja);
    datos.append("id_funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);
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

        this.FiltrarGiroCedula(value);
        this.ActualizarTablasGiros();
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

  AutoCompletarDatosPersonalesGiro(modelo, tipo_persona: string) {
    // console.log(modelo);

    if (typeof (modelo) == 'object') {

      let validacion = this.ValidarRemitenteDestinatario(modelo.Id_Transferencia_Remitente, tipo_persona);
      if (validacion) {
        return;
      };

      if (tipo_persona == 'remitente') {
        //this.EditarDestinatarioGiro = false;
        this.CrearDestinatarioGiro = false;
      } else {
        //this.EditarRemitenteGiro = false;
        this.CrearRemitenteGiro = false;
      }
      this.AsignarValoresPersonaGiro(modelo, tipo_persona);

    } else if (typeof (modelo) == 'string') {

      if (modelo == '') {
        if (tipo_persona == 'remitente') {
          this.EditarRemitenteGiro = false;
          this.CrearRemitenteGiro = false;
        } else {
          this.EditarDestinatarioGiro = false;
          this.CrearDestinatarioGiro = false;
        }
      } else {
        if (tipo_persona == 'remitente') {
          this.EditarRemitenteGiro = false;
          this.CrearRemitenteGiro = true;
        } else {
          this.EditarDestinatarioGiro = false;
          this.CrearDestinatarioGiro = true;
        }
      }

      this.VaciarValoresPersonaGiro(tipo_persona, true);
    }
  }

  ValidarRemitenteDestinatario(id_persona, tipo_persona: string) {

    if (tipo_persona == 'remitente') {
      let d = this.GiroModel.Documento_Destinatario;

      if (d == '' || d == undefined) {
        return false;
      }

      if (id_persona == d) {
        this.ShowSwal('warning', 'Alerta', 'El remitente y el destinatario no pueden ser la misma persona');
        this.EditarRemitenteGiro = false;
        this.CrearRemitenteGiro = false;
        this.VaciarValoresPersonaGiro(tipo_persona);
        return true;
      }
    } else if (tipo_persona == 'destinatario') {

      let r = this.GiroModel.Documento_Remitente;

      if (r == '' || r == undefined) {
        return false;
      }

      if (id_persona == r) {
        this.ShowSwal('warning', 'Alerta', 'El remitente y el destinatario no pueden ser la misma persona');
        this.EditarDestinatarioGiro = false;
        this.CrearDestinatarioGiro = false;
        this.VaciarValoresPersonaGiro(tipo_persona);
        return true;
      }
    }

    return false;
  }

  AsignarValoresPersonaGiro(modelo, tipo_persona) {

    if (tipo_persona == 'remitente') {
      this.GiroModel.Documento_Remitente = modelo.Id_Transferencia_Remitente;
      this.GiroModel.Nombre_Remitente = modelo.Nombre;
      this.GiroModel.Telefono_Remitente = modelo.Telefono;
      this.EditarRemitenteGiro = true;
      this.CrearRemitenteGiro = false;

    } else if (tipo_persona == 'destinatario') {

      this.GiroModel.Documento_Destinatario = modelo.Id_Transferencia_Remitente;
      this.GiroModel.Nombre_Destinatario = modelo.Nombre;
      this.GiroModel.Telefono_Destinatario = modelo.Telefono;
      this.EditarDestinatarioGiro = true;
      this.CrearDestinatarioGiro = false;
    }
  }

  VaciarValoresPersonaGiro(tipo_persona, conservarDestRem: boolean = false) {

    if (tipo_persona == 'remitente') {
      this.GiroModel.Documento_Remitente = '';
      this.GiroModel.Nombre_Remitente = '';
      this.GiroModel.Telefono_Remitente = '';
      if (!conservarDestRem)
        this.Remitente_Giro = '';

    } else if (tipo_persona == 'destinatario') {

      this.GiroModel.Documento_Destinatario = '';
      this.GiroModel.Nombre_Destinatario = '';
      this.GiroModel.Telefono_Destinatario = '';
      if (!conservarDestRem)
        this.Destinatario_Giro = '';
    }
  }

  valorComision(value) {

    let recibido = parseFloat(this.GiroModel.Valor_Recibido);

    if (typeof (value) == 'boolean') {
      if (recibido == 0 || recibido == undefined || isNaN(recibido)) {
        this.ShowSwal('warning', 'Alerta', 'Debe introducir el valor a enviar para hacer el cálculo!');
        return;
      }
    }

    if (typeof (value) == 'string') {
      if (value == '' || value == '0') {
        this.GiroModel.Comision = '';
        this.GiroModel.Valor_Recibido = '';
        this.GiroModel.Comision = '';
        this.GiroModel.Valor_Total = '';
        this.GiroModel.Valor_Entrega = '';
        return;
      }
    }

    let maxComision = this.GiroComision[(this.GiroComision.length - 1)].Comision;

    if (recibido > maxComision) {
      this.GiroModel.Comision = maxComision;

      var checkeado = ((document.getElementById("libre") as HTMLInputElement).checked);

      switch (checkeado) {
        case true: {
          this.GiroModel.Valor_Total = recibido + parseFloat(maxComision);
          this.GiroModel.Valor_Entrega = recibido;
          break;
        }
        case false: {
          this.GiroModel.Valor_Total = recibido;
          this.GiroModel.Valor_Entrega = recibido - parseFloat(maxComision);
          break;
        }
      }
    } else {

      this.GiroComision.forEach(element => {
        if ((parseFloat(element.Valor_Minimo) <= recibido) && (recibido <= parseFloat(element.Valor_Maximo))) {
          this.GiroModel.Comision = element.Comision;

          var checkeado = ((document.getElementById("libre") as HTMLInputElement).checked);

          switch (checkeado) {
            case true: {
              this.GiroModel.Valor_Total = recibido + parseFloat(element.Comision);
              this.GiroModel.Valor_Entrega = recibido;
              break;
            }
            case false: {
              this.GiroModel.Valor_Total = recibido;
              this.GiroModel.Valor_Entrega = recibido - parseFloat(element.Comision);
              break;
            }
          }
        }
      });
    }
  }

  RealizarGiro(formulario: NgForm) {

    if (!this.ValidateGiroBeforeSubmit()) {
      return;
    } else {
      this.GiroModel.Id_Oficina = this.IdOficina;
      let info = this.generalService.normalize(JSON.stringify(this.GiroModel));
      let datos = new FormData();
      datos.append("datos", info);
      this.http.post(this.globales.ruta + 'php/pos/guardar_giro.php', datos).subscribe((data: any) => {
        this.LimpiarModeloGiro('creacion');
        this.Giro1 = true;
        this.Giro2 = false;
        this.confirmacionSwal.title = "Guardado con exito";
        this.confirmacionSwal.text = "Se ha guardado correctamente el giro"
        this.confirmacionSwal.type = "success"
        this.confirmacionSwal.show();
        this.CargarGirosDiarios();
      });
    }
  }

  RealizarEdicionGiro(formulario: NgForm, modal) {
    let info = this.generalService.normalize(JSON.stringify(formulario.value));
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/pos/guardar_giro.php', datos).subscribe((data: any) => {
      modal.hide();
      this.confirmacionSwal.title = "Guardado con exito";
      this.confirmacionSwal.text = "Se ha guardado correctamente el giro"
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();
    });
  }

  ValidateGiroBeforeSubmit() {
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

  LimpiarModeloGiro(tipo: string) {

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
      this.EditarRemitenteGiro = false;
      this.EditarDestinatarioGiro = false;
      this.CrearRemitenteGiro = false;
      this.CrearDestinatarioGiro = false;
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
      this.CrearRemitenteGiro = false;
      this.CrearDestinatarioGiro = false;
    }
  }

  CargarGirosDiarios() {
    this.Giros = [];
    this.http.get(this.globales.ruta + 'php/giros/listar_giros_funcionario.php', { params: { modulo: 'Giro', funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.Giros = data;
    });
  }

  CargarGirosAprobados() {
    this.GirosAprobados = [];
    this.http.get(this.globales.ruta + '/php/giros/giros_aprobados.php', { params: { funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.GirosAprobados = data;
    });
  }

  AnularGiro(id) {
    let datos = new FormData();
    datos.append("modulo", 'Giro');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/giros/anular_giro.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = "Anulado con Exito";
      this.confirmacionSwal.text = "Se ha anulado correctamente el giro";
      this.confirmacionSwal.type = "success";
      this.confirmacionSwal.show();

      this.FiltrarGiroCedula(this.CedulaBusquedaGiro);
      //this.actualizarVista();
    });
  }

  anulado(estado) {
    switch (estado) {
      case "Anulada": { return false }
      default: { return true }
    }
  }

  CargarDatos(data: any) {
    if (data.tipo == 'remitente') {

      this.Remitente_Giro = data.model;
      this.GiroModel.Documento_Remitente = data.model.Id_Transferencia_Remitente;
      this.GiroModel.Nombre_Remitente = data.model.Nombre;
      this.GiroModel.Telefono_Remitente = data.model.Telefono;

    } else {

      this.Destinatario_Giro = data.model;
      this.GiroModel.Documento_Destinatario = data.model.Id_Transferencia_Remitente;
      this.GiroModel.Nombre_Destinatario = data.model.Nombre;
      this.GiroModel.Telefono_Destinatario = data.model.Telefono;
    }
  }

  EditarPersonaGiro(idRemitente: string, tipoPersona: string, accion: string) {
    let data = {};

    if (tipoPersona == 'remitente') {
      if (typeof (this.Remitente_Giro) == 'string') {
        data = { id_remitente: idRemitente, tipo: tipoPersona, accion: 'crear desde giro' };
      } else if (typeof (this.Remitente_Giro) == 'object') {
        data = { id_remitente: idRemitente, tipo: tipoPersona, accion: accion };
      }
    } else if (tipoPersona == 'destinatario') {
      if (typeof (this.Destinatario_Giro) == 'string') {
        data = { id_remitente: idRemitente, tipo: tipoPersona, accion: 'crear desde giro' };
      } else if (typeof (this.Destinatario_Giro) == 'object') {
        data = { id_remitente: idRemitente, tipo: tipoPersona, accion: accion };
      }
    }



    this.openModalGiro.next(data);
  }

  HabilitarEdicionComisionGiro() {
    if (this.GiroModel.Valor_Recibido == '') {
      this.swalService.ShowMessage(['warning', 'Alerta', 'Debe colocar el valor recibido primero antes de editar la comisión']);
      return;
    }

    if (this.DeshabilitarComisionGiro) {
      if (this.permisoSubscription == undefined) {
        this.permisoSubscription = this.permisoService.permisoJefe.subscribe(d => {
          this.DeshabilitarComisionGiro = !d;

          this.permisoSubscription.unsubscribe();
          this.permisoSubscription = undefined;
        });
      }

      let p = { accion: "giro" };
      this.permisoService._openSubject.next(p);
      //this.DeshabilitarComisionGiro = false;
    } else {

      this.DeshabilitarComisionGiro = true;
    }
  }

  //#endregion

  //#region FUNCIONES TRASLADOS

  SetMonedaTraslados(idMoneda) {

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

    this.TrasladoModel.Identificacion_Funcionario = this.funcionario_data.Identificacion_Funcionario;
    this.TrasladoModel.Id_Caja = this.generalService.SessionDataModel.idCaja;
    let info = this.generalService.normalize(JSON.stringify(this.TrasladoModel));
    let datos = new FormData();
    datos.append("modulo", 'Traslado_Caja');
    datos.append("datos", info);
    datos.append('id_oficina', this.IdOficina);
    this.http.post(this.globales.ruta + 'php/trasladocaja/guardar_traslado_caja.php', datos).subscribe((data: any) => {
      if (data.codigo == 'success') {

        this.LimpiarModeloTraslados('creacion');
        this.volverTraslado();
        modal.hide();
        this.CargarTrasladosDiarios();
        this.swalService.ShowMessage(data);
      } else {
        this.swalService.ShowMessage(data);
      }


    });
  }

  AnularTraslado(id, estado) {
    let datos = new FormData();
    datos.append("modulo", 'Traslado_Caja');
    datos.append("id", id);
    datos.append("estado", estado);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      //this.actualizarVista();
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

      this.GetCajerosTraslados();
      this._getMonedasTraslado();
      this.ModalTrasladoEditar.show();
    });
  }

  CerrarModalTrasladoEditar() {
    this.ModalTrasladoEditar.hide();
    this.LimpiarModeloTraslados('creacion');
  }

  decisionTraslado(id, valor) {
    let datos = new FormData();
    datos.append("modulo", 'Traslado_Caja');
    datos.append("id", id);
    datos.append("estado", valor);

    this.http.post(this.globales.ruta + 'php/pos/decision_traslado.php', datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.CargarDatosTraslados();
      }

      this.swalService.ShowMessage(data);
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

  LimpiarModeloTraslados(tipo: string) {

    if (tipo == 'creacion') {
      this.TrasladoModel = {
        Id_Traslado_Caja: '',
        Funcionario_Destino: '',
        Id_Cajero_Origen: this.funcionario_data.Identificacion_Funcionario,
        Valor: '',
        Detalle: '',
        Id_Moneda: '',
        Estado: 'Pendiente',
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

  CargarTrasladosDiarios() {
    this.Traslados = [];
    this.http.get(this.globales.ruta + 'php/pos/listar_traslado_funcionario.php', { params: { id: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.Traslados = data;
    });
  }

  GetCajerosTraslados() {
    this.cajeroService.getCajerosTraslados(this.funcionario_data.Identificacion_Funcionario).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.CajerosTraslados = [];
        this.CajerosTraslados = data.query_data;
      } else {

        let toastObj = { textos: [data.titulo, "No hay más cajeros abiertos en este momento!"], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
        //this.swalService.ShowMessage(data);
        this.CajerosTraslados = [];
      }
    });
  }

  //#endregion

  //#region FUNCIONES CORRESPONSAL BANCARIO

  GuardarCorresponsal(formulario: NgForm) {
    //formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario
    //let info = JSON.stringify(formulario.value);
    let info = this.generalService.normalize(JSON.stringify(this.CorresponsalModel));
    let datos = new FormData();
    datos.append("modulo", 'Corresponsal_Diario');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/corresponsaldiario/guardar_corresponsal_diario.php', datos).subscribe((data: any) => {
      this.LimpiarModeloCorresponsal('creacion');
    });
  }

  ConsultarCorresponsalDiario() {
    let id_corresponsal_bancario = this.CorresponsalModel.Id_Corresponsal_Bancario;
    let id_funcionario = this.CorresponsalModel.Identificacion_Funcionario;

    if (id_corresponsal_bancario == '') {
      //this.ShowSwal('warning', 'Alerta', 'Seleccione un corresponsal bancario!');
      this.LimpiarModeloCorresponsalParcial();
      return;
    }

    if (id_funcionario == '') {
      // console.log("No hay funcionario asignado para corresponsal bancario!");
      return;
    }

    let parametros = { funcionario: id_funcionario, id_corresponsal_bancario: id_corresponsal_bancario };

    this.http.get(this.globales.ruta + 'php/corresponsaldiario/lista_corresponsales.php', { params: parametros }).subscribe((data: any) => {
      /*this.CorresponsalModel.Id_Corresponsal_Diario = data.Id_Corresponsal_Diario;
      this.CorresponsalModel.Valor = data.Valor;
      this.CorresponsalModel.Detalle = data.Detalle;*/
      if (data.length == 0) {
        this.LimpiarModeloCorresponsalParcial();
      } else {
        this.CorresponsalModel = data;
      }

      //(document.getElementById("GuardarCorresponsalBancario") as HTMLInputElement).disabled = false;
    });
  }

  LimpiarModeloCorresponsalParcial() {
    this.CorresponsalModel.Valor = '';
    this.CorresponsalModel.Detalle = '';
    this.CorresponsalModel.Id_Corresponsal_Diario = '';
    this.CorresponsalModel.Fecha = '';
    this.CorresponsalModel.Hora = '';
  }

  LimpiarModeloCorresponsal(tipo: string) {

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

  public UpdateTablaCorresponsal($event) {
    this.ActualizarTablaCorresponsal.next();
  }

  //#endregion

  //#region FUNCIONES SERVICIOS EXTERNOS

  calcularComisionServicioExterno(value) {
    this.ServicioComision.forEach(element => {
      if ((parseFloat(element.Valor_Minimo) <= parseFloat(value)) && (parseFloat(value) < parseFloat(element.Valor_Maximo))) {
        this.ValorComisionServicio = element.Comision;
      }
    });
  }

  GuardarServicio(formulario: NgForm, modal, tipo: string = 'creacion') {

    let info = this.generalService.normalize(JSON.stringify(this.ServicioExternoModel));
    let datos = new FormData();
    datos.append("modulo", 'Servicio');
    datos.append('id_oficina', this.IdOficina);
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/serviciosexternos/guardar_servicio.php', datos).subscribe((data: any) => {
      this.LimpiarModeloServicios(tipo);
      this.ShowSwal('success', 'Registro Existoso', tipo == "creacion" ? 'Se ha registrado exitosamente el servicio!' : 'Se ha editado exitosamente el servicio!');
      modal.hide();
      this.volverServicio();
      this.CargarServiciosDiarios();
    });
  }

  AnulaServicio(id, estado) {
    let datos = new FormData();
    datos.append("modulo", 'Servicio');
    datos.append("id", id);
    datos.append("estado", estado);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      //this.actualizarVista();
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
      this.ServicioExternoModel = data;
      this.Total_Servicio = parseInt(this.ServicioExternoModel.Valor) + parseInt(this.ServicioExternoModel.Comision);
      // console.log([parseInt(this.ServicioExternoModel.Valor) + parseInt(this.ServicioExternoModel.Comision)]);

      this.ModalServicioEditar.show();
    });
  }

  public CerrarModalServicioEditar() {
    this.ModalServicioEditar.hide();
    this.LimpiarModeloServicios('edicion');
  }

  AsignarComisionServicioExterno() {

    let valorAsignado = this.ServicioExternoModel.Valor;
    // console.log(this.ServicioExternoModel);


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

  AsignarComisionServicioExterno2() {

    let valorAsignado = this.ServicioExternoModel.Valor;
    // console.log(valorAsignado);         

    if (valorAsignado == '' || valorAsignado == undefined || valorAsignado == '0') {
      this.ShowSwal('warning', 'Alerta', 'El valor no puede estar vacio ni ser 0!');
      this.ServicioExternoModel.Valor = '';
      this.ServicioExternoModel.Comision = '';
      this.Total_Servicio = 0;
      return;
    } else {
      this.searchComisionServicio.next(valorAsignado);
    }
  }

  LimpiarModeloServicios(tipo: string) {

    // if (tipo == 'creacion') {
    this.ServicioExternoModel = {
      Id_Servicio: '',
      Servicio_Externo: '',
      Comision: '',
      Valor: '',
      Detalle: '',
      Estado: 'Activo',
      Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
      Id_Caja: this.generalService.SessionDataModel.idCaja
    };

    this.Total_Servicio = 0;
    // }

    // if (tipo == 'edicion') {
    //   this.ServicioExternoModel = {
    //     Id_Servicio: '',
    //     Servicio_Externo: '',
    //     Comision: '',
    //     Valor: '',
    //     Detalle: '',
    //     Estado: 'Activo',
    //     Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
    //     Id_Caja: this.generalService.SessionDataModel.idCaja
    //   };
    // }
  }

  CargarServiciosDiarios() {
    this.Servicios = [];
    this.http.get(this.globales.ruta + 'php/serviciosexternos/get_lista_servicios.php', { params: { id_funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.Servicios = data.query_data;
    });
  }

  public AprobarCambioComision() {
    let comision = this.ServicioExternoModel.Comision;
    if (comision != '') {
      //ABRIR MODAL DE PERMISO PARA PROCEDER
      let p = { accion: "servicio_externo", value: comision };
      this.permisoService._openSubject.next(p);
    } else {
      this.swalService.ShowMessage(['warning', 'Alerta', 'La comisión no puede ser 0 ni estar vacia!']);
    }
  }

  //#endregion

  //#region FUNCIONES GENERALES 

  SetDatosIniciales() {
    this.CargarDatosCambios();
    this.AsignarPaises();
    this.AsignarCuentasPersonales();
    this.AsignarTipoDocumento();
  }

  muestra_tabla(id) {
    // console.log(id);

    var tot = document.getElementsByClassName('modulos').length;
    for (let i = 0; i < tot; i++) {
      var id2 = document.getElementsByClassName('modulos').item(i).getAttribute("id");
      document.getElementById(id2).style.display = 'none';
    }

    this.Corresponsal = false;

    this.volverCambioEfectivo();
    this.volverReciboTransferencia();
    this.volverReciboGiro();
    this.volverTraslado();
    this.volverServicio();
    this.volverCorresponsal();
    this.volverReciboServicio();

    document.getElementById(id).style.display = 'block';
    this.CargarDatosModulo(id);
  }

  public MostrarModulo(modulo: string) {
    // console.log(modulo);

    let idActivo = this.CardModulos.find(x => x.Activo);
    // console.log(idActivo);

    let activeCard = this.CardModulos.findIndex(x => x.Activo);
    let willActivateCard = this.CardModulos.findIndex(x => x.Id == modulo);

    this.CardModulos[activeCard].Activo = false;
    this.CardModulos[willActivateCard].Activo = true;
    document.getElementById(idActivo.Id).style.display = 'none';
    document.getElementById(modulo).style.display = 'block';

    // this.Corresponsal = false;

    this.volverCambioEfectivo();
    this.volverReciboTransferencia();
    this.volverReciboGiro();
    this.volverTraslado();
    this.volverServicio();
    this.volverCorresponsal();
    this.volverReciboServicio();

    this.CargarDatosModulo(modulo);
  }

  CargarDatosModulo(modulo: string) {
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
        this.Corresponsal = true;
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

  VaciarDatosModulo(modulo: string) {
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

  CargarDatosCambios() {
    //this.ShowSwal("warning", "Alerta", "Desarrollar");
    this.CargarCambiosDiarios();

    this.MonedasCambio = [];
    //this.AsignarMonedasSinMonedaLocal(this.MonedasCambio);
    this._monedaService.getMonedasExtranjeras().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.MonedasCambio = data.query_data;
      } else {
        this.MonedasCambio = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  CargarDatosTransferencia() {
    this.CargarTransferenciasDiarias();

    this.TransferenciasAnuladas = [];
    // this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_anuladas.php', {params:{id_funcionario:this.funcionario_data.Identificacion_Funcionario}}).subscribe((data: any) => {
    //   if (data.codigo == 'success') {
    //     this.TransferenciasAnuladas = data.query_data;
    //   }else{
    //     this.TransferenciasAnuladas = [];
    //     let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
    //     this._toastService.ShowToast(toastObj);
    //   }
    //   //this.TransferenciasAnuladas = data;
    // });

    this.Destinatarios = [];
    this.http.get(this.globales.ruta + 'php/pos/lista_destinatarios.php').subscribe((data: any) => {
      this.Destinatarios = data;
    });

    this._getMonedasExtranjeras();
    // this.globales.Monedas.forEach(moneda => {
    //   if (moneda.Nombre != 'Pesos') {
    //     this.MonedasTransferencia.push(moneda);     
    //   }
    // });

    this.Clientes = [];
    this.http.get(this.globales.ruta + 'php/pos/lista_clientes.php', { params: { modulo: 'Tercero' } }).subscribe((data: any) => {
      this.Clientes = data;
    });

    this.TransferenciaModel.Moneda_Destino = this._getIdMoneda('bolivares soberanos');
    setTimeout(() => {
      this.SetMonedaTransferencia(this.TransferenciaModel.Moneda_Destino);
    }, 300);


    //this.ShowSwal("warning", "Alerta", "Terminar de cargar datos");
  }

  private _getTodasMonedas() {
    this.MonedasTransferencia = [];
    this._monedaService.getMonedas().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Monedas = data.query_data;
      } else {
        this.Monedas = [];
      }
    });
  }

  private _getMonedas() {
    this.MonedasTransferencia = [];
    this._monedaService.getMonedas().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.MonedasTransferencia = data.query_data;
      } else {
        this.MonedasTransferencia = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  private _getMonedasExtranjeras() {
    this.MonedasTransferencia = [];
    this._monedaService.getMonedasExtranjeras().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.MonedasTransferencia = data.query_data;
      } else {
        this.MonedasTransferencia = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  CargarDatosGiros() {
    //this.ShowSwal("warning", "Alerta", "Desarrollar");

    this.CargarGirosDiarios();

    this.GirosAprobados = [];
    this.http.get(this.globales.ruta + '/php/giros/giros_aprobados.php', { params: { funcionario: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.GirosAprobados = data;
    });

    this.DepartamentosGiros = [];
    this.DepartamentosGiros = this.globales.Departamentos;

    this.Remitentes = [];
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Transferencia_Remitente' } }).subscribe((data: any) => {
      this.Remitentes = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Giro_Comision' } }).subscribe((data: any) => {
      this.GiroComision = data;
    });
  }

  CargarDatosTraslados() {

    this.CargarTrasladosDiarios();

    this.TrasladosRecibidos = [];
    this.http.get(this.globales.ruta + 'php/pos/traslado_recibido.php', { params: { id: this.funcionario_data.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.TrasladosRecibidos = data;

    });

    this.GetCajerosTraslados();

    // this.CajerosTraslados = [];
    // this.globales.FuncionariosCaja.forEach(fc => {
    //   if (fc.Nombres != this.funcionario_data.Nombres) {
    //     this.CajerosTraslados.push(fc);     
    //   }
    // });

    this._getMonedasTraslado();
  }

  private _getMonedasTraslado() {
    this.MonedasTraslados = [];
    this._monedaService.getMonedas().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.MonedasTraslados = data.query_data;
      } else {
        this.MonedasTraslados = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  CargarDatosCorresponsal() {
    //this.ShowSwal("warning", "Alerta", "Desarrollar");

    // this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Corresponsal_Bancario' } }).subscribe((data: any) => {
    //   this.CorresponsalesBancarios = data;
    // });
    this.ActualizarTablaCorresponsal.next();
  }

  CargarDatosServicios() {
    //this.ShowSwal("warning", "Alerta", "Desarrollar");
    this.CargarServiciosDiarios();

    this.ListaServiciosExternos = [];
    this.ListaServiciosExternos = this.globales.ServiciosExternos;
  }

  AsignarMonedasSinMonedaLocal(listaMonedasVacia) {
    this.globales.Monedas.forEach(moneda => {
      if (moneda.Nombre != 'Pesos') {
        listaMonedasVacia.push(moneda);
      }
    });
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

  Municipios_Departamento_Especial(Departamento) {
    this.http.get(this.globales.ruta + 'php/genericos/municipios_departamento.php', { params: { id: Departamento } }).subscribe((data: any) => {

      this.Municipios_Remitente = data;
    });
  }

  CambiarVista(tipo) {

    switch (tipo) {
      case "Compra": {
        this.Venta = false;
        this.TextoBoton = "Comprar"
        this.Tipo = "Compra";
        this.tituloCambio = "Compras"
        this.CambioModel.Moneda_Destino = '2';
        break;
      }
      case "Venta": {
        this.Venta = true;
        this.TextoBoton = "Vender"
        this.Tipo = "Venta";
        this.tituloCambio = "Ventas"
        this.CambioModel.Moneda_Origen = '2';
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
        this.GetDepartamentoCiudadOficina();
        this.Giro2 = true;
        this.Giro1 = false;
        break;
      }
      case "Traslado": {
        this.Traslado2 = true;
        this.Traslado1 = false;

        this.CargarDatosTraslados();
        break;
      }
      case "Corresponsal": {
        this.Corresponsal2 = true;
        this.Corresponsal1 = false;

        this.corresponsalView.next(AccionTableroCajero.Iniciar);
        //this.CargarDatosCorresponsal();
        break;
      }
      case "Servicio": {
        this.Servicio2 = true;
        this.Servicio1 = false;
        break;
      }
    }
  }

  GetDepartamentoCiudadOficina() {
    this.generalService.getDepCiuOficina(localStorage.getItem('Oficina')).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.GiroModel.Departamento_Remitente = data.query_data.Id_Departamento;
        this.GiroModel.Municipio_Remitente = data.query_data.Id_Municipio;

        this.Municipios_Departamento_Especial(this.GiroModel.Departamento_Remitente);
      } else {

        this.GiroModel.Departamento_Remitente = '';
        this.GiroModel.Municipio_Remitente = '';
      }
    });
  }

  CerrarModal(modal, modulo: string) {

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
    this.corresponsalView.next(AccionTableroCajero.Cerrar);
    this.LimpiarModeloServicios('creacion');
  }

  volverReciboServicio() {
    this.Servicio1 = true;
    this.Servicio2 = false;
    this.Total_Servicio = 0;
  }

  public volverCorresponsal() {
    this.Corresponsal = false;
    this.Corresponsal1 = true;
    this.Corresponsal2 = false;
  }

  AsignarMonedas() {

    this._monedaService.getMonedas().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Monedas = data.query_data;
        setTimeout(() => {
          this.AsignarMonedasApertura();
        }, 200);

      } else {
        this.Monedas = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  AsignarPaises() {
    this.Paises = this.globales.Paises;
  }

  AsignarTipoDocumento() {
    this.TipoDocumentoNacional = this.globales.TipoDocumentoNacionales;
    this.TipoDocumentoExtranjero = this.globales.TipoDocumentoExtranjero;
  }

  AsignarTiposCuenta() {
    this.TiposCuenta = this.globales.TiposCuenta;
  }

  AsignarCuentasPersonales() {
    this.CuentasPersonales = this.globales.CuentasPersonalesPesos;
  }

  FocusField(fieldElement: ElementRef) {
    fieldElement.nativeElement.focus();
  }

  //MOSTRAR ALERTAS DESDE LA INSTANCIA DEL SWEET ALERT GLOBAL
  ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  OcultarFormularios(activeModal: any) {
    activeModal.hide();
  }

  GuardarApertura() {
    this.IdCaja = this.generalService.SessionDataModel.idCaja;
    this.IdOficina = this.generalService.SessionDataModel.idOficina;

    this.DiarioModel.Caja_Apertura = this.IdCaja;
    this.DiarioModel.Oficina_Apertura = this.IdOficina;
    let model = this.generalService.normalize(JSON.stringify(this.DiarioModel));
    let valores_monedas = JSON.stringify(this.ValoresMonedasApertura);
    let datos = new FormData();
    datos.append("modelo", model);
    datos.append("valores_moneda", valores_monedas);
    this.http.post(this.globales.ruta + '/php/diario/guardar_apertura.php', datos).subscribe((data: any) => {

      this.ShowSwal('success', data, 'Se aperturo la caja con exito!');
      this.ModalAperturaCaja.hide();
    });
  }

  AsignarMonedasApertura() {
    if (this.Monedas.length > 0) {

      this.ValoresMonedasApertura = [];
      this.Monedas.forEach(moneda => {
        let monObj = { Id_Moneda: moneda.Id_Moneda, Valor_Moneda_Apertura: '', NombreMoneda: moneda.Nombre, Codigo: moneda.Codigo };
        this.ValoresMonedasApertura.push(monObj);
      });

      //this.GetRegistroDiario();
    }
  }

  GetRegistroDiario() {

    this.http
      .get(this.globales.ruta + 'php/diario/get_valores_diario.php', { params: { id: this.funcionario_data.Identificacion_Funcionario } })
      .subscribe((data: any) => {
        if (data.DiarioNeto <= 0) {

          if (data.valores_anteriores.length == 0) {
            this.ValoresMonedasApertura = [];
            let toastObj = { textos: ['Alerta', 'No se encontraron registros de apertura'], tipo: 'warning', duracion: 4000 };
            this._toastService.ShowToast(toastObj);
          } else {
            // console.log(this.ValoresMonedasApertura);

            data.valores_anteriores.forEach((valores, i) => {
              this.ValoresMonedasApertura[i].Valor_Moneda_Apertura = valores.Valor_Moneda_Cierre;
            });

            this.DiarioModel.Id_Diario = data.valores_diario[0].Id_Diario;
            this.ModalAperturaCaja.show();
          }

        } else {

          data.valores_anteriores.forEach((valores, i) => {
            this.ValoresMonedasApertura[i].Valor_Moneda_Apertura = valores.Valor_Moneda_Cierre;
          });
        }
      });
  }

  CheckApertura() {
    this.http
      .get(this.globales.ruta + 'php/diario/verificar_apertura_diario.php', { params: { id_funcionario: this.funcionario_data.Identificacion_Funcionario } })
      .subscribe((data: any) => {
        if (data == '0') {
          this.GetRegistroDiario();
        }
      });
  }

  EliminarCuentaDestinatario(posicion) {
    if (this.Lista_Cuentas_Destinatario.length == 1) {
      this.ShowSwal('warning', 'Alerta', 'Debe existir al menos una cuenta asociada al destinatario');
      this.SePuedeAgregarMasCuentas = false;
      return;
    }
    this.Lista_Cuentas_Destinatario.splice(posicion, 1);
    this.SePuedeAgregarMasCuentas = true;
    //this.ShowSwal('success', 'Exito', 'Cuenta Eliminada exitosamenta');
  }

  LimpiarCuentaBancaria(posicion: string) {
    this.Lista_Cuentas_Destinatario[posicion] = {
      Id_Pais: this.Lista_Cuentas_Destinatario[posicion].Id_Pais,
      Id_Banco: '',
      Bancos: [],
      Id_Tipo_Cuenta: '',
      Numero_Cuenta: '',
      EsVenezolana: false
    };
  }

  CambiarTipoPersonas() {
    if (this.TransferenciaModel.Forma_Pago == 'Credito') {
      this.TransferenciaModel.Tipo_Origen = 'Tercero';
      this.TransferenciaModel.Tipo_Destino = 'Destinatario';
    } else {

      if (this.TransferenciaModel.Tipo_Transferencia == 'Cliente') {
        this.TransferenciaModel.Tipo_Origen = 'Remitente';
        this.TransferenciaModel.Tipo_Destino = 'Tercero';
      } else {
        this.TransferenciaModel.Tipo_Origen = 'Remitente';
        this.TransferenciaModel.Tipo_Destino = 'Destinatario';
      }
    }
  }

  MostrarMensajeHijo(msgObj: any) {
    this.ShowSwal(msgObj.type, msgObj.title, msgObj.msg);
  }

  DesbloquearTasaMoneda(deshabilitar: boolean) {
    this.DeshabilitarTasa = deshabilitar;
  }

  BloquearTasaMoneda() {
    this.DeshabilitarTasa = true;
  }

  DesbloquearTasa() {
    if (this.DeshabilitarTasa) {
      if (this.permisoSubscription == undefined) {
        this.permisoSubscription = this.permisoService.permisoJefe.subscribe(d => {
          this.DeshabilitarTasa = !d;
          this.permisoSubscription.unsubscribe();
          this.permisoSubscription = undefined;
        });
      }

      this.permisoService._openSubject.next();
    } else {

      this.DeshabilitarTasa = true;
    }
  }

  MostrarBusqueda() {
    $("#remSearch").toggle("fast");
    $("#ic_edit_remitente_transferencia").toggle("fast");
    $("#ic_crear_remitente_transferencia").toggle("fast");
    $("#btn-search").toggleClass("btn-pulse");
  }

  ActivarCard(modulo: string) {
    for (const key in this.CardSelection) {
      if (key == modulo) {
        this.CardSelection[key] = true;
      } else {
        this.CardSelection[key] = false;
      }
    }
  }

  //#endregion

  //#region TYPEAHEAD SEARCHES

  search_destino = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 4 ? []
        : this.Destinatarios.filter(v => v.Id_Destinatario.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  formatter_destino = (x: { Id_Destinatario: string }) => x.Id_Destinatario;

  search_destino2 = (text$: Observable<string>) =>
    text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => term.length < 4 ? [] :
          this.http.get(this.globales.ruta + 'php/destinatarios/filtrar_destinatario_por_id.php', { params: { id_destinatario: term, moneda: this.MonedaParaTransferencia.id } })
            .map(response => response)
            .do(data => data)
        )
      );

  search_remitente = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 4 ? []
        : this.Remitentes.filter(v => v.Id_Transferencia_Remitente.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  formatter_remitente = (x: { Id_Transferencia_Remitente: string }) => x.Id_Transferencia_Remitente;

  search_remitente2 = (text$: Observable<string>) =>
    text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => term.length < 4 ? [] :
          this.http.get(this.globales.ruta + 'php/remitentes/filtrar_remitente_por_id.php', { params: { id_remitente: term } })
            .map(response => response)
            .do(data => data)
        )
      );

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
        switchMap(term =>
          this.http.get(this.globales.ruta + 'php/terceros/filtrar_terceros.php', { params: { nombre: term } })
            .map(response => response)
        )
      );
  formatter_tercero_credito = (x: { Nombre: string }) => x.Nombre;

  //#endregion

  //#region FUNCIONES MODALES

  FiltrarDatosNacionalidad(idPais) {

    //this.DestinatarioModel.Id_Destinatario = '';
    this.TipoDocumentoFiltrados = [];
    //this.DestinatarioModel.Nombre = '';

    let countryObject = this.Paises.find(x => x.Id_Pais == this.DestinatarioModel.Id_Pais);

    if (!this.globales.IsObjEmpty(countryObject)) {
      if (countryObject.Nombre == 'Colombia') {

        if (this.TipoDocumentoNacional.length > 0) {
          this.TipoDocumentoNacional.forEach(documentObj => {
            this.TipoDocumentoFiltrados.push(documentObj);
          });
        }
      } else {

        if (this.TipoDocumentoExtranjero.length > 0) {
          this.TipoDocumentoExtranjero.forEach(documentObj => {
            if (documentObj.Id_Pais == idPais) {
              this.TipoDocumentoFiltrados.push(documentObj);
            }
          });
        }
      }
    }
  }

  ValidarCedula(identificacion) {
    this.http.get(this.globales.ruta + '/php/destinatarios/validar_identificacion.php', { params: { id: identificacion } }).subscribe((data: any) => {
      if (data == 1) {
        this.confirmacionSwal.title = "Alerta";
        this.confirmacionSwal.text = "El número de identificación que intenta registrar ya se encuentra registrada en la base de datos!";
        this.confirmacionSwal.type = "warning";
        this.confirmacionSwal.show();
        this.DestinatarioModel.Id_Destinatario = '';
      }
    });
  }

  LimpiarModelos() {
    this.DestinatarioModel = {
      Id_Destinatario: '',
      Nombre: '',
      Detalle: '',
      Estado: 'Activo',
      Tipo_Documento: '',
      Id_Pais: ''
    };

    this.Lista_Cuentas_Destinatario = [{
      Id_Pais: '',
      Id_Banco: '',
      Bancos: [],
      Id_Tipo_Cuenta: '',
      Numero_Cuenta: ''
    }];

    this.TipoDocumentoFiltrados = [];
    this.SePuedeAgregarMasCuentas = false;
  }

  BuscarCNE(valor) {

    var cedula = this.DestinatarioModel.Id_Destinatario;
    if (cedula == undefined || cedula == '') {
      this.confirmacionSwal.title = "Alerta";
      this.confirmacionSwal.text = "Debe colocar un número de identificación para proseguir";
      this.confirmacionSwal.type = "warning";
      this.confirmacionSwal.show();
      this.DestinatarioModel.Tipo_Documento = '';
      return;
      //cedula = (document.getElementById("idDestinatario") as HTMLInputElement).value;
    }

    let countryObject = this.Paises.find(x => x.Id_Pais == this.DestinatarioModel.Id_Pais);

    if (!this.globales.IsObjEmpty(countryObject)) {
      if (countryObject.Nombre == 'Venezuela') {

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
    }
  }

  AgregarOtraCuenta() {
    let longitudCuentas = this.Lista_Cuentas_Destinatario.length;

    if (this.SePuedeAgregarMasCuentas && this.Lista_Cuentas_Destinatario[(longitudCuentas - 1)].Id_Tipo_Cuenta != '') {

      let nuevaCuenta = {
        Id_Pais: '',
        Id_Banco: '',
        Bancos: [],
        Id_Tipo_Cuenta: '',
        Numero_Cuenta: ''
      };
      this.Lista_Cuentas_Destinatario.push(nuevaCuenta);
      this.SePuedeAgregarMasCuentas = false;
    } else {
      this.botonDestinatario = false;
      this.confirmacionSwal.title = "Faltan Datos";
      this.confirmacionSwal.text = "Faltan datos en la(s) cuenta(s) actuales, revise por favor!";
      this.confirmacionSwal.type = "warning";
      this.confirmacionSwal.show();
    }
  }

  Bancos_Pais(Pais, i, editar: boolean = false) {
    this.http.get(this.globales.ruta + 'php/genericos/bancos_pais.php', { params: { id: Pais } }).subscribe((data: any) => {

      if (!editar) {
        this.LimpiarCuentaBancaria(i);
      }

      let pObj = this.Paises.find(x => x.Id_Pais == Pais);

      if (!this.globales.IsObjEmpty(pObj)) {
        if (pObj.Nombre == 'Venezuela') {
          this.Lista_Cuentas_Destinatario[i].EsVenezolana = true;
        } else {
          this.Lista_Cuentas_Destinatario[i].EsVenezolana = false;
        }
      } else {
        this.Lista_Cuentas_Destinatario[i].EsVenezolana = false;
      }

      if (data != '') {
        this.Lista_Cuentas_Destinatario[i].Bancos = data;
      } else {
        this.Lista_Cuentas_Destinatario[i].Bancos = [];
      }

    });
  }

  codigoBanco(seleccion, posicion, texto) {

    let country = this.Lista_Cuentas_Destinatario[posicion].Id_Pais;

    if (country == "2") {
      switch (texto) {
        case "check": {
          var buscarBanco = this.Lista_Cuentas_Destinatario[posicion].Bancos.findIndex(x => x.Id_Banco === seleccion);
          this.Lista_Cuentas_Destinatario[posicion].Numero_Cuenta = this.Lista_Cuentas_Destinatario[posicion].Bancos[buscarBanco].Identificador;
          break;
        }
        case "input": {

          var cadena = seleccion.substring(0, 4);

          var buscarBanco = this.Lista_Cuentas_Destinatario[posicion].Bancos.findIndex(x => x.Identificador === cadena);

          if (buscarBanco > -1) {
            this.Lista_Cuentas_Destinatario[posicion].Id_Banco = this.Lista_Cuentas_Destinatario[posicion].Bancos[buscarBanco].Id_Banco;
          } else {
            this.Lista_Cuentas_Destinatario[posicion].Id_Banco = '';
          }
          break;
        }
      }
    }
  }

  validarBanco(i, valor) {

    if (valor != '') {
      setTimeout(() => {

        //var idpais = ((document.getElementById("Id_Pais" + i) as HTMLInputElement).value);
        let ctaObject = this.Lista_Cuentas_Destinatario[i];
        let countryObject = this.Paises.find(x => x.Id_Pais == ctaObject.Id_Pais);

        if (!this.globales.IsObjEmpty(ctaObject) && !this.globales.IsObjEmpty(countryObject)) {

          if (countryObject.Nombre == 'Venezuela') {

            if (countryObject.Cantidad_Digitos_Cuenta != 0) {

              let longitud = this.LongitudCarateres(valor);
              if (longitud != parseInt(countryObject.Cantidad_Digitos_Cuenta)) {
                this.botonDestinatario = false;
                this.confirmacionSwal.title = "Alerta";
                this.confirmacionSwal.text = "Digite la cantidad correcta de dígitos de la cuenta(" + countryObject.Cantidad_Digitos_Cuenta + ")";
                this.confirmacionSwal.type = "warning";
                this.confirmacionSwal.show();
                this.SePuedeAgregarMasCuentas = false;
                return;
              }
            }

            this.http.get(this.globales.ruta + 'php/bancos/validar_cuenta_bancaria.php', { params: { cta_bancaria: valor } }).subscribe((data) => {
              if (data == 1) {
                this.botonDestinatario = false;
                this.confirmacionSwal.title = "Alerta";
                this.confirmacionSwal.text = "La cuenta que intenta registrar ya se encuentra registrada en la base de datos!";
                this.confirmacionSwal.type = "warning";
                this.confirmacionSwal.show();
                this.SePuedeAgregarMasCuentas = false;
                this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
              } else {
                this.botonDestinatario = false;
                this.SePuedeAgregarMasCuentas = true;
              }
            });
          } else {

            this.http.get(this.globales.ruta + 'php/bancos/validar_cuenta_bancaria.php', { params: { cta_bancaria: valor } }).subscribe((data) => {
              if (data == 1) {
                this.botonDestinatario = false;
                this.confirmacionSwal.title = "Alerta";
                this.confirmacionSwal.text = "La cuenta que intenta registrar ya se encuentra registrada en la base de datos!";
                this.confirmacionSwal.type = "warning";
                this.confirmacionSwal.show();
                this.SePuedeAgregarMasCuentas = false;
                this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = '';
              } else {
                this.botonDestinatario = false;
                this.SePuedeAgregarMasCuentas = true;
              }
            });
          }
        }
      }, 700);
    }

  }

  RevalidarValores(nroCuenta, index) {
    if (nroCuenta == '') {
      if (!this.globales.IsObjEmpty(this.Lista_Cuentas_Destinatario[index])) {
        this.Lista_Cuentas_Destinatario[index].Id_Banco = '';
        this.Lista_Cuentas_Destinatario[index].Id_Tipo_Cuenta = '';
      }
    }
  }

  SetIdentificadorCuenta(idBanco, i) {
    //comprobar de que pais es el banco
    //buscar el identificador del banco si posee

    let cuentaDestinatario = this.Lista_Cuentas_Destinatario[i].Numero_Cuenta;

    if (cuentaDestinatario == '') {

      this.http.get(this.globales.ruta + '/php/bancos/buscar_identificador.php', { params: { id_banco: idBanco } }).subscribe((data: string) => {
        this.Lista_Cuentas_Destinatario[i].Numero_Cuenta = data;
      });
    }
  }

  //#endregion

  LongitudCarateres(i) {
    return parseInt(i.length);
  }

  buscarRiff() {
    this.urlRiff = "http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp";
    //this.frameRiff = !this.frameRiff;
    window.open("http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp", '_blank');
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  AsignarDatosDestinatarioNuevo(id): boolean {
    this.http.get(this.globales.ruta + 'php/destinatarios/filtrar_destinatarios.php', { params: { id_destinatario: id, moneda: this.MonedaParaTransferencia.id } }).subscribe((data: any) => {

      console.log(data);

      if (data != '') {

        if (this.DestinatarioEditar) {

          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Cuentas = data.Cuentas;

        } else {

          this.ListaDestinatarios[this.PosicionDestinatarioActivo].id_destinatario_transferencia = data;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Numero_Documento_Destino = data.Id_Destinatario;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Nombre_Destinatario = data.DestinatarioModel.Nombre;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Id_Destinatario_Cuenta = '';
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Cuentas = data.Cuentas;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Id_Moneda = this.MonedaParaTransferencia.id;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].EditarVisible = false;
        }

        this.DestinatarioEditar = false;
        this.PosicionDestinatarioActivo = '';
        return true;
      } else {

        this.ShowSwal('error', 'Consulta Fallida', 'No se encontraron datos del destinatario que se insertó!');
        this.DestinatarioEditar = false;
        this.PosicionDestinatarioActivo = '';
        return false;
      }
    });

    return true;
  }

  AsignarDatosDestinatario(respuestaModal: any): void {

    if (respuestaModal.willdo == 'limpiar campo id dest') {
      //this.ListaDestinatarios[this.PosicionDestinatarioActivo].id_destinatario_transferencia = '';

    } else if (respuestaModal.willdo == 'actualizar') {
      let p = { id_destinatario: respuestaModal.id_destinatario, moneda: this.MonedaParaTransferencia.id, solo_extranjeras: '1' };
      this.destinatarioService.filtrarDestinatario(p).subscribe((data: any) => {

        console.log(data);

        if (data != '') {

          this.ListaDestinatarios[this.PosicionDestinatarioActivo].id_destinatario_transferencia = data;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Numero_Documento_Destino = data.Id_Destinatario;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Nombre_Destinatario = data.Nombre;
          //this.ListaDestinatarios[this.PosicionDestinatarioActivo].Id_Destinatario_Cuenta = '';
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Cuentas = data.Cuentas;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Id_Moneda = this.MonedaParaTransferencia.id;
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].EditarVisible = true;

          this.PosicionDestinatarioActivo = '';
        } else {

          this.ShowSwal('error', 'Consulta Fallida', 'No se encontraron datos del destinatario que se insertó!');
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].id_destinatario_transferencia = '';
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Numero_Documento_Destino = '';
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Nombre_Destinatario = '';
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Id_Destinatario_Cuenta = '';
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Cuentas = [];
          this.ListaDestinatarios[this.PosicionDestinatarioActivo].Id_Moneda = this.MonedaParaTransferencia.id;

          this.PosicionDestinatarioActivo = '';
        }
      });

    }
  }
}
