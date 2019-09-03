import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { OficinaService } from '../../../shared/services/oficinas/oficina.service';
import { DepartamentoService } from '../../../shared/services/departamento/departamento.service';
import { MunicipioService } from '../../../shared/services/municipio/municipio.service';

@Component({
  selector: 'app-tablaoficinas',
  templateUrl: './tablaoficinas.component.html',
  styleUrls: ['./tablaoficinas.component.scss', '../../../../style.scss']
})
export class TablaoficinasComponent implements OnInit {

  public Oficinas:Array<any> = [];
  public Departamentos:Array<any> = [];
  public Municipios:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public AbrirModalAgregar:Subject<any> = new Subject<any>();
  
  public Filtros:any = {
    nombre:'',
    municipio:'',
    departamento:'',
    departamento_municipio:'',
    limite_transf:'',
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
              private _oficinaService:OficinaService,
              private _departamentoService:DepartamentoService,
              private _municipioService:MunicipioService) 
  {
    this.RutaGifCargando = _generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
    this.GetDepartamentos();
  }

  ngOnInit() {
  }

  GetDepartamentos(){
    this._departamentoService.getDepartamentos().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Departamentos = data.query_data;
      }else{

        this.Departamentos = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetMunicipiosDepartamento(){
    if (this.Filtros.departamento_municipio == '') {
      this.Filtros.municipio = '';
      this.Municipios = [];
      this.ConsultaFiltrada();
    }else{

      let p = {id_departamento:this.Filtros.departamento_municipio};
      this._municipioService.getMunicipiosDepartamento(p).subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.Municipios = data.query_data;
        }else{

          this.Municipios = [];
          let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj);
        }
      });
    }    
  }

  AbrirModal(idOficina:string){
    this.AbrirModalAgregar.next(idOficina);
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

    if (this.Filtros.departamento.trim() != "") {
      params.departamento = this.Filtros.departamento;
    }

    if (this.Filtros.municipio.trim() != "") {
      params.municipio = this.Filtros.municipio;
    }

    if (this.Filtros.limite_transf.trim() != "") {
      params.limite_transf = this.Filtros.limite_transf;
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
    this._oficinaService.getListaOficinas(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Oficinas = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.Oficinas = [];
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

  CambiarEstadoOficina(idOficina:string){
    let datos = new FormData();
    datos.append("id_oficina", idOficina);
    this._oficinaService.cambiarEstadoOficina(datos).subscribe((data:any) => {
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
