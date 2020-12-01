import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { RemitenteService } from '../../../shared/services/remitentes/remitente.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tablaremitente',
  templateUrl: './tablaremitente.component.html',
  styleUrls: ['./tablaremitente.component.scss', '../../../../style.scss']
})
export class TablaremitenteComponent implements OnInit {

  public Remitentes:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public AbrirModalRemitente:Subject<any> = new Subject<any>();
  
  public Filtros:any = {
    nombre:'',
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

  constructor(private generalService: GeneralService,
              private swalService:SwalService,
              private _toastyService:ToastService,
              private _remitenteService:RemitenteService) 
  {
    this.RutaGifCargando = generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
  }

  ngOnInit() {
  }

  AbrirModal(idRemitente:string, accion:string){
    
    let modalObj = {id_remitente:idRemitente, accion:accion};
    this.AbrirModalRemitente.next(modalObj);
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
    this._remitenteService.getListaRemitentes(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Remitentes = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.Remitentes = [];
        this.swalService.ShowMessage(data);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues(){
    this.Filtros = {
      nombre:'',
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

  CambiarEstadoRemitente(idRemitente:string){
    let datos = new FormData();
    datos.append("id_remitente", idRemitente);
    this._remitenteService.cambiarEstadoRemitente(datos).subscribe((data:any) => {
      if (data.codigo == 'success') { 
        this.ConsultaFiltrada();

        this.swalService.ShowMessage(['success', 'Exito', 'Operacion realizada correctamente!']);
        
        // let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        // this._toastyService.ShowToast(toastObj);
      }else{
        this.swalService.ShowMessage(data); 
      }
    });
  }

}
