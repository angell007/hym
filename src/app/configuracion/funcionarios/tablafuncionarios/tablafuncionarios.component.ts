import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { NuevofuncionarioService } from '../../../shared/services/funcionarios/nuevofuncionario.service';
import { GrupoService } from '../../../shared/services/gruposfuncionarios/grupo.service';
import { DependenciaService } from '../../../shared/services/dependencias/dependencia.service';
import { CargoService } from '../../../shared/services/cargos/cargo.service';
import { PerfilService } from '../../../shared/services/perfiles/perfil.service';

@Component({
  selector: 'app-tablafuncionarios',
  templateUrl: './tablafuncionarios.component.html',
  styleUrls: ['./tablafuncionarios.component.scss', '../../../../style.scss']
})
export class TablafuncionariosComponent implements OnInit {

  public Funcionarios:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public Grupos:Array<any> = [];
  public Dependencias:Array<any> = [];
  public Cargos:Array<any> = [];
  public Perfiles:Array<any> = [];
  
  public Filtros:any = {
    nombre:'',
    identificacion:'',
    grupo:'',
    dependencia:'',
    cargo:'',
    perfil:'',
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
              private _funcionarioService:NuevofuncionarioService,
              private _grupoService:GrupoService,
              private _dependenciaService:DependenciaService,
              private _cargoService:CargoService,
              private _perfilService:PerfilService) 
  {
    this.RutaGifCargando = _generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
    this.GetGrupos();
    this.GetDependencias();
    this.GetCargos();
    this.GetPerfiles();
    this.ConsultaFiltrada();
  }

  ngOnInit() {
  }

  GetGrupos(){
    this._grupoService.getGrupos().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Grupos = data.query_data;
      }else{

        this.Grupos = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetDependencias(){
    this._dependenciaService.getDependencias().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Dependencias = data.query_data;
      }else{

        this.Dependencias = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetCargos(){
    this._cargoService.getCargos().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Cargos = data.query_data;
      }else{

        this.Cargos = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetPerfiles(){
    this._perfilService.getPerfiles().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Perfiles = data.query_data;
      }else{

        this.Perfiles = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
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

    if (this.Filtros.grupo.trim() != "") {
      params.grupo = this.Filtros.grupo;
    }

    if (this.Filtros.dependencia.trim() != "") {
      params.dependencia = this.Filtros.dependencia;
    }

    if (this.Filtros.cargo.trim() != "") {
      params.cargo = this.Filtros.cargo;
    }

    if (this.Filtros.perfil.trim() != "") {
      params.perfil = this.Filtros.perfil;
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
    this._funcionarioService.getListaFuncionarios(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Funcionarios = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.Funcionarios = [];
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
      grupo:'',
      dependencia:'',
      cargo:'',
      perfil:'',
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

  CambiarEstado(idFuncionario:string){
    let datos = new FormData();
    datos.append("id_funcionario", idFuncionario);
    this._funcionarioService.cambiarEstadoFuncionario(datos).subscribe((data:any) => {
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
