import '../../../assets/charts/amchart/amcharts.js';
import '../../../assets/charts/amchart/gauge.js';
import '../../../assets/charts/amchart/pie.js';
import '../../../assets/charts/amchart/serial.js';
import '../../../assets/charts/amchart/light.js';
import '../../../assets/charts/amchart/ammap.js';
import '../../../assets/charts/amchart/worldLow.js';
import '../../../assets/charts/amchart/continentsLow.js';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';
import { GeneralService } from '../../shared/services/general/general.service';
import { CuentabancariaService } from '../../shared/services/cuentasbancarias/cuentabancaria.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { TesCustomServiceService } from '../../tes-custom-service.service';
import { ActualizarService } from '../../customservices/actualizar.service';



@Component({
  selector: 'app-tableroconsultor',
  templateUrl: './tableroconsultor.component.html',
  styleUrls: ['./tableroconsultor.component.scss'],
})

export class TableroconsultorComponent implements OnInit, OnDestroy {

  @Output() AbrirCuentas: EventEmitter<any> = new EventEmitter();

  //NUEVO CODIGO  
  @ViewChild('ModalCambiarBanco') ModalCambiarBanco: any;
  @ViewChild('ModalCierreCuenta') ModalCierreCuenta: any;
  @ViewChild('ModalCrearAjuste') ModalCrearAjuste: any;
  @ViewChild('ModalCompraCuenta') ModalCompraCuenta: any;
  @ViewChild('modalT') modalT: any;
  @ViewChild('alertSwal') alertSwal: any;

  public cargar = false;
  public cargarTabla: boolean = false;
  public funcionario: any = JSON.parse(localStorage['User']);
  public Paises: any = [];
  public ListaBancos: any = [];
  public MovimientosCuentaBancaria: any = [];
  public CuentasSeleccionadas: any = [];
  public Indicadores: any = {
    Pendientes: 0,
    Realizadas: 0,
    Devueltas: 0,
    Productividad: 0,
  };

  public AperturaCuentaModel: any = {
    Id_Cuenta_Bancaria: '',
    Id_Moneda: '',
    Valor: '',
    Id_Bloqueo_Cuenta: ''
  };

  public CierreCuentaModel: any = {
    Id_Moneda: '',
    Id_Cuenta_Bancaria: '',
    Valor: '',
    Id_Bloqueo_Cuenta: ''
  };

  public CierreValoresModel: any = {
    SaldoInicial: 0,
    Egresos: 0,
    Ingresos: 0,
    SaldoFinal: 0
  };

  public DatosCuentaModel: any = {
    Nro_Cuenta: '',
    SaldoInicial: 0,
    SaldoRestante: 0
  };

  public AjusteCuentaModel: any = {
    Id_Cuenta_Bancaria: '',
    Valor: 0,
    Tipo: 'Ingreso',
    Detalle: '',
    Id_Transferencia_Destino: '0'
  };

  public CompraCuentaModel: any = {
    Id_Cuenta_Bancaria: '',
    Valor: '',
    Detalle: '',
    Id_Funcionario: ''
  };

  private Id_Movimientos_Cuenta: any = [];

  public CuentaConsultor: any = localStorage.getItem("CuentaConsultor");
  public MonedaCuentaConsultor: any = localStorage.getItem("MonedaCuentaConsultor");
  public IdBloqueoCuenta: any = '';
  public CodigoMoneda: string = '';
  public MontoInicial: any = 0;
  public TiposTransferencias: any = ['Pendientes', 'Realizadas', 'Devueltas'];

  public TablaPendientes: boolean = false;
  public TablaRealizadas: boolean = false;
  public TablaDevueltas: boolean = false;
  public Seleccionado: string = 'Pendientes';

  public ChartData: any = [];
  public ChartLabels = ['Realizadas', 'Devueltas'];

  public OpcionCuenta: string = 'Abrir';
  public IconoOpcionCuenta: string = 'ti-key';

  public AbrirModalAperturaCuenta: Subject<any> = new Subject();
  public Id_Funcionario: string = JSON.parse(localStorage['User']).Identificacion_Funcionario;
  public Id_Apertura: string = '';
  public TransferenciasListar: Array<any> = [];


  public Filtros: any = {
    fecha: null,
    codigo: '',
    cajero: '',
    valor: '',
    pendiente: '',
    cedula: '',
    cta_destino: '',
    nombre_destinatario: '',
    estado: ''
  };

  //Paginación
  public maxSize = 5;
  public pageSize = 10;
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0
  }

  public sub = new Subscription();

  constructor(private http: HttpClient,
    private globales: Globales,
    private _generalService: GeneralService,
    private _cuentaBancariaService: CuentabancariaService,
    private _swalService: SwalService,
    private _TesCustomServiceService: TesCustomServiceService,
    private _actualizar: ActualizarService
  ) { }


  ngOnInit() {
    this.AsignarPaises();
    this.Id_Apertura = localStorage.getItem("Apertura_Consultor");
    this._getCuentasFuncionarioApertura();
    this._actualizar.cardListing.subscribe(() => {
      this.CargarIndicadores();
    })
    // this.sub = this._TesCustomServiceService.subjec.subscribe((data) => {
    //   this.TransferenciasListar = data['query_data'];
    //   this.SetInformacionPaginacion();
    // })

  }

  CargarVista() {
    if (this.cargar) {
      this.CargarIndicadores();
      this.cargarTabla = true;
      this.TablaPendientes = true;
    };
  }

  public ConsultarAperturaFuncionario() {
    this._cuentaBancariaService.GetAperturaFuncionario(this.Id_Funcionario).subscribe((data: any) => {
      // console.log(data);

      if (!data.apertura_activa) {
        this.AbrirCuentas.emit();
      } else {
        this.Id_Apertura = localStorage.getItem("Apertura_Consultor");
        this._getCuentasFuncionarioApertura();
      }
    });
  }

  private _getCuentasFuncionarioApertura() {
    this._cuentaBancariaService.GetCuentasFuncionarioApertura(this.Id_Apertura).subscribe((data: any) => {
      // console.log(data);

      if (data.codigo == 'success') {
        this.CuentasSeleccionadas = data.query_data;
      } else {
        this.CuentasSeleccionadas = [];
        this._swalService.ShowMessage(['warning', 'Alerta', 'No se encontraron cuentas para el registro de apertura, contacte con el administrador!']);
      }
    });
  }

  public AbrirModalAPerturaCuentas() {
    // console.log("abriendo modal apertura cuenta desde tablero");
    this.AbrirModalAperturaCuenta.next();
  }

  //#region CODIGO NUEVO
  CambiarCuentaBancaria() {
    if (this.CuentaConsultor != '') {

      if (this.CuentaConsultor == '' || this.MonedaCuentaConsultor == '') {
        this.ShowSwal('warning', 'Alerta', 'Debe abrir una cuenta antes de realizar un movimiento de cierre!');
        return;
      } else {
        this.GetMovimientosCuentaBancaria();
      }
    } else {

      if (this.CuentaConsultor != '') {
        this.ShowSwal('warning', 'Alerta', 'Debe cerrar la cuenta actual antes de abrir otra!');
        return;
      } else {
        this.ModalCambiarBanco.show();
      }
    }
  }

  GuardarMontoInicial2(modal) {
    let id_funcionario = this.funcionario.Identificacion_Funcionario;
    let info = JSON.stringify(this.AperturaCuentaModel);
    let datos = new FormData();
    datos.append("modelo", info);
    datos.append("id_funcionario", this.Id_Funcionario);
    datos.append("id_bloqueo_cuenta", this.IdBloqueoCuenta);
    this.http.post(this.globales.ruta + '/php/cuentasbancarias/apertura_cuenta_bancaria.php', datos).subscribe((data: any) => {

      if (data.codigo == 'warning') {
        this.ShowSwal(data.codigo, 'Alerta', data.mensaje);
        this.cargarTabla = false;
        this.TablaPendientes = false;
        this.CierreValoresModel.SaldoInicial = 0;
        this.CierreValoresModel.SaldoFinal = 0;
        this.Id_Movimientos_Cuenta = [];

        this.LimpiarModeloDatosResumen();

      } else {

        this.ShowSwal(data.codigo, 'Registro Exitoso', data.mensaje);
        this.VerificarAperturaCuenta();

        this.CierreValoresModel.SaldoInicial = parseFloat(this.MontoInicial);
        this.CierreValoresModel.SaldoFinal = parseFloat(this.MontoInicial);
        this.OpcionCuenta = 'Cambiar';
        this.IconoOpcionCuenta = 'ti-reload';
        modal.hide();
      }
    });
  }

  CerrarCuentaConsultor() {
    if (this.CuentaConsultor == '') {
      this.ShowSwal('warning', 'Alerta', 'Debe abrir una cuenta antes de realizar un movimiento de cierre!');
      return;
    }

    let id_funcionario = this.funcionario.Identificacion_Funcionario;
    let info = JSON.stringify(this.CierreCuentaModel);
    let ids = JSON.stringify(this.Id_Movimientos_Cuenta);
    let datos = new FormData();
    datos.append("modelo", info);
    datos.append("id_funcionario", this.Id_Funcionario);
    datos.append("id_movimientos", ids);

    this.http.post(this.globales.ruta + '/php/cuentasbancarias/cierre_cuenta_bancaria.php', datos).subscribe((data: any) => {

      this.ShowSwal(data.codigo, 'Registro Exitoso', data.mensaje);

      this.CuentaConsultor = '';
      this.MonedaCuentaConsultor = '';
      this.IdBloqueoCuenta = '';
      this.CodigoMoneda = '';
      this.MontoInicial = 0;
      this.Id_Movimientos_Cuenta = [];
      this.LimpiarModeloCierreCuenta();
      this.LimpiarModeloDatosResumen();
      this.LimpiarModeloValoresCierre();
      this.LimpiarIndicadores();
      this.ChartData = [];
      this.ModalCierreCuenta.hide();
      this.ModalCambiarBanco.show();
      localStorage.setItem('CuentaConsultor', '');
      localStorage.setItem('MonedaCuentaConsultor', '');
      this.OpcionCuenta = 'Abrir';
      this.IconoOpcionCuenta = 'ti-key';
    });
  }

  VerificarAperturaCuenta() {

    this.http.get(this.globales.ruta + 'php/cuentasbancarias/verificar_apertura_cuenta.php', { params: { id_funcionario: this.Id_Funcionario } }).subscribe((data: any) => {

      if (data.existe == 0) {
        this.ModalCambiarBanco.show();
        this.MonedaCuentaConsultor = '';
        this.CuentaConsultor = '';
        this.IdBloqueoCuenta = '';
        this.CodigoMoneda = '';
        this.MontoInicial = 0;
        this.LimpiarModeloDatosResumen();
        this.LimpiarIndicadores();
        this.ChartData = [];
        this.Id_Movimientos_Cuenta = [];
        this.OpcionCuenta = 'Abrir';
        this.IconoOpcionCuenta = 'ti-key';
        this.cargar = false;
      } else {


        this.MonedaCuentaConsultor = data.datos_apertura.Id_Moneda;
        this.CuentaConsultor = data.datos_apertura.Id_Cuenta_Bancaria;
        this.IdBloqueoCuenta = data.datos_apertura.Id_Bloqueo_Cuenta;
        this.CodigoMoneda = data.datos_apertura.Codigo;
        this.MontoInicial = data.datos_apertura.Valor;
        this.CierreValoresModel.SaldoInicial = parseFloat(this.MontoInicial);
        this.CierreValoresModel.SaldoFinal = parseFloat(this.MontoInicial);
        localStorage.setItem("CuentaConsultor", this.CuentaConsultor);
        localStorage.setItem("MonedaCuentaConsultor", this.MonedaCuentaConsultor);
        this.OpcionCuenta = 'Cambiar';
        this.IconoOpcionCuenta = 'ti-reload';

        this.CargarIndicadores();
        this.GetResumenCuenta();

        this.cargar = true;
      }

      this.CargarVista();
    });
  }

  GuardarMovimientoAjuste() {
    let info = JSON.stringify(this.AjusteCuentaModel);
    let datos = new FormData();
    datos.append("modelo", info);

    this.http.post(this.globales.ruta + 'php/cuentasbancarias/crear_movimiento_ajuste_cuenta.php', datos).subscribe((data: any) => {

      this.ShowSwal(data.codigo, 'Registro Exitoso', data.mensaje);
      this.GetMovimientosCuentaBancaria();
      this.ModalCrearAjuste.hide();
      this.LimpiarModeloAjuste();
    });
  }

  GuardarCompra() {
    let info = JSON.stringify(this.CompraCuentaModel);
    let datos = new FormData();
    datos.append("modelo", info);

    this.http.post(this.globales.ruta + 'php/cuentasbancarias/crear_compra_cuenta_bancaria.php', datos).subscribe((data: any) => {

      this.ShowSwal(data.codigo, 'Registro Exitoso', data.mensaje);
      this.GetMovimientosCuentaBancaria();
      this.ModalCompraCuenta.hide();
      this.LimpiarModeloCompra();
    });
  }


  CargarIndicadores() {
    this.http.get(this.globales.ruta + 'php/transferencias/indicadores_transferencias.php', { params: { id_funcionario: this.Id_Funcionario } }).subscribe((data: any) => {

      // console.log(data);

      if (data.existe == 1) {
        this.Indicadores = data.indicadores;
        this.ChartData = [];
        this.ChartData.push(this.Indicadores.Pendientes);
        this.ChartData.push(this.Indicadores.Realizadas);
        this.ChartData.push(this.Indicadores.Devueltas);
      } else {
        this.LimpiarIndicadores();
        this.ChartData = [];
        this.Indicadores = { Pendientes: 0, Realizadas: 0, Devueltas: 0, Productividad: 0 };

      }
    });
  }

  CargarBancosPais(id_pais) {
    if (id_pais == '') {
      this.LimpiarModeloCuentaBancaria();
      this.ListaBancos = [];
      return;
    }

    this.http.get(this.globales.ruta + 'php/bancos/lista_bancos_por_pais.php', { params: { id_pais: id_pais } }).subscribe((data: any) => {
      this.ListaBancos = data;
    });
  }

  AbrirModalAjuste() {
    this.AjusteCuentaModel.Id_Cuenta_Bancaria = this.CuentaConsultor;
    this.ModalCrearAjuste.show();
  }

  AbrirModalCompra() {
    this.CompraCuentaModel.Id_Cuenta_Bancaria = this.CuentaConsultor;
    this.CompraCuentaModel.Id_Funcionario = this.Id_Funcionario;
    this.ModalCompraCuenta.show();
  }

  LimpiarModeloCuentaBancaria() {
    this.AperturaCuentaModel = {
      Id_Cuenta_Bancaria: '',
      Id_Moneda: '',
      Valor: '',
      Id_Bloqueo_Cuenta: ''
    };
  }

  LimpiarModeloValoresCierre() {
    this.CierreValoresModel = {
      SaldoInicial: this.MontoInicial,
      Egresos: 0,
      Ingresos: 0,
      SaldoFinal: this.MontoInicial
    };
  }

  LimpiarModeloCierreCuenta() {
    this.CierreCuentaModel = {
      Id_Moneda: '',
      Id_Cuenta_Bancaria: '',
      Valor: '',
      Id_Bloqueo_Cuenta: ''
    };
  }

  LimpiarModeloDatosResumen() {
    this.DatosCuentaModel = {
      Nro_Cuenta: 0,
      SaldoInicial: 0,
      SaldoRestante: 0
    };
  }

  LimpiarIndicadores() {
    this.Indicadores = {
      Pendiente: 0,
      Realizadas: 0,
      Devueltas: 0,
      Productividad: 0,
    };
  }

  LimpiarModeloAjuste() {
    this.AjusteCuentaModel = {
      Id_Cuenta_Bancaria: '',
      Valor: 0,
      Tipo: 'Ingreso',
      Detalle: '',
      Id_Transferencia_Destino: '0'
    };
  }

  LimpiarModeloCompra() {
    this.CompraCuentaModel = {
      Id_Cuenta_Bancaria: '',
      Valor: '',
      Detalle: '',
      Id_Funcionario: ''
    };
  }

<<<<<<< HEAD
  async AsignarPaises() {
    this.Paises = await this.globales.Paises;
=======
  AsignarPaises() {
    this.Paises = this.globales.Paises;
>>>>>>> de4f37a2ab29e5d58678930a3c1a3dffabe1b05b
    this.cargar = true;
    this.CargarVista();
  }

  VerificarSaldo(value) {
    if (value == '') {
      this.AperturaCuentaModel.Valor = '';
      this.AperturaCuentaModel.Id_Cuenta_Bancaria = value;
      this.AperturaCuentaModel.Id_Moneda = '';
      return;
    }

    this.ConsultarValorCuenta(value);
  }

  ConsultarValorCuenta(id_cuenta) {
    this.http.get(this.globales.ruta + 'php/cuentasbancarias/cargar_saldo_cuenta.php', { params: { id_cuenta: id_cuenta } }).subscribe((data: any) => {

      if (data.codigo == "error") {
        this.ShowSwal(data.codigo, 'Error en la cuenta', data.mensaje);
        this.AperturaCuentaModel.Id_Moneda = '';
        this.AperturaCuentaModel.Id_Cuenta_Bancaria = '';
        this.AperturaCuentaModel.Valor = '';

      } else {

        var index = this.ListaBancos.findIndex(x => x.Id_Cuenta_Bancaria === id_cuenta);
        if (index > -1) {
          this.AperturaCuentaModel.Id_Moneda = this.ListaBancos[index].Id_Moneda;
          this.AperturaCuentaModel.Id_Cuenta_Bancaria = id_cuenta;
          this.AperturaCuentaModel.Valor = data.Valor_Cuenta;
          //GuardarInicio
        }
      }
    });
  }

  GetNumeroCuenta() {
    var index = this.ListaBancos.findIndex(x => x.Id_Cuenta_Bancaria === this.CuentaConsultor);
    if (index > -1) {
      return this.ListaBancos[index].Numero_Cuenta;
      //GuardarInicio
    }
  }

  GetMovimientosCuentaBancaria() {
    let p = { id_cuenta: this.CuentaConsultor, id_bloqueo_cuenta: this.IdBloqueoCuenta };
    this.http.get(this.globales.ruta + 'php/cuentasbancarias/movimientos_cuenta_bancaria.php', { params: p }).subscribe((data: any) => {


      this.CierreValoresModel.SaldoFinal = this.CierreValoresModel.SaldoInicial;

      if (data.data[0]) {

        this.MovimientosCuentaBancaria = data.data;
        this.Id_Movimientos_Cuenta = data.ids;
        this.LlenarValoresCierre(this.MovimientosCuentaBancaria);
        this.AsignarValoresModeloCierreCuenta();
      } else {
        this.MovimientosCuentaBancaria = [];
        this.Id_Movimientos_Cuenta = [];
        this.LimpiarModeloValoresCierre();
        this.AsignarValoresModeloCierreCuenta();
      }
    });

    this.ModalCierreCuenta.show();
  }

  LlenarValoresCierre(valores) {
    let egresos = 0;
    let ingresos = 0;

    valores.forEach((m, i) => {
      let e = parseFloat(m.Egreso);
      let ing = parseFloat(m.Ingreso);

      egresos += e;
      ingresos += ing;

      if (e != 0 && ing == 0) {
        this.CierreValoresModel.SaldoFinal = parseFloat(this.CierreValoresModel.SaldoFinal) - e;
      } else if (e == 0 && ing != 0) {
        this.CierreValoresModel.SaldoFinal = parseFloat(this.CierreValoresModel.SaldoFinal) + ing;
      }
    });

    this.CierreValoresModel.Egresos = egresos;
    this.CierreValoresModel.Ingresos = ingresos;
  }

  GetResumenCuenta() {
    this.http.get(this.globales.ruta + 'php/cuentasbancarias/resumen_cuenta_bancaria.php', { params: { id_cuenta: this.CuentaConsultor } }).subscribe((data: any) => {

      this.DatosCuentaModel.Nro_Cuenta = data.Resumen.Numero_Cuenta;
      this.DatosCuentaModel.SaldoInicial = data.Resumen.Saldo_Inicial;
      this.DatosCuentaModel.SaldoRestante = data.Resumen.Saldo_Final;
    });
  }

  AsignarValoresModeloCierreCuenta() {

    this.CierreCuentaModel.Id_Moneda = this.MonedaCuentaConsultor;
    this.CierreCuentaModel.Id_Cuenta_Bancaria = this.CuentaConsultor;
    this.CierreCuentaModel.Valor = this.CierreValoresModel.SaldoFinal.toString();
    this.CierreCuentaModel.Id_Bloqueo_Cuenta = this.IdBloqueoCuenta;
  }

  CerrarModalCierreCuenta() {
    this.LimpiarModeloValoresCierre();
    this.MovimientosCuentaBancaria = [];
    this.ModalCierreCuenta.hide();
  }

  MostrarTabla(tabla) {

    this.Seleccionado = tabla;

    switch (tabla) {
      case 'Pendientes':
        this.TablaPendientes = true;
        this.TablaRealizadas = false;
        this.TablaDevueltas = false;
        break;

      case 'Realizadas':
        this.TablaPendientes = false;
        this.TablaRealizadas = true;
        this.TablaDevueltas = false;
        break;

      case 'Devueltas':
        this.TablaPendientes = false;
        this.TablaRealizadas = false;
        this.TablaDevueltas = true;
        break;

      default:
        break;
    }
  }

  ShowSwal(tipo: string, titulo: string, msg: string) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  public RecibirCuentasSeleccionadas(datos: any) {
    // console.log(datos);

    this.CuentasSeleccionadas = datos.cuentas;
    this.Id_Apertura = datos.id_apertura;
  }



  SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.tam = this.pageSize;
    params.id_funcionario = this.Id_Funcionario;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1;
      params.pag = this.page;
    }

    if (this.Filtros.fecha != null && this.Filtros.fecha.formatted.trim() != "") {
      params.fecha = this.Filtros.fecha.formatted;
    }

    if (this.Filtros.codigo.trim() != "") {
      params.codigo = this.Filtros.codigo;
    }

    if (this.Filtros.cajero.trim() != "") {
      params.cajero = this.Filtros.cajero;
    }

    if (this.Filtros.valor.trim() != "") {
      params.valor = this.Filtros.valor;
    }

    if (this.Filtros.pendiente.trim() != "") {
      params.pendiente = this.Filtros.pendiente;
    }

    if (this.Filtros.cedula.trim() != "") {
      params.cedula = this.Filtros.cedula;
    }

    if (this.Filtros.cta_destino.trim() != "") {
      params.cta_destino = this.Filtros.cta_destino;
    }

    if (this.Filtros.nombre_destinatario.trim() != "") {
      params.nombre_destinatario = this.Filtros.nombre_destinatario;
    }

    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
    }

    return params;
  }

  customFilter(filter: string): void {
    this._TesCustomServiceService.customConsultaFiltrada(true, filter);
  }

  ResetValues() {
    this.Filtros = {
      fecha: '',
      codigo: '',
      cajero: '',
      valor: '',
      pendiente: '',
      cedula: '',
      cta_destino: '',
      nombre_destinatario: '',
      estado: ''
    };
  }

  SetInformacionPaginacion() {
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }
  ngOnDestroy() {
    this.sub.unsubscribe()
  }

}
