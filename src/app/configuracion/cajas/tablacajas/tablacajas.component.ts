import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { CajaService } from '../../../shared/services/caja/caja.service';
import { OficinaService } from '../../../shared/services/oficinas/oficina.service';

@Component({
  selector: 'app-tablacajas',
  templateUrl: './tablacajas.component.html',
  styleUrls: ['./tablacajas.component.scss', '../../../../style.scss']
})
export class TablacajasComponent implements OnInit {

  public Cajas:Array<any> = [];
  public Oficinas:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public AbrirModalAgregar:Subject<any> = new Subject<any>();
  
  public Filtros:any = {
    nombre:'',
    oficina:'',
    detalle:'',
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
              private _cajaService:CajaService,
              private _oficinaService:OficinaService) 
  {
    this.RutaGifCargando = _generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
    this.GetOficinas();
  }

  ngOnInit() {
  }

  GetOficinas(){
    this._oficinaService.getOficinas().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Oficinas = data.query_data;
      }else{

        this.Oficinas = [];
        this._swalService.ShowMessage(['warning', 'Alerta', 'No se has podido encontrar Cajas']);


        // let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        // this._toastService.ShowToast(toastObj);

      }
    });
  }

  AbrirModal(idCaja:string){
    this.AbrirModalAgregar.next(idCaja);
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

    if (this.Filtros.oficina.trim() != "") {
      params.oficina = this.Filtros.oficina;
    }

    if (this.Filtros.detalle.trim() != "") {
      params.detalle = this.Filtros.detalle;
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
    this._cajaService.getListaCajas(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Cajas = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.Cajas = [];
        this._swalService.ShowMessage(data);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues(){
    this.Filtros = {
      nombre:'',
      oficina:'',
      detalle:'',
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

  CambiarEstadoCaja(idCaja:string){
    let datos = new FormData();
    datos.append("id_caja", idCaja);
    this._cajaService.cambiarEstadoCaja(datos).subscribe((data:any) => {
      if (data.codigo == 'success') { 
        this.ConsultaFiltrada();
        this._swalService.ShowMessage(['success', 'Exito', 'Operacion realizada correctamente']);
        // let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        // this._toastService.ShowToast(toastObj);
      }else{
        this._swalService.ShowMessage(data); 
      }
    });
  }

}
