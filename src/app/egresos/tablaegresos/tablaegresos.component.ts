import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { EgresoService } from '../../shared/services/egresos/egreso.service';
import { GrupoterceroService } from '../../shared/services/grupotercero.service';

@Component({
  selector: 'app-tablaegresos',
  templateUrl: './tablaegresos.component.html',
  styleUrls: ['./tablaegresos.component.scss', '../../../style.scss']
})
export class TablaegresosComponent implements OnInit {

  public Egresos:Array<any> = [];
  public GruposTerceros:Array<any> = [];
  public Monedas:Array<any> = [];
  public Cargando:boolean = false;
  public RutaGifCargando:string;
  
  public AbrirModalAgregar:Subject<any> = new Subject<any>();
  
  public Filtros:any = {
    codigo:'',
    funcionario:'',
    grupo:'',
    tercero:'',
    moneda:'',
    valor:''
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
              private _monedaService:MonedaService,
              private _egresoService:EgresoService,
              private _grupoService:GrupoterceroService) 
  {
    this.RutaGifCargando = _generalService.RutaImagenes+'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
    this.GetMonedas();
    this.GetGrupos();
  }

  ngOnInit() {
  }

  GetMonedas(){
    this._monedaService.getMonedas().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Monedas = data.query_data;
      }else{

        this.Monedas = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  AbrirModal(idEgreso:string){
    this.AbrirModalAgregar.next(idEgreso);
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

    if (this.Filtros.codigo.trim() != "") {
      params.codigo = this.Filtros.codigo;
    }

    if (this.Filtros.funcionario.trim() != "") {
      params.funcionario = this.Filtros.funcionario;
    }

    if (this.Filtros.tercero.trim() != "") {
      params.tercero = this.Filtros.tercero;
    }

    if (this.Filtros.grupo.trim() != "") {
      params.grupo = this.Filtros.grupo;
    }

    if (this.Filtros.valor.trim() != "") {
      params.valor = this.Filtros.valor;
    }

    if (this.Filtros.moneda.trim() != "") {
      params.moneda = this.Filtros.moneda;
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
    this._egresoService.getListaEgresos(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Egresos = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.Egresos = [];
        this._swalService.ShowMessage(data);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues(){
    this.Filtros = {
      codigo:'',
      funcionario:'',
      grupo:'',
      tercero:'',
      moneda:'',
      valor:''
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

  AnularEgreso(idEgreso:string){
    let datos = new FormData();
    datos.append("id_egreso", idEgreso);
    this._egresoService.anularEgreso(datos).subscribe((data:any) => {
      if (data.codigo == 'success') { 
        this.ConsultaFiltrada();
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }else{
        this._swalService.ShowMessage(data); 
      }
    });
  }

  

  public GetGrupos(){
    this._grupoService.getGrupos().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.GruposTerceros = data.query_data;
      }else{

        this.GruposTerceros = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

}