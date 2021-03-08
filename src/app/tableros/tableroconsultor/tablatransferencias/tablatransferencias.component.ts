import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable, Subject } from 'rxjs';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { TransfereciaViewModel } from '../../../Modelos/TransferenciaViewModel';
import { PuntosPipe } from '../../../common/Pipes/puntos.pipe';
import { TransferenciaService } from '../../../shared/services/transferencia/transferencia.service';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { ISubscription, Subscription } from 'rxjs/Subscription';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { IMyDrpOptions } from 'mydaterangepicker';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { GeneralService } from '../../../shared/services/general/general.service';
import { Router } from '@angular/router';
import { providers } from 'ng2-toasty';
import { TesCustomServiceService } from '../../../tes-custom-service.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-tablatransferencias',
  templateUrl: './tablatransferencias.component.html',
  styleUrls: ['../../../../style.scss', './tablatransferencias.component.scss'],
})

export class TablatransferenciasComponent implements OnInit, OnChanges, OnDestroy {

  @Input() Id_Funcionario: string = '';
  @Input() Id_Apertura: string = '';
  @Input() CuentasBancariasSeleccionadas: any = [];
  @ViewChild('OtraCosa') OtraCosa: any;

  @Output() ActualizarIndicadores = new EventEmitter();
  private TransferenciasActualizadas: ISubscription;

  public AbrirModalCompra: Subject<any> = new Subject();
  public BloquearSeleccion: boolean = false;

  @ViewChild('ModalPrueba') ModalPrueba: any;
  @ViewChild('ModalTransferencia') ModalTransferencia: any;
  @ViewChild('alertSwal') alertSwal: any;

  public AbrirModalDevolucion: Subject<any> = new Subject();

  public Funcionario: any = JSON.parse(localStorage['User']);

  public TransferenciasListar: Array<any> = [];
  public TransferenciasSeleccionadas: Array<any> = [];
  private TransferenciaActual: any = '';
  public ListaBancos: any = [];
  public CuentaData: any = [];
  public NombreCuenta: string = '';
  public CuentasBancarias: any = [];
  public ValorConFormato: string = '';
  public Cargando: boolean = false;
  public ValorRealCuenta: number = 0;
  public CodigoMonedaValorReal: string = '';
  public infoTranferencia: any = [];

  public custom = 0;
  public MovimientoBancoModel: any = {
    Valor: '0',
    Id_Cuenta_Bancaria: '',
    Detalle: '',
    Tipo: 'Egreso',
    Id_Transferencia_Destino: '',
    Numero_Transferencia: '',
    Ajuste: 'No'
  };

  public Filtros: any = {
    fecha: null,
    codigo: '',
    realiza: '',
    cajero: '',
    valor: '',
    pendiente: '',
    cedula: '',
    cta_destino: '',
    nombre_destinatario: '',
    estado: '',
    cliente: ''
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


  public myDateRangePickerOptions: IMyDrpOptions = {
    width: '100%',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  public TransferenciaModel: TransfereciaViewModel = new TransfereciaViewModel();
  public FinHoraLaboral: string = '';

  public MonedaCuentaConsultor: any = '';
  public sub = new Subscription();
  public filter: string = '';
  public SubscriptionTimer1: Subscription;
  public SubscriptionTimer2: Subscription;
  public alertOption: any;
  public temporal: any;
  public temporalData: any;
  public nuevaData: boolean = true;


  constructor(private http: HttpClient, public globales: Globales,
    private cuentaService: CuentabancariaService,
    private puntosPipe: PuntosPipe,
    private _transferenciaService: TransferenciaService,
    private _toastService: ToastService,
    private _swalService: SwalService,
    private _generalService: GeneralService,
    private _router: Router,
    private _TesCustomServiceService: TesCustomServiceService,
  ) {

    this.alertOption = {
      title: "¿Está Seguro?",
      text: "Se dispone a Desbloquear esta transferencia",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si',
      showLoaderOnConfirm: true,
      focusCancel: true,
      type: 'info',

      preConfirm: (value) => {
        return new Promise((resolve) => {
          this.DesbloquearTransferencia2(this.temporal);

        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }

    this._getMaximaHoraTransferencias();
    if (localStorage.getItem('flagHabilitado') == undefined || localStorage.getItem('flagHabilitado') == 'true') {
      this.flagHabilitado = true;
    } else {
      this.flagHabilitado = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }


  ngOnInit() {
    this.sub = this._TesCustomServiceService.subjec.subscribe((data: string) => {
      this.filter = data
      this.ConsultaFiltradaObservable(false, this.filter);
    })

    this.SubscriptionTimer2 = this.TransferenciasActualizadas = TimerObservable.create(0, 500)
      .subscribe(() => {
        this.ConsultaFiltradaObservable(false, this.filter);
      });

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
    if (this.TransferenciasActualizadas != null) {
      this.TransferenciasActualizadas.unsubscribe();
    }
    this.SubscriptionTimer2.unsubscribe();
  }

  GetCuentasBancarias(idFuncionario: string) {
    this.cuentaService.getCuentasBancariasFuncionario(idFuncionario).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.CuentasBancarias = data.query_data;
      } else {

        this.ShowSwal("warning", "Alerta", "No se econtraron datos de cuentas bancarias!");
      }
    });
  }

  private _getMaximaHoraTransferencias() {
    this._transferenciaService.GetMaximaHoraTransferencia().subscribe((response: any) => {
      this.FinHoraLaboral = response.query_data.Fin_Hora_Laboral;
    });
  }

  public flagHabilitado: boolean = true;

  async BloquearTransferencia(modelo: any) {
    this.infoTranferencia = await this.searchInfo(modelo);
    if (this.flagHabilitado) {
      if (this.infoTranferencia['Estado_Consultor'] == 'Cerrada') {
        this.BloqueadaTransferencia(modelo)
        this.AsginarValoresModalCrear(modelo);
        this.ModalTransferencia.show();
        this.flagHabilitado = false;
        localStorage.setItem('flagHabilitado', 'false')
      }
    } else {
      if (this.infoTranferencia['Estado_Consultor'] == 'Abierta' && this.infoTranferencia['Funcionario_Opera'] == this.Funcionario.Identificacion_Funcionario) {
      } else {
        this._swalService.ShowMessage(['warning', 'Alerta', `No puede seleccionar mas de una transferencia a la vez!`]);
      }
    }

    if (this.infoTranferencia['Estado_Consultor'] == 'Abierta' && this.infoTranferencia['Funcionario_Opera'] != this.Funcionario.Identificacion_Funcionario) {
      this._swalService.ShowMessage(['warning', 'Alerta', `Este Recibo ha sido bloqueado por ! ${this.infoTranferencia['Funcionario_Opera']}`]);
    }


    if (this.infoTranferencia['Estado_Consultor'] == 'Abierta' && this.infoTranferencia['Funcionario_Opera'] == this.Funcionario.Identificacion_Funcionario) {
      this.AsginarValoresModalCrear(modelo);
      this.ModalTransferencia.show();
    }


  }


  DesbloquearTransferencia() {
    this.habilitarTransferencia();
    this.TransferenciaModel = new TransfereciaViewModel();
    this._limpiarMovimientoBancoModel();
    this.ModalTransferencia.hide();
    this.flagHabilitado = true
    localStorage.setItem('flagHabilitado', 'true')

  }

  DesbloquearTransferencia2(infoTranferencia) {

    this.http.get(this.globales.rutaNueva + 'desbloquear', { params: infoTranferencia }).subscribe((data: any) => { });
    this.TransferenciaModel = new TransfereciaViewModel();
    this._limpiarMovimientoBancoModel();

  }

  public habilitarTransferencia() {
    this.http.get(this.globales.rutaNueva + 'desbloquear', { params: this.infoTranferencia }).subscribe((data: any) => { });
  }


  public SeleccionarTransferencia(modelo: any) {
    if (!this.BloquearSeleccion) {
      this.BloquearSeleccion = true;
      if (!this._validarHoraTransferencia()) {
        this.BloquearSeleccion = false;
        return;
      } else {
        if (this.TransferenciasSeleccionadas.length == 0) {
          if (modelo.Estado == 'Pagada') {
            this.BloquearSeleccion = false;
            this._swalService.ShowMessage(['warning', 'Alerta', 'No puede seleccionar una transferencia pagada!']);
          } else {
            this._transferenciaService.CheckEstadoAperturaTransferencia(modelo.Id_Transferencia_Destinatario).subscribe((data: any) => {
              if (data == '1') {
                this.BloquearSeleccion = false;
                this.TransferenciasSeleccionadas.push(modelo);

                let data = new FormData();
                data.append("id_funcionario", this.Funcionario.Identificacion_Funcionario);
                data.append("id_transferencia", modelo.Id_Transferencia_Destinatario);
                this._transferenciaService.BloquearTransferencia(data).subscribe(response => {

                });
              }
            });
          }
        } else {
          this.BloquearSeleccion = false;
          this._swalService.ShowMessage(['warning', 'Alerta', 'No puede seleccionar mas de una transferencia a la vez!']);
        }
      }
    }
  }

  public DeseleccionarTransferencia(idTransferenciaDestinatario: any) {

    let ind = this.TransferenciasSeleccionadas.findIndex(x => x.Id_Transferencia_Destinatario == idTransferenciaDestinatario);
    if (ind > -1) {
      this.TransferenciasSeleccionadas.splice(ind, 1);
    }

    let data = new FormData();
    data.append("id_transferencia", idTransferenciaDestinatario);
    this._transferenciaService.DesbloquearTransferencia(data).subscribe((response: any) => {
    });
  }

  GuardarTransferencia(modal) {

    if (this.custom < this.MovimientoBancoModel.Valor) {
      this.ShowSwal('warning', 'Alerta', 'El valor registrado es mayor al de la transferencia!');
      this.MovimientoBancoModel.Valor = 0;
      return false;
    }

    if (this.MovimientoBancoModel.Valor > this.ValorRealCuenta) {
      this.ShowSwal('warning', 'Alerta', 'El valor registrado es mayor al saldo en cuenta!');
      this.MovimientoBancoModel.Valor = 0;
      return false;
    }

    if (!this._validarHoraTransferencia(true)) {
      return;
    } else {
      let info = JSON.stringify(this.MovimientoBancoModel);
      let datos = new FormData();
      datos.append("modelo", info);
      datos.append("cajero", this.Id_Funcionario);
      datos.append("id_apertura", this.Id_Apertura);
      datos.append("id_cuenta_origen", this.TransferenciaModel.Cuenta_Origen);

      this.http.post(this.globales.ruta + 'php/transferencias/guardar_transferencia_consultor.php', datos).subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.flagHabilitado = true;
          localStorage.setItem('flagHabilitado', 'true')

          this.ShowSwal('success', 'Registro Exitoso', 'Se ha realizado la transferencia exitosamente!');
          this.ValorRealCuenta = 0;
          modal.hide();
          this.DeseleccionarTransferencia(this.MovimientoBancoModel.Id_Transferencia_Destino);
          this.ActualizarIndicadores.emit(null);
          this._limpiarMovimientoBancoModel();
        } else {
          this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        }

      });
    }
  }

  private _validarHoraTransferencia(esGuardar: boolean = false) {
    if (this._generalService.HoraActual > this.FinHoraLaboral) {
      this._swalService.ShowMessage(['warning', 'Alerta', 'No puede seguir realizando transferencias, ya se cumplio la hora limite!']);
      if (esGuardar) {
        this.DesbloquearTransferencia();
        this.DeseleccionarTransferencia(this.TransferenciasSeleccionadas[0].Id_Transferencia_Destinatario);
      }
      return false;
    } else {
      return true;
    }
  }

  FormatValue(value: string) {
    this.ValorConFormato = this.puntosPipe.transform(value);
  }

  AsginarValoresModalCrear(modelo: any) {
    this.TransferenciaModel = modelo;
    this.MovimientoBancoModel.Valor = modelo.Valor_Real;
    this.custom = modelo.Valor_Real;
    this.MovimientoBancoModel.Id_Transferencia_Destino = modelo.Id_Transferencia_Destinatario;
  };

  ShowSwal(tipo: string, titulo: string, msg: string) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  SetFiltros(paginacion: boolean, filter: string = '') {
    let params: any = {};

    params.tam = this.pageSize;
    params.id_funcionario = this.Id_Funcionario;



    if (paginacion === true) {
      params.pag = this.page;
      params.paginacion = true;
    } else {
      this.page = 1;
      params.pag = this.page;
      params.paginacion = false;
    }



    if (filter != '') {
      this.Filtros.estado = filter
      this.filter = ''
    }

    if (this.Filtros.fecha != null && this.Filtros.fecha.formatted.trim() != "") {
      params.fecha = this.Filtros.fecha.formatted;
    }

    if (this.Filtros.codigo.trim() != "") {
      params.codigo = this.Filtros.codigo;
    }

    if (this.Filtros.cliente.trim() != "") {
      params.cliente = this.Filtros.cliente;
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
    if (this.Filtros.realiza.trim() != "") {
      params.realiza = this.Filtros.realiza;
    }


    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {

    var p = this.SetFiltros(paginacion);

    if (p === '') {
      this.ResetValues();
      return;
    }

    this.Cargando = true;
    this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_consultores.php', { params: p }).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.TransferenciasListar = data.query_data;
        this.TotalItems = data.numReg;
      } else {
        this.TransferenciasListar = [];
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      }

      console.log(this.TransferenciasListar);
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ConsultaFiltradaObservable(paginacion: boolean = false, filter: string = '') {
    if (this.Filtros.estado == 'Pagada') {
      paginacion = true;
    }

    var p = this.SetFiltros(paginacion, filter);

    if (p === '') {
      this.ResetValues();
      return;
    }

    this._transferenciaService.GetTransferenciasConsultorObservableDev(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        // if (!this.nuevaData) {
        // if (!this.mifuncion(this.temporalData, data.query_data)) {
        this.temporalData = data.query_data
        this.TransferenciasListar = data.query_data;
        this.TotalItems = data.numReg;
        this.Cargando = false;
        this.ActualizarIndicadores.emit()
        this.SetInformacionPaginacion();
        // }
        // } else {
        // this.temporalData = data.query_data
        // this.TransferenciasListar = data.query_data;
        // this.nuevaData = false;
        // this.TotalItems = data.numReg;
        // this.Cargando = false;
        // this.ActualizarIndicadores.emit()

        // this.SetInformacionPaginacion();
        // }
      } else {
        this.TransferenciasListar = [];
        // this.ShowSwal('info', data.titulo, data.mensaje);
      }
    });
  }

  ResetValues() {
    this.Filtros = {
      fecha: '',
      codigo: '',
      cajero: '',
      realiza: '',
      valor: '',
      pendiente: '',
      cedula: '',
      cta_destino: '',
      nombre_destinatario: '',
      estado: ''
    };
  }

  mifuncion(a1: Array<any>, a2: Array<any>) {
    return JSON.stringify(a1) === JSON.stringify(a2);
  }

  SetInformacionPaginacion() {
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

  public dateRangeChanged(event) {
    if (event.formatted != "") {
      this.Filtros.fecha = event;
    } else {
      this.Filtros.fecha = '';
    }

    this.ConsultaFiltradaObservable();
  }

  public DevolverTransferencia(transferenciaModel: any) {
    let p = { model: transferenciaModel, id_apertura: this.Id_Apertura };
    this.AbrirModalDevolucion.next(p);
  }

  private _limpiarMovimientoBancoModel() {
    this.MovimientoBancoModel = {
      Valor: '0',
      Id_Cuenta_Bancaria: '',
      Detalle: '',
      Tipo: 'Egreso',
      Id_Transferencia_Destino: '',
      Numero_Transferencia: '',
      Ajuste: 'No'
    };
  }

  public AbrirModalAbono() {
    let p = { id_cuenta: this.MovimientoBancoModel.Id_Cuenta_Bancaria, id_funcionario: this._generalService.Funcionario.Identificacion_Funcionario, id_apertura: this.Id_Apertura };
    this.AbrirModalCompra.next(p);
  }

  public ActualizarValorCuentaBancaria() {
  }

  public ActualizarValorRealCuenta(idCuentaBancaria: string) {
    if (idCuentaBancaria == '') {
      this.ValorRealCuenta = 0;
      this.CodigoMonedaValorReal = '';
    } else {
      let p = { id_cuenta: idCuentaBancaria, id_apertura: this.Id_Apertura };
      this.cuentaService.GetValorActualizadoCuenta(p).subscribe((response: any) => {
        this.ValorRealCuenta = parseInt(response.query_data);
        this.CodigoMonedaValorReal = response.codigo_moneda;
      });
    }
  }

  public VerCuentas() {
    this._limpiarSeleccionadasOnNavigate();
    this._router.navigate(['/cuentasconsultor', this.Id_Funcionario]);
  }

  public CierreCuentas() {
    this._limpiarSeleccionadasOnNavigate();
    this._router.navigate(['/cierrecuentasconsultor', this.Id_Funcionario]);
  }

  private _limpiarSeleccionadasOnNavigate() {
    if (this.TransferenciasSeleccionadas.length > 0) {
      let id_transf = this.TransferenciasSeleccionadas[0].Id_Transferencia_Destinatario;
      this.DeseleccionarTransferencia(id_transf);
    }
  }

  public ubicadoEnTransferencia: boolean = false;
  public bloqueadaTransferencia: boolean = false;

  public UbicarseTransferencia(transferencia: any) {
    if (transferencia.Estado == 'Pagada') {
      return false;
    }
    this.http.get(this.globales.rutaNueva + 'ubicarse', { params: transferencia }).subscribe((data: any) => {
    });
  }



  public BloqueadaTransferencia(transferencia: any) {

    if (transferencia.Estado_Consultor == 'Cerrada') {
      transferencia['Funcionario'] = this.Funcionario['Identificacion_Funcionario']
      this.http.get(this.globales.rutaNueva + 'bloquear', { params: transferencia }).subscribe((data: any) => {
      });
    }
  }

  async searchInfo(transferencia: any) {
    return this.http.get(this.globales.rutaNueva + 'info', { params: transferencia }).toPromise().then(async (data: any) => {
      return await data[0];
    });
  }

  alert(t) {
    this.temporal = t;
    this.OtraCosa.show(t);
  }

  suma1(a) {
    let suma = 0;
    a.forEach((element) => {
      suma += parseFloat(element.Valor_Transferencia)
    })
    return suma;
  }
  suma2(a) {
    let suma = 0;
    a.forEach((element) => {
      suma += parseFloat(element.Valor_Real)
    })
    return suma;
  }

  suma3(a) {
    let suma = 0;
    a.forEach((element) => {
      suma += (parseFloat(element.Valor_Transferencia) - parseFloat(element.Valor_Real))
    })
    return suma;
  }


}
