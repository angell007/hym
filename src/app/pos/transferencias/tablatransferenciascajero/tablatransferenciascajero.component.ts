import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { TransferenciaService } from '../../../shared/services/transferencia/transferencia.service';
import { Observable, Subject } from 'rxjs';
import { NormailizerService } from '../../../normailizer.service';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';

@Component({
  selector: 'app-tablatransferenciascajero',
  templateUrl: './tablatransferenciascajero.component.html',
  styleUrls: [ '../../../../style.scss','./tablatransferenciascajero.component.scss'],
  providers: [NormailizerService]
})
export class TablatransferenciascajeroComponent implements OnInit, OnDestroy {

  @Input() ActualizarTabla: Observable<any> = new Observable();
  private _updateSubscription: any;

  @ViewChild('ModalAnularTransferencia') ModalAnularTransferencia: any;

  public AbrirModalDetalleRecibo: Subject<any> = new Subject();
  public RecibosTransferencia: Array<any> = [];
  public Cargando: boolean = false;
  public RutaGifCargando: string;
  public Id_Transferencia_Anular: string = '';
  public MotivoAnulacion: string = '';

  public Filtros: any = {
    remitente: '',
    recibo: '',
    recibido: '',
    transferido: '',
    tasa: '',
    estado: ''
  };


  public pageSize = 10;
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0
  }

  constructor(private _generalService: GeneralService,
    private http: HttpClient,
    public globales: Globales,
    private _swalService: SwalService,
    private _toastService: ToastService,
    private _normalizeService: NormailizerService,
    private _transferenciaService: TransferenciaService) {
    this.RutaGifCargando = _generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
  }

  ngOnInit() {
    this._updateSubscription = this.ActualizarTabla.subscribe(data => {
      this.ConsultaFiltrada();
    });
  }

  ngOnDestroy(): void {
    if (this._updateSubscription != null) {
      this._updateSubscription.unsubscribe();
    }
  }

  GetRecibosTransferencias() {
    this._transferenciaService.getRecibosTransferenciasFuncionario(this._generalService.SessionDataModel.funcionarioData.Identificacion_Funcionario).subscribe(data => {
      if (data.codigo == 'success') {
        this.RecibosTransferencia = data.query_data;
      } else {
        this.RecibosTransferencia = [];
      }
    });
  }

  SetFiltros(paginacion: boolean) {
    let params: any = {};

    // params.tam = this.pageSize;
    params.id_funcionario = this._generalService.SessionDataModel.funcionarioData.Identificacion_Funcionario;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1;
      params.pag = this.page;
    }


    if (this.Filtros.remitente.trim() != "") {
      params.remitente = this.Filtros.remitente;
    }

    if (this.Filtros.recibo.trim() != "") {
      params.recibo = this.Filtros.recibo;
    }

    if (this.Filtros.recibido.trim() != "") {
      params.recibido = this.Filtros.recibido;
    }

    if (this.Filtros.transferido.trim() != "") {
      params.transferido = this.Filtros.transferido;
    }

    if (this.Filtros.tasa.trim() != "") {
      params.tasa = this.Filtros.tasa;
    }

    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
    }

    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {
  console.log('paginacion',paginacion);
  
    var p = this.SetFiltros(paginacion);

    if (p === '') {
      this.ResetValues();
      return;
    }

    this.Cargando = true;
    this._transferenciaService.getRecibosTransferenciasFuncionario2(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.RecibosTransferencia = data.query_data;
        this.TotalItems = data.numReg;
      } else {
        this.RecibosTransferencia = [];
        // this._swalService.ShowMessage(data);
      }

      this.Cargando = false;
      this.SetInformacionPaginacion(data.query_data);
    });
  }

  ResetValues() {
    this.Filtros = {
      remitente: '',
      recibo: '',
      recibido: '',
      transferido: '',
      tasa: '',
      estado: ''
    };
  }

  SetInformacionPaginacion(data: any) {
    // console.log(data);
    this.TotalItems = data.length
    // console.log('', this.TotalItems);
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;
    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }


  AbrirModalAnularTransferencia(idTransferenciaAnular: string) {
    this.Id_Transferencia_Anular = idTransferenciaAnular;
    this.ModalAnularTransferencia.show();
  }

  CerrarModalAnular() {
    this.Id_Transferencia_Anular = '';
    this.MotivoAnulacion = '';
    this.ModalAnularTransferencia.hide();
  }

  AnularTransferencia() {
    let datos = new FormData();

    let info = this._normalizeService.normalize(JSON.stringify(this.MotivoAnulacion));
    // console.log(info);

    datos.append("id_transferencia", this.Id_Transferencia_Anular);
    datos.append("motivo_anulacion", info);

    this._transferenciaService.anularReciboTransferencias(datos)
      .subscribe((data: any) => {
        if (data.codigo == 'success') {
          this.ModalAnularTransferencia.hide();
          this.MotivoAnulacion = '';
          this._swalService.ShowMessage(data);
          this.ConsultaFiltrada();
        } else {

          this._swalService.ShowMessage(data);
        }
      });
  }

  AbrirDetalleRecibo(transferencia: any) {
    this.AbrirModalDetalleRecibo.next(transferencia);
  }

  AlertarRecibo(transferencia: any) {
    let data :any ={Id_Transferencia:transferencia.Id_Transferencia}
    this._transferenciaService.AlertarTransferencia(data).subscribe((data:any)=>{
      if (data.codigo == 'success') {
        this._swalService.ShowMessage(data);
      } else {

        this._swalService.ShowMessage(data);
      }
    })

   
  }

  printReciboTransferencia(id: string) {
    this.http.get(this.globales.rutaNueva + 'print-cambio', { params: { id: id, modulo: 'transferencia' }, responseType: 'blob' }).subscribe((data: any) => {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

  }

}
