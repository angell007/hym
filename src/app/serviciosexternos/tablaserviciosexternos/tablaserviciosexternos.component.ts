import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ServiciosexternosService } from '../../shared/services/serviciosexternos/serviciosexternos.service';

@Component({
  selector: 'app-tablaserviciosexternos',
  templateUrl: './tablaserviciosexternos.component.html',
  styleUrls: ['./tablaserviciosexternos.component.scss', '../../../style.scss']
})
export class TablaserviciosexternosComponent implements OnInit {
  public Servicios:Array<any> = [];
  public Paises:any = [];
  public Monedas:any = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public AbrirModalCrear:Subject<any> = new Subject<any>();
  
  public Filtros:any = {
    nombre: '',
    comision:'',
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
              private servicioService:ServiciosexternosService) 
  {
    this.RutaGifCargando = generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
    
  }

  ngOnInit() {
  }  

  AbrirModal(idServicio:string){
    this.AbrirModalCrear.next(idServicio);
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

    if (this.Filtros.comision.trim() != "") {
      params.comision = this.Filtros.comision;
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
    this.servicioService.getServicios(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Servicios = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.Servicios = [];
        this.swalService.ShowMessage(data);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues(){
    this.Filtros = {
      nombre: '',
      comision:'',
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

  CambiarEstadoServicio(idServicio:string){
    let datos = new FormData();
    datos.append("id_servicio_externo", idServicio);
    this.servicioService.cambiarEstadoServicio(datos).subscribe((data:any) => {
      if (data.codigo == 'success') { 
        this.ConsultaFiltrada();
      }
      
      this.swalService.ShowMessage(data);
    });
  }

}
