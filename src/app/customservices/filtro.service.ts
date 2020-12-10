import { Injectable, ViewChild } from '@angular/core';
import { GeneralService } from '../shared/services/general/general.service';
import { Globales } from '../shared/globales/globales';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FiltroService {

  public CargandoCambios : boolean = true;
  public RutaGifCargando: string;
  public CargandoGiros: boolean = false;

  public Filtros: any = {
    codigo: '',
    funcionario: '',
    tipo: ''
  };

  public pageSize = 10;
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0
  }
  public user = JSON.parse(localStorage['User']);
  public Cambios: any = [];
  constructor(private generalService: GeneralService, public globales: Globales, private http: HttpClient

  ) {

    // this.CargarCambiosDiarios()
  }
  public filtroCustom: string;

  ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  @ViewChild('alertSwal') alertSwal: any;

  SetFiltros(paginacion: boolean) {
    let params: any = {};
    params.funcionario = this.user.Identificacion_Funcionario

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1;
      params.pag = this.page;
    }

    if (this.Filtros.codigo.trim() != "") {
      params.codigo = this.Filtros.codigo;
    }

    params.tipo = this.Filtros.tipo;
    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    this.Cambios = [];
    var p = this.SetFiltros(paginacion);
    if (p === '') {
      this.ResetValues();
      return;
    }

    this.http.get(this.globales.ruta + 'php/cambio/get_filtre_cambios.php?', { params: p }).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Cambios = data.query_data;
        this.CargandoCambios=false;
        this.SetInformacionPaginacion(data.query_data);
      }
    });
  }

  SetInformacionPaginacion(data: any) {
    this.TotalItems = data.length
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;
    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

  CargarCambiosDiarios() {
    this.Cambios = [];
    this.http.get(this.globales.rutaNueva + 'cambios', { params: { funcionario: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
      // console.log(data);
      if (data.codigo == 'success') {        
        this.Cambios = data.query_data;
        this.CargandoCambios=false;
        this.SetInformacionPaginacion(data.query_data)
      } else {
        this.ShowSwal('success', 'Success', 'Debe recalcular el monto a entregar!');
      }
    });
  }

  ResetValues() {
    this.Filtros = {
      codigo: '',
      funcionario: '',
      tipo: '',
    };
  }
}
