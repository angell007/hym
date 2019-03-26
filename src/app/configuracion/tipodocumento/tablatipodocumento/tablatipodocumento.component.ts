import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { TipodocumentoService } from '../../../shared/services/tiposdocumento/tipodocumento.service';

@Component({
  selector: 'app-tablatipodocumento',
  templateUrl: './tablatipodocumento.component.html',
  styleUrls: ['./tablatipodocumento.component.scss', '../../../../style.scss']
})
export class TablatipodocumentoComponent implements OnInit {

  public TipoDocumentos:Array<any> = [];
  public TipoDocumentosPais:Array<any> = [];
  public Paises:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public AbrirModalTipoDocumento:Subject<any> = new Subject<any>();
  
  public Filtros:any = {
    nombre:'',
    pais_documento:'',
    codigo:'',
    pais:'',
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
              private _tipoDocumentoService:TipodocumentoService) 
  {
    this.RutaGifCargando = _generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
    this.GetPaises();
  }

  ngOnInit() {
  }

  GetPaises(){
    setTimeout(() => {
      this.Paises = this._generalService.getPaises();  
    }, 1000);
  }

  FiltrarDocumentosPais(idPais:string){
    if (this.Filtros.pais_documento == '') {
      this.Filtros.codigo = '';
      this.TipoDocumentosPais = [];
      this.ConsultaFiltrada();
    }else{
      let p = {id_pais:this.Filtros.pais_documento};
      this._tipoDocumentoService.getTiposDocumentoPais(p).subscribe((data:any) => {
        if (data.codigo == 'success') {
          this.TipoDocumentosPais = data.query_data;          
        }else{

          let toastObj = {textos:[data.titulo, 'No se encontraron tipos de documentos para '+this.GetNombrePais(idPais)], tipo:data.codigo, duracion:4000};
          this._toastService.ShowToast(toastObj);
        }
      });
    }
  }

  GetNombrePais(idPais):string{
    if (this.Paises.length > 0) {
      return this.Paises.find(x => x.Id_Pais == idPais).Nombre;
    }else{
      return '';
    }
  }

  AbrirModal(idTipoDocumento:string){
    this.AbrirModalTipoDocumento.next(idTipoDocumento);
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

    if (this.Filtros.codigo.trim() != "") {
      params.codigo = this.Filtros.codigo;
    }

    if (this.Filtros.pais.trim() != "") {
      params.pais = this.Filtros.pais;
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
    this._tipoDocumentoService.getListaTiposDocumento(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.TipoDocumentos = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.TipoDocumentos = [];
        this._swalService.ShowMessage(data);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues(){
    this.Filtros = {
      nombre:'',
      pais_documento:'',
      codigo:'',
      pais:'',
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

  CambiarEstadoTipoDocumento(idTipoDocumento:string){
    let datos = new FormData();
    datos.append("id_tipo_documento", idTipoDocumento);
    this._tipoDocumentoService.cambiarEstadoTipoDocumento(datos).subscribe((data:any) => {
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
