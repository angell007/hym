import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NormailizerService } from '../normailizer.service';
import { Globales } from '../shared/globales/globales';
import { GeneralService } from '../shared/services/general/general.service';
import { SwalService } from '../shared/services/swal/swal.service';
import { ToastService } from '../shared/services/toasty/toast.service';
import { TransferenciaService } from '../shared/services/transferencia/transferencia.service';

@Component({
  selector: 'app-tabla-recaudo',
  templateUrl: './tabla-recaudo.component.html',
  styleUrls: ['./tabla-recaudo.component.scss'],
  providers: [NormailizerService]
})
export class TablaRecaudoComponent implements OnInit {

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
    documento: '',
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
    this._transferenciaService.getRecaudosFuncionario(this._generalService.SessionDataModel.funcionarioData.Identificacion_Funcionario).subscribe(data => {
      if (data.codigo == 'success') {
        this.RecibosTransferencia = data.query_data;

        console.log(this.RecibosTransferencia);

      } else {
        this.RecibosTransferencia = [];
      }
    });
  }

  SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.id_funcionario = this._generalService.SessionDataModel.funcionarioData.Identificacion_Funcionario;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1;
      params.pag = this.page;
    }

    if (this.Filtros.documento.trim() != "") {
      params.documento = this.Filtros.documento;
    }

    if (this.Filtros.remitente.trim() != "") {
      params.remitente = this.Filtros.remitente;
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
    this._transferenciaService.getRecaudosFuncionario2(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.RecibosTransferencia = data.query_data;
        this.TotalItems = data.numReg;
      } else {
        this.RecibosTransferencia = [];
      }

      this.Cargando = false;
      this.SetInformacionPaginacion(data.query_data);
    });
  }

  ResetValues() {
    this.Filtros = {
      remitente: '',
      documento: '',
    };
  }

  SetInformacionPaginacion(data: any) {
    this.TotalItems = data.length
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



  AlertarRecibo(transferencia: any) {
    let data: any = { Id_Transferencia: transferencia.Id_Transferencia }
    this._transferenciaService.AlertarTransferencia(data).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this._swalService.ShowMessage(data);
      } else {

        this._swalService.ShowMessage(data);
      }
    })


  }

  show(id: string) {
    this.AbrirModalDetalleRecibo.next(id);
    console.log(id);
  }

  delete(id: string) {
  }
}
