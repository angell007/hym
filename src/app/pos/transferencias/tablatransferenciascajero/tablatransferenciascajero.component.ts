import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { TransferenciaService } from '../../../shared/services/transferencia/transferencia.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-tablatransferenciascajero',
  templateUrl: './tablatransferenciascajero.component.html',
  styleUrls: ['./tablatransferenciascajero.component.scss', '../../../../style.scss']
})
export class TablatransferenciascajeroComponent implements OnInit {

  @Input() ActualizarTabla:Observable<any> = new Observable();
  private _updateSubscription:any;

  @ViewChild('ModalAnularTransferencia') ModalAnularTransferencia:any;

  public AbrirModalDetalleRecibo:Subject<any> = new Subject();
  public RecibosTransferencia:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  public Id_Transferencia_Anular:string = '';
  public MotivoAnulacion:string = '';
  
  public Filtros:any = {
    remitente:'',
    recibo:'',
    recibido:'',
    transferido:'',
    tasa:'',
    estado:''
  };

  //Paginación
  public maxSize = 5;
  public pageSize = 10;
  public TotalItems:number;
  public page = 1; 
  public InformacionPaginacion:any = {
    desde: 0,
    hasta: 0,
    total: 0
  }

  constructor(private _generalService: GeneralService,
              private _swalService:SwalService,
              private _toastService:ToastService,
              private _transferenciaService:TransferenciaService) 
  {
  this.RutaGifCargando = _generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
  this.ConsultaFiltrada();
  }

  ngOnInit() {
    this._updateSubscription = this.ActualizarTabla.subscribe(data => {
      this.ConsultaFiltrada();
    });
  }

  GetRecibosTransferencias(){
    this._transferenciaService.getRecibosTransferenciasFuncionario(this._generalService.SessionDataModel.funcionarioData.Identificacion_Funcionario).subscribe(data => {
      if (data.codigo == 'success') {
        this.RecibosTransferencia = data.query_data;
      }else{
        this.RecibosTransferencia = [];
      }
    });
  }

  SetFiltros(paginacion:boolean) {
    let params:any = {};
    
    params.tam = this.pageSize;
    params.id_funcionario = this._generalService.SessionDataModel.funcionarioData.Identificacion_Funcionario;

    if(paginacion === true){
      params.pag = this.page;
    }else{        
      this.page = 1; // Volver a la página 1 al filtrar
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

  ConsultaFiltrada(paginacion:boolean = false) {

    var p = this.SetFiltros(paginacion);    

    if(p === ''){
      this.ResetValues();
      return;
    }
    
    this.Cargando = true;
    this._transferenciaService.getRecibosTransferenciasFuncionario2(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.RecibosTransferencia = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.RecibosTransferencia = [];
        this._swalService.ShowMessage(data);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues(){
    this.Filtros = {
      remitente:'',
      recibo:'',
      recibido:'',
      transferido:'',
      tasa:'',
      estado:''
    };
  }

  SetInformacionPaginacion(){
    var calculoHasta = (this.page*this.pageSize);
    var desde = calculoHasta-this.pageSize+1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

  AbrirModalAnularTransferencia(idTransferenciaAnular:string){
    this.Id_Transferencia_Anular = idTransferenciaAnular;
    this.ModalAnularTransferencia.show();
  }

  CerrarModalAnular(){
    this.Id_Transferencia_Anular = '';
    this.MotivoAnulacion = '';
    this.ModalAnularTransferencia.hide();
  }

  AnularTransferencia() {
    let datos = new FormData();
    datos.append("id_transferencia", this.Id_Transferencia_Anular);
    datos.append("motivo_anulacion", this.MotivoAnulacion);
    this._transferenciaService.anularReciboTransferencias(datos)
    .subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.ModalAnularTransferencia.hide();
        this.MotivoAnulacion = '';
        this._swalService.ShowMessage(data);
        this.ConsultaFiltrada();
      }else{

        this._swalService.ShowMessage(data);
      }
    });
  }

  AbrirDetalleRecibo(transferencia:any){
    this.AbrirModalDetalleRecibo.next(transferencia);
  }

}
