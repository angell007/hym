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
// import { TransferenciasconsultorService } from '../../../customservices/transferenciasconsultor.service';
import { providers } from 'ng2-toasty';
import { TesCustomServiceService } from '../../../tes-custom-service.service';

@Component({
  selector: 'app-tablatransferencias',
  templateUrl: './tablatransferencias.component.html',
  styleUrls: ['./tablatransferencias.component.scss', '../../../../style.scss'],
})

export class TablatransferenciasComponent implements OnInit, OnChanges, OnDestroy {

  // @Input() MonedaConsulta:string = '';
  //@Input() CuentaConsultor:string = '';
  @Input() Id_Funcionario: string = '';
  @Input() Id_Apertura: string = '';
  @Input() CuentasBancariasSeleccionadas: any = [];

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
    this._getMaximaHoraTransferencias();
  }

  ngOnChanges(changes: SimpleChanges) {
  }


  ngOnInit() {

    this.sub = this._TesCustomServiceService.subjec.subscribe((data: string) => {
      this.filter = data
    })

    if (this.Funcionario.Id_Perfil == 4) {
      this.SubscriptionTimer1 = this.TransferenciasActualizadas = TimerObservable.create(0, 15000)
        .subscribe(() => {
          this.ConsultaFiltradaObservable(false, this.filter);
          this.ActualizarIndicadores.emit()
          this.ConsultaFiltradaObservable(false, this.filter);
        });
    }

    this.SubscriptionTimer2 = this.TransferenciasActualizadas = TimerObservable.create(0, 15000)
      .subscribe(() => {
        // this.ConsultaFiltradaObservable(false, this.filter);
        // this.ActualizarIndicadores.emit()
      });
    console.log(this.Funcionario.Id_Perfil);

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
    if (this.TransferenciasActualizadas != null) {
      this.TransferenciasActualizadas.unsubscribe();
    }
    this.SubscriptionTimer1.unsubscribe();
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

  BloquearTransferencia(modelo: any) {
    this.AsginarValoresModalCrear(modelo);
    this.ModalTransferencia.show();
  }

  DesbloquearTransferencia() {
    this.TransferenciaModel = new TransfereciaViewModel();
    this._limpiarMovimientoBancoModel();
    this.ModalTransferencia.hide();
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
      // console.log(response);
    });
  }

  GuardarTransferencia(modal) {
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

        this.ShowSwal('success', 'Registro Exitoso', 'Se ha realizado la transferencia exitosamente!');
        this.ValorRealCuenta = 0;
        modal.hide();
        this.DeseleccionarTransferencia(this.MovimientoBancoModel.Id_Transferencia_Destino);
        this.ActualizarIndicadores.emit(null);
        this._limpiarMovimientoBancoModel();
        // this.ConsultaFiltrada();
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
    // Remove or comment this line if you dont want 
    // to show the formatted amount in the textbox.
    //element.target.value = this.formattedAmount;
  }

  AsginarValoresModalCrear(modelo: any) {
    //let t = this.TransferenciasListar.filter(x => x.Id_Transferencia_Destinatario == id_transferencia);
    this.TransferenciaModel = modelo;

    this.MovimientoBancoModel.Valor = modelo.Valor_Real;

    this.custom = modelo.Valor_Real;

    this.MovimientoBancoModel.Id_Transferencia_Destino = modelo.Id_Transferencia_Destinatario;
    //this.MovimientoBancoModel.Id_Cuenta_Bancaria = this.CuentaConsultor;
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
    //params.id_moneda = this.MonedaConsulta;
    params.id_funcionario = this.Id_Funcionario;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
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

      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ConsultaFiltradaObservable(paginacion: boolean = false, filter: string = '') {

    var p = this.SetFiltros(paginacion, filter);

    if (p === '') {
      this.ResetValues();
      return;
    }

    // this.Cargando = true;
    // this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_consultores.php', { params: p }).subscribe((data: any) => {

    this._transferenciaService.GetTransferenciasConsultorObservable(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.TransferenciasListar = data.query_data;

        console.log(data.query_data);

        this.TotalItems = data.numReg;
      } else {
        this.TransferenciasListar = [];
        // let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 5000 };
        this.ShowSwal('info', data.titulo, data.mensaje);
        // this._toastService.ShowToast(toastObj);
      }

      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
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
    // console.log("actualizando el valor real de la cuenta bancaria!");

  }

  public ActualizarValorRealCuenta(idCuentaBancaria: string) {
    if (idCuentaBancaria == '') {
      this.ValorRealCuenta = 0;
      this.CodigoMonedaValorReal = '';
    } else {
      let p = { id_cuenta: idCuentaBancaria, id_apertura: this.Id_Apertura };
      this.cuentaService.GetValorActualizadoCuenta(p).subscribe((response: any) => {
        // console.log(response);
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
}
