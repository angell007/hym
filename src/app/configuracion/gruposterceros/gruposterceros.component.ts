import { Component, OnInit, ViewChild } from '@angular/core';
import { GrupoTerceroModel } from '../../Modelos/GrupoTerceroModel';
import { GrupoterceroService } from '../../shared/services/grupotercero.service';
import { Funcionario } from '../../shared/funcionario/funcionario.model';

@Component({
  selector: 'app-gruposterceros',
  templateUrl: './gruposterceros.component.html',
  styleUrls: ['./gruposterceros.component.scss']
})
export class GrupostercerosComponent implements OnInit {

  @ViewChild('ModalGrupo') ModalGrupo:any;
  @ViewChild('alertSwal') alertSwal:any;

  public Funcionario:any = JSON.parse(localStorage['User']);
  public Grupos:Array<any> = [];
  public GruposPadre:Array<any> = [];
  public Edicion:boolean = false;
  public TextoInactivo:string = 'Inactivar';
  public TextoActivo:string = 'Activar';
  public Cargando:boolean = false;

  public Filtros:any = {
    nombre:'',
    padre:'',
    estado:'',
    fecha:''
  };

  //Paginación
  public maxSize = 5;
  public pageSize = 10;
  public TotalItems:number = 0;
  public page = 1;
  public InformacionPaginacion:any = {
    desde: 0,
    hasta: 0,
    total: 0
  }

  public GrupoTerceroModel:GrupoTerceroModel = new GrupoTerceroModel();

  constructor(private grupoTerceroService:GrupoterceroService) {    
    this.GrupoTerceroModel.Id_Funcionario = this.Funcionario.Identificacion_Funcionario;
    this.ConsultaFiltrada();
   }

  ngOnInit() {
  }

  /*GetGrupos():void{
    this.grupoTerceroService.getGruposTercero().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Grupos = data.query_data;  
      }else{
        this.Grupos = [];  
      }      
    });
  }*/

  EditarGrupo(idGrupo:string):void{
    this.grupoTerceroService.getGrupoTercero(idGrupo).subscribe((data:any) => {
      if (data.codigo == 'success') {
        
        this.AsignarDatosModelo(data.query_data);
        this.AbrirModalGrupo(true);
        
      }else{
        this.LimpiarModeloGrupo();
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      }      
    });
  }

  GetGruposPadre():void{
    this.grupoTerceroService.getGruposPadre().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.GruposPadre = data.query_data;

      }else{
        this.GruposPadre = [];
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      }      
    });
  }

  GetGruposPadreEdicion(idGrupo:string):void{
    this.grupoTerceroService.getGruposPadreEditar(idGrupo).subscribe((data:any) => {
      
      if (data.codigo == 'success') {
        this.GruposPadre = data.query_data;

      }else{
        this.GruposPadre = [];
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      }      
    });
  }

  GuardarGrupo(){
    
    let data = new FormData();
    let info = JSON.stringify(this.GrupoTerceroModel);
    data.append("modelo", info);

    let request = !this.Edicion ? this.grupoTerceroService.saveGrupoTercero(data) : this.grupoTerceroService.editGrupoTercero(data);

    request.subscribe((data:any) => {

      if (data.codigo == 'success') {
        this.CerrarModalGrupo();
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        this.ConsultaFiltrada();  
      }else{

        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      }
      
    });
  }

  SetNivelGrupo(){
    if (this.GrupoTerceroModel.Id_Grupo_Padre == '') {
      this.GrupoTerceroModel.Nivel = '1';
    }else{

      let padreObj = this.GruposPadre.find(x => x.Id_Grupo_Tercero == this.GrupoTerceroModel.Id_Grupo_Padre);
      let nivel = parseInt(padreObj.Nivel) + 1;
      this.GrupoTerceroModel.Nivel = nivel.toString();
    }    
  }

  CambiarEstadoGrupo(idGrupo:string):void{
    let data = new FormData();
    data.append("id_grupo", idGrupo);
    this.grupoTerceroService.cambiarEstadoGrupoTercero(data).subscribe((data:any) => {

      if (data.codigo == 'success') {

        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
        setTimeout(() => {
          this.ConsultaFiltrada();    
        }, 500);        
      }else{

        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      }
    });
  }

  CerrarModalGrupo(){
    this.LimpiarModeloGrupo();
    this.GruposPadre = [];
    this.ModalGrupo.hide();
  }

  AsignarDatosModelo(modelData:any):void{
    this.GrupoTerceroModel.Id_Grupo_Tercero = modelData.Id_Grupo_Tercero;
    this.GrupoTerceroModel.Nombre_Grupo = modelData.Nombre_Grupo;
    this.GrupoTerceroModel.Id_Grupo_Padre = modelData.Id_Grupo_Padre;
    this.GrupoTerceroModel.Id_Funcionario = modelData.Id_Funcionario;
    this.GrupoTerceroModel.Nivel = modelData.Nivel;
  }

  LimpiarModeloGrupo(){
    this.GrupoTerceroModel = new GrupoTerceroModel();
    this.GrupoTerceroModel.Id_Funcionario = this.Funcionario.Identificacion_Funcionario;
  }

  AbrirModalGrupo(edicion:boolean = false){
    this.Edicion = edicion;

    if (edicion) {
      this.GetGruposPadreEdicion(this.GrupoTerceroModel.Id_Grupo_Tercero);
    }else{
      this.GetGruposPadre();
    }
    
    this.ModalGrupo.show();
  }

  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  SetFiltros(paginacion) {
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
    if (this.Filtros.padre.trim() != "") {
      params.padre = this.Filtros.padre;
    }
    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
    }
    if (this.Filtros.fecha.trim() != "") {
      params.fecha = this.Filtros.fecha;
    }  

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    
    return queryString;
  }

  ConsultaFiltrada(paginacion:boolean = false) {

    var params = this.SetFiltros(paginacion);

    if(params === ''){
      this.ResetValues();
      this.Cargando = false;
      return;
    }
    
    this.Cargando = true;
    this.grupoTerceroService.getGruposTercero(params).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Grupos = data.query_data;  
        this.TotalItems = data.numReg;
      }else{
        this.Grupos = []; 
      }
      
      this.SetInformacionPaginacion();
      this.Cargando = false;
    });
  }

  ResetValues(){
    
    this.Filtros = {
      nombre:'',
      padre:'',
      estado:'',
      fecha:''
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
