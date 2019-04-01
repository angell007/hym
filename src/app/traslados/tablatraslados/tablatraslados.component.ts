import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { TrasladoService } from '../../shared/services/traslados/traslado.service';

@Component({
  selector: 'app-tablatraslados',
  templateUrl: './tablatraslados.component.html',
  styleUrls: ['./tablatraslados.component.scss', '../../../style.scss']
})
export class TablatrasladosComponent implements OnInit {

  public Traslados:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public AbrirModalAgregar:Subject<any> = new Subject<any>();
  
  public Filtros:any = {
    fecha:'',
    codigo:'',
    funcionario:'',
    origen:'',
    destino:'',
    tipo_origen:'',
    tipo_destino:'',
    moneda:'',
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
              private _trasladoService:TrasladoService) 
  {
    this.RutaGifCargando = _generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
  }

  ngOnInit() {
  }

  AbrirModal(idTraslado:string){
    this.AbrirModalAgregar.next(idTraslado);
  }

  SetFiltros(paginacion:boolean) {
    let params:any = {};
    
    params.tam = this.pageSize;

    if(paginacion === true){
      params.pag = this.page;
    }else{        
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.fecha.trim() != "") {
      params.fecha = this.Filtros.fecha;
    }

    if (this.Filtros.codigo.trim() != "") {
      params.codigo = this.Filtros.codigo;
    }

    if (this.Filtros.funcionario.trim() != "") {
      params.funcionario = this.Filtros.funcionario;
    }

    if (this.Filtros.origen.trim() != "") {
      params.origen = this.Filtros.origen;
    }

    if (this.Filtros.destino.trim() != "") {
      params.destino = this.Filtros.destino;
    }

    if (this.Filtros.moneda.trim() != "") {
      params.moneda = this.Filtros.moneda;
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
    this._trasladoService.getListaTraslados(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Traslados = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.Traslados = [];
        this._swalService.ShowMessage(data);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues(){
    this.Filtros = {
      fecha:'',
      codigo:'',
      funcionario:'',
      origen:'',
      destino:'',
      tipo_origen:'',
      tipo_destino:'',
      moneda:'',
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

  CambiarEstadoTraslado(idTraslado:string){
    let datos = new FormData();
    datos.append("id_traslado", idTraslado);
    this._trasladoService.anularTraslado(datos).subscribe((data:any) => {
      if (data.codigo == 'success') { 
        this.ConsultaFiltrada();
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }else{
        this._swalService.ShowMessage(data); 
      }
    });
  }


}
