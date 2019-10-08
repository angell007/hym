import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { CorresponsalbancarioService } from '../../../shared/services/corresponsalesbancarios/corresponsalbancario.service';

@Component({
  selector: 'app-tablaregistroscorresponsalesdiarios',
  templateUrl: './tablaregistroscorresponsalesdiarios.component.html',
  styleUrls: ['./tablaregistroscorresponsalesdiarios.component.scss', '../../../../style.scss']
})
export class TablaregistroscorresponsalesdiariosComponent implements OnInit, OnDestroy {

  @Input() ActualizarTabla:Observable<any> = new Observable();
  private _updateTablaSubscription:any;

  public RegistrosCorresponsales:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
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
              private _corresponsalService:CorresponsalbancarioService) 
  {
    this.RutaGifCargando = _generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
  }

  ngOnInit() {
    this._updateTablaSubscription = this.ActualizarTabla.subscribe(data => {
      this.ConsultaFiltrada();
    });
  }
  
  ngOnDestroy(): void {
    if (this._updateTablaSubscription != null) {
      this._updateTablaSubscription.unsubscribe();
    }
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

    // if (this.Filtros.remitente.trim() != "") {
    //   params.remitente = this.Filtros.remitente;
    // }

    // if (this.Filtros.recibo.trim() != "") {
    //   params.recibo = this.Filtros.recibo;
    // }

    // if (this.Filtros.recibido.trim() != "") {
    //   params.recibido = this.Filtros.recibido;
    // }

    // if (this.Filtros.transferido.trim() != "") {
    //   params.transferido = this.Filtros.transferido;
    // }

    // if (this.Filtros.tasa.trim() != "") {
    //   params.tasa = this.Filtros.tasa;
    // }

    // if (this.Filtros.estado.trim() != "") {
    //   params.estado = this.Filtros.estado;
    // }

    return params;
  }

  ConsultaFiltrada(paginacion:boolean = false) {

    var p = this.SetFiltros(paginacion);    

    if(p === ''){
      this.ResetValues();
      return;
    }
    
    this.Cargando = true;
    this._corresponsalService.GetRegistrosDiarios(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.RegistrosCorresponsales = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.RegistrosCorresponsales = [];
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
}
