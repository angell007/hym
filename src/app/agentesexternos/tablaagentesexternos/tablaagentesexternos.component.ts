import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { AgenteexternoService } from '../../shared/services/agentesexternos/agenteexterno.service';

@Component({
  selector: 'app-tablaagentesexternos',
  templateUrl: './tablaagentesexternos.component.html',
  styleUrls: ['./tablaagentesexternos.component.scss', '../../../style.scss']
})
export class TablaagentesexternosComponent implements OnInit {

  public AgentesExternos:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public AbrirModalAgregar:Subject<any> = new Subject<any>();
  
  public Filtros:any = {
    nombre:'',
    identificacion:'',
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
              private _agenteExternoService:AgenteexternoService) 
  {
    this.RutaGifCargando = _generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
  }

  ngOnInit() {
  }

  AbrirModal(idAgenteExterno:string){
    this.AbrirModalAgregar.next(idAgenteExterno);
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

    if (this.Filtros.nombre.trim() != "") {
      params.nombre = this.Filtros.nombre;
    }

    if (this.Filtros.identificacion.trim() != "") {
      params.identificacion = this.Filtros.identificacion;
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
    this._agenteExternoService.getListaAgenteExternos(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.AgentesExternos = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.AgentesExternos = [];
        this._swalService.ShowMessage(data);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues(){
    this.Filtros = {
      nombre:'',
      identificacion:'',
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

  CambiarEstadoAgenteExterno(idAgenteExterno:string){
    let datos = new FormData();
    datos.append("id_agente", idAgenteExterno);
    this._agenteExternoService.cambiarEstadoAgenteExterno(datos).subscribe((data:any) => {
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
