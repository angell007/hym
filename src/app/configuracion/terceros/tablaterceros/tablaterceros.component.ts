import { Component, OnInit, ViewChild } from '@angular/core';
import { TerceroModel } from '../../../Modelos/TerceroModel';
import { TerceroService } from '../../../shared/services/tercero/tercero.service';
import { DepartamentoService } from '../../../shared/services/departamento/departamento.service';
import { MunicipioService } from '../../../shared/services/municipio/municipio.service';
import { DocumentoService } from '../../../shared/services/documento/documento.service';
import { GrupoterceroService } from '../../../shared/services/grupotercero.service';
import { GeneralService } from '../../../shared/services/general/general.service';

@Component({
  selector: 'app-tablaterceros',
  templateUrl: './tablaterceros.component.html',
  styleUrls: ['./tablaterceros.component.scss']
})
export class TablatercerosComponent implements OnInit {
  
  @ViewChild('alertSwal') alertSwal:any;
  @ViewChild('ModalTercero') ModalTercero:any;

  public Terceros:Array<any> = [];
  public Departamentos:Array<any> = [];
  public Municipios:Array<any> = [];
  public MunicipiosList:Array<any> = [];
  public TiposDocumento:Array<any> = [];
  public Grupos:Array<any> = [];
  public Funcionario:any = JSON.parse(localStorage['User']);
  public Edicion:boolean = false;
  public TextoInactivo:string = 'Inactivar';
  public TextoActivo:string = 'Activar';
  public Cargando:boolean = false;

  public Filtros:any = {
    id:'',
    nombre:'',
    departamento:'',
    municipio:'',
    tipo:''
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

  public TerceroModel:TerceroModel = new TerceroModel();

  constructor(private terceroService:TerceroService,
              private departamentoService:DepartamentoService,
              private municipioService:MunicipioService,
              private documentoService:DocumentoService,
              private gTerceroService:GrupoterceroService,
              private generalService:GeneralService) { 

    this.ConsultaFiltrada();
    this.GetDepartamentos();
    this.GetGrupos();
    this.GetDocumentos();
  }

  ngOnInit() {
  }

  GetDepartamentos():void{
    this.departamentoService.getDepartamentos().subscribe((data:any) => {
      if (data.codigo == 'success') {
        
        this.Departamentos = data.query_data;
        
      }else{
        this.Departamentos = [];
      }  
    });
  }

  GetMunicipiosDepartamento(idDepartamento:string):void{

    if (idDepartamento == '') {
      this.Filtros.municipio = '';
      this.Municipios = [];
      this.ConsultaFiltrada();
      return;
    }
    
    this.municipioService.getMunicipiosDepartamento(idDepartamento).subscribe((data:any) => {
      if (data.codigo == 'success') {
        
        this.Municipios = data.query_data;        
      }else{

        this.Municipios = [];
      }  
    });
  }

  GetMunicipiosList(idDepartamento:string):void{
    
    if (idDepartamento == '') {
      this.MunicipiosList = [];
      return;
    }
    
    this.municipioService.getMunicipiosDepartamento(idDepartamento).subscribe((data:any) => {
      if (data.codigo == 'success') {
        
        this.MunicipiosList = data.query_data;        
      }else{

        this.MunicipiosList = [];
      }  
    });
  }

  GetDocumentos():void{
    this.documentoService.getTiposDocumentos().subscribe((data:any) => {
      if (data.codigo == 'success') {
        
        this.TiposDocumento = data.query_data;
        
      }else{
        this.TiposDocumento = [];
      }  
    });
  }

  GetGrupos():void{
    this.gTerceroService.getGrupos().subscribe((data:any) => {
      if (data.codigo == 'success') {
        
        this.Grupos = data.query_data;
        
      }else{
        this.Grupos = [];
      }  
    });
  }

  NuevoTercero(){
    this.Edicion = false; 
    this.ModalTercero.show();
  }

  EditarTercero(idTercero:string){
    this.Edicion = true;
    this.terceroService.getTercero(idTercero).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.TerceroModel = data.query_data;
        this.GetMunicipiosList(this.TerceroModel.Id_Departamento);
        this.ModalTercero.show();
      }else{

        this.LimpiarModeloTercero();
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      }
    });
  }

  CerrarModalTercero(){
    this.LimpiarModeloTercero();
    this.ModalTercero.hide();
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

    if (this.Filtros.id.trim() != "") {
      params.id = this.Filtros.id;
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
    if (this.Filtros.tipo.trim() != "") {
      params.tipo = this.Filtros.tipo;
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
    this.terceroService.getTerceros(params).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Terceros = data.query_data;  
        this.TotalItems = data.numReg;
      }else{
        this.Terceros = []; 
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

  VaciarCupo(){
    if (this.TerceroModel.Credito == 'No') {
      this.TerceroModel.Cupo = '0';  
    }
  }

  VerificarIdentificacion(){
    let id = this.TerceroModel.Id_Tercero;
    this.generalService.checkIdentificacion(id).subscribe((data:any) => {
      if (data.codigo != 'success') {
        this.TerceroModel.Id_Tercero = '';
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      }
    });
  }

  GuardarTercero():void{
    this.SetTerceroDesde();
    let info = this.normalize(JSON.stringify(this.TerceroModel));
    let datos = new FormData();
    
    datos.append("modulo",'Tercero');
    datos.append("datos",info);
    this.terceroService.saveTercero(datos).subscribe((data:any) => {
      this.ShowSwal('success', 'Registro Exitoso', 'Se registro el tercero exitosamente!');
      this.LimpiarModeloTercero();      
      this.ConsultaFiltrada();
      this.ModalTercero.hide();
    });
  }

  LimpiarModeloTercero(){
    this.TerceroModel = new TerceroModel();
  }

  SetTerceroDesde(){
    let year = new Date().getFullYear().toString().split('.').join("");
    let month = (new Date().getMonth() + 1).toString();
    month = month.length == 1 ? "0"+month : month;
    let day = (new Date().getDate()).toString();
    day = day.length == 1 ? day = "0"+day : day;
    this.TerceroModel.Tercero_Desde = year.concat("-",month,"-",day);
  }

  normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
          ret.push(mapping[c]);
        else
          ret.push(c);
      }
      return ret.join('');
    }

  })();

  TestClick(){
    console.log(this.TerceroModel);
    
  }

}
