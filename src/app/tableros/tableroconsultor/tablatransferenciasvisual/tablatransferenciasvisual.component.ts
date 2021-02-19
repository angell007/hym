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
import swal from 'sweetalert2';


@Component({
  selector: 'app-tablatransferenciasvisual',
  templateUrl: './tablatransferenciasvisual.component.html',
  styleUrls: [ '../../../../style.scss','./tablatransferenciasvisual.component.scss'],
})

export class TablatransferenciasvisualComponent implements OnInit, OnChanges, OnDestroy {

  @Input() Id_Funcionario: string = '';
  @Input() Id_Apertura: string = '';
  @Input() CuentasBancariasSeleccionadas: any = [];
  @Input('AbrirCuentas') AbrirCuentas: EventEmitter<any>;
  @ViewChild('OtraCosa') OtraCosa: any;

  @Output() ActualizarIndicadores = new EventEmitter();
  private TransferenciasActualizadas: ISubscription;

  public AbrirModalCompra: Subject<any> = new Subject();
  public BloquearSeleccion: boolean = false;

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
  console.log('constructor');
  
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

          //console.log(value);
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
    })

    if (this.Funcionario.Id_Perfil == 4) {
      this.SubscriptionTimer1 = this.TransferenciasActualizadas = TimerObservable.create(0, 1000)
        .subscribe(() => {
          this.ConsultaFiltradaObservable(false, this.filter);
          this.ActualizarIndicadores.emit()
          // this.ConsultaFiltradaObservable(false, this.filter);
        });
    }

    this.SubscriptionTimer2 = this.TransferenciasActualizadas = TimerObservable.create(0, 15000)
      .subscribe(() => {
        this.ConsultaFiltradaObservable(false, this.filter);
        this.ActualizarIndicadores.emit()
      });
    // console.log(this.Funcionario.Id_Perfil);

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

  public flagHabilitado: boolean = true;


  DesbloquearTransferencia2(infoTranferencia) {

    this.http.get(this.globales.rutaNueva + 'desbloquear', { params: infoTranferencia }).subscribe((data: any) => { });
    this.TransferenciaModel = new TransfereciaViewModel();
    this._limpiarMovimientoBancoModel();

  }

  public habilitarTransferencia() {
    this.http.get(this.globales.rutaNueva + 'desbloquear', { params: this.infoTranferencia }).subscribe((data: any) => { });
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
      params.paginacion = true;
    } else {
      this.page = 1; // Volver a la página 1 al filtrar
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

      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ConsultaFiltradaObservable(paginacion: boolean = false, filter: string = '') {
    if(this.Filtros.estado == 'Pagada'){
      paginacion = true;
    }
    //console.log('paginacion',paginacion);
  
    var p = this.SetFiltros(paginacion, filter);

    if (p === '') {
      this.ResetValues();
      return;
    }

    // this.Cargando = true;
    // this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_consultores.php', { params: p }).subscribe((data: any) => {

    this._transferenciaService.GetTransferenciasConsultorObservableDev(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.TransferenciasListar = data.query_data;
        //console.log(this.TransferenciasListar,'transfers');
        
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
      realiza: '',
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


  public volver(){
    this.AbrirCuentas.emit();
  }
  public ubicadoEnTransferencia: boolean = false;
  public bloqueadaTransferencia: boolean = false;

  // transferencia ubicado 


  // transferencia bloqueada 
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
      suma += ( parseFloat(element.Valor_Transferencia ) -  parseFloat( element.Valor_Real) )
    })
    return suma;
  }


}
