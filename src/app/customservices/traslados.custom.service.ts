import { Injectable, ViewChild } from '@angular/core';
import { GeneralService } from '../shared/services/general/general.service';
import { Globales } from '../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { CajeroService } from '../shared/services/cajeros/cajero.service';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Injectable()
export class TrasladosCustomService {

  public RutaGifCargando: string;
  public CargandoGiros: boolean = false;
  public Cargando: boolean = true;
  public Filtros: any = {
    codigo: '',
    destinatario: '',
    moneda: '',
    estado: '',
  };
  //Paginación
  public pageSizeRecibidos = 10;
  public pageSize = 10;
  public TotalItems: number;
  public TotalItemsRecibidos: number;
  public page = 1;
  public pageRecibidos = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0
  }
  public user = JSON.parse(localStorage['User']);
  public Cambios: any = [];
  public CajerosTraslados: any = [];
  Traslados: Array<string> = [];
  TrasladosRecibidos: any[];
  constructor(private generalService: GeneralService, public globales: Globales, private http: HttpClient, private cajeroService: CajeroService

  ) {

    this.TrasladosRecibidos = [];
    TimerObservable.create(0, 50000)
      .subscribe(() => {
        this.CargarDatosTraslados();
      });
  }
  public filtroCustom: string;

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

    if (this.Filtros.destinatario.trim() != "") {
      params.destinatario = this.Filtros.destinatario;
    }

    if (this.Filtros.moneda.trim() != "") {
      params.moneda = this.Filtros.moneda;
    }

    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
    }

    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    this.Cambios = [];
    var p = this.SetFiltros(paginacion);
    if (p === '') {
      this.ResetValues();
      return;
    }

    this.http.get(this.globales.ruta + 'php/pos/listar_traslado_funcionario_filter.php?', { params: p }).subscribe((data: any) => {
      // console.log(data);
      if (data.codigo == 'success') {
        this.Traslados = data.query_data;
        this.SetInformacionPaginacion(data)
      }
    });
  }

  ConsultaFiltradaRecibidos(paginacion: boolean = false) {
    this.Cambios = [];
    var p = this.SetFiltros(paginacion);
    if (p === '') {
      this.ResetValues();
      return;
    }

    this.http.get(this.globales.ruta + 'php/pos/listar_traslado_funcionario_filter_recibidos.php?', { params: p }).subscribe((data: any) => {
      // console.log(data);
      if (data.codigo == 'success') {
        this.TrasladosRecibidos = data.query_data;
        this.SetInformacionPaginacionRecibidos(data)
      }
    });
  }

  SetInformacionPaginacion(data: any) {
    this.TotalItems = data.length
    var calculoHasta = (this.pageRecibidos * this.pageSizeRecibidos);
    var desde = calculoHasta - this.pageSizeRecibidos + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;
    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

  SetInformacionPaginacionRecibidos(data: any) {
    this.TotalItemsRecibidos = data.length
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItemsRecibidos ? this.TotalItemsRecibidos : calculoHasta;
    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItemsRecibidos;
  }



  GetCajerosTraslados() {
    this.CajerosTraslados = [];
    this.cajeroService.getCajerosTraslados(this.user.Identificacion_Funcionario).subscribe((data: any) => {
      // console.log(data);
      if (data.codigo == 'success') {
        this.CajerosTraslados = data.query_data;
      } else {
      }
    });
  }

  CargarTrasladosDiarios() {
    this.Traslados = [];
    this.http.get(this.globales.ruta + 'php/pos/listar_traslado_funcionario.php', { params: { id: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.Traslados = data;
      this.SetInformacionPaginacion(data)
    });
  }

  CargarDatosTraslados() {
    this.CargarTrasladosDiarios();
    this.TrasladosRecibidos = [];
    this.http.get(this.globales.ruta + 'php/pos/traslado_recibido.php', { params: { id: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.TrasladosRecibidos = data;
      // console.log(data);
      this.SetInformacionPaginacionRecibidos(data)
    });

    this.GetCajerosTraslados();
    this.ResetValues();
  }

  ResetValues() {
    this.Filtros = {
      codigo: '',
      destinatario: '',
      moneda: '',
      estado: '',
    };
  }
}


