import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { DestinatariogiroService } from '../../../shared/services/destinatariosgiros/destinatariogiro.service';

@Component({
  selector: 'app-tabladestinatariogiro',
  templateUrl: './tabladestinatariogiro.component.html',
  styleUrls: ['./tabladestinatariogiro.component.scss', '../../../../style.scss']
})
export class TabladestinatariogiroComponent implements OnInit {

  public DestinatariosGiros:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public AbrirModalAgregar:Subject<any> = new Subject<any>();
  
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
              private _destinatarioService:DestinatariogiroService) 
  {
    this.RutaGifCargando = _generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
  }

  ngOnInit() {
  }

  AbrirModal(idDestinatario:string){
    this.AbrirModalAgregar.next(idDestinatario);
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
    this._destinatarioService.getListaDestinatarios(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.DestinatariosGiros = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.DestinatariosGiros = [];
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

  CambiarEstadoDestinatarioGiro(idDestinatario:string){
    let datos = new FormData();
    datos.append("id_destinatario", idDestinatario);
    this._destinatarioService.cambiarEstadoDestinatario(datos).subscribe((data:any) => {
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
