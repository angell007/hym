import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { CajarecaudoService } from '../../../shared/services/cajarecaudos/cajarecaudo.service';
import { MunicipioService } from '../../../shared/services/municipio/municipio.service';
import { DepartamentoService } from '../../../shared/services/departamento/departamento.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';

@Component({
  selector: 'app-tablacajarecaudos',
  templateUrl: './tablacajarecaudos.component.html',
  styleUrls: ['./tablacajarecaudos.component.scss', '../../../../style.scss']
})
export class TablacajarecaudosComponent implements OnInit {

  public CajasRecaudos:Array<any> = [];
  public Departamentos:Array<any> = [];
  public Municipios:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public AbrirModalCajaRecaudo:Subject<any> = new Subject<any>();
  
  public Filtros:any = {
    departamento: '',
    nombre:'',
    municipio:'',
    estado:'',
    departamento_municipio:''
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
              private _cajaRecaudoService:CajarecaudoService,
              private _municipioService:MunicipioService,
              private _departamentoService:DepartamentoService) 
  {
    this.RutaGifCargando = generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
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
        this.swalService.ShowMessage(data);
      }
    });
  }

  GetMunicipiosDepartamento(){
    if (this.Filtros.departamento_municipio == '') {
      this.Filtros.municipio = '';
      this.ConsultaFiltrada();
    }else{

      let p = {id_departamento:this.Filtros.departamento_municipio};
      this._municipioService.getMunicipiosDepartamento(p).subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.Municipios = data.query_data;
        }else{
          this.Municipios = [];
          this.swalService.ShowMessage(data);
        }
      });
    }    
  }

  AbrirModal(idCajaRecaudo:string){
    this.AbrirModalCajaRecaudo.next(idCajaRecaudo);
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

    if (this.Filtros.departamento.trim() != "") {
      params.departamento = this.Filtros.departamento;
    }

    if (this.Filtros.nombre.trim() != "") {
      params.nombre = this.Filtros.nombre;
    }

    if (this.Filtros.municipio.trim() != "") {
      params.municipio = this.Filtros.municipio;
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
    this._cajaRecaudoService.getListaCajaRecaudos(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.CajasRecaudos = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.CajasRecaudos = [];
        this.swalService.ShowMessage(data);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues(){
    this.Filtros = {
      departamento: '',
      nombre:'',
      municipio:'',
      estado:'',
      departamento_municipio:''
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

  CambiarEstadoCajaRecaudo(idCajaRecaudo:string){
    let datos = new FormData();
    datos.append("id_caja_recaudo", idCajaRecaudo);
    this._cajaRecaudoService.cambiarEstadoCajaRecaudo(datos).subscribe((data:any) => {
      if (data.codigo == 'success') { 
        this.ConsultaFiltrada();
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastyService.ShowToast(toastObj);
      }else{
        this.swalService.ShowMessage(data); 
      }
    });
  }

}
