import { Component, OnInit, Input } from '@angular/core';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { TransferenciaService } from '../../../shared/services/transferencia/transferencia.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tablatransferenciascajero',
  templateUrl: './tablatransferenciascajero.component.html',
  styleUrls: ['./tablatransferenciascajero.component.scss', '../../../../style.scss']
})
export class TablatransferenciascajeroComponent implements OnInit {

  @Input() ActualizarTabla:Observable<any> = new Observable();
  private _updateSubscription:any;

  public RecibosTransferencia:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public Filtros:any = {
    nombre:'',
    documento:'',
    telefono:'',
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
    this._transferenciaService.getRecibosTransferenciasFuncionario(this._generalService.Funcionario.Identificacion_Funcionario).subscribe(data => {
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
    params.id_funcionario = this._generalService.Funcionario.Identificacion_Funcionario;

    if(paginacion === true){
      params.pag = this.page;
    }else{        
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.nombre.trim() != "") {
      params.nombre = this.Filtros.nombre;
    }

    if (this.Filtros.documento.trim() != "") {
      params.documento = this.Filtros.documento;
    }

    if (this.Filtros.telefono.trim() != "") {
      params.telefono = this.Filtros.telefono;
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
      nombre:'',
      documento:'',
      telefono:'',
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
